import {
  EMPTY_BAG,
  FACES,
  FACILITIES,
  FIRST_NAMES,
  LAST_NAMES,
  LOCATIONS,
  OCCUPATIONS,
  SAVE_VERSION,
  START_SHELTERS,
  TRAITS,
  locById,
  occById,
  traitById,
  withOccupationTraits,
} from "./data";
import {
  armorOf,
  carryOf,
  degradeWorn,
  dressSurvivor,
  dmgFromArmor,
  gearById,
  infectFromArmor,
  labelItem,
  liveWeapon,
  luckMult,
  mintGear,
  repairWorst,
  rollSearchGear,
  salvageWorn,
} from "./gear";
import { t, tLoc, tResBits, tRoom } from "./i18n";
import {
  addBond,
  addSkillXp,
  applySkillXp,
  bondOf,
  canMission,
  canWork,
  clamp,
  composeSkills,
  effectiveSkills,
  emptySkills,
  grantSquadXpNoted,
  noteSkillUps,
  relationOf,
  skillFx,
  startingMorale,
  xpGainLine,
} from "./growth";
import { chance, jitter, pick, range, uid } from "./rng";
import type {
  Choice,
  CreateInput,
  EncounterState,
  EquipSlot,
  FacilityId,
  GameState,
  GearItem,
  JobId,
  LocationState,
  MissionState,
  OccupationId,
  Resources,
  Skills,
  Survivor,
  TraitId,
  WeaponId,
  Worn,
} from "./types";
import { MAX_AP, AP_COST, WALL_REPAIR_MATS, apOf, lootLeft, seedLoot, nightPressure, siteQuiet } from "./v03";
import { awayIds, isAway, resolveDispatches } from "./dispatch";

function maxHpFor(occHp: number, traits: TraitId[]): number {
  let hp = occHp;
  for (const id of traits) hp += traitById(id).hp ?? 0;
  return clamp(hp, 50, 140);
}

function has(s: Survivor, id: TraitId) {
  return s.traits.includes(id);
}

export function pushLog(state: GameState, text: string): GameState {
  const log = [{ day: state.day, text }, ...state.log].slice(0, 40);
  return { ...state, log };
}

export function living(state: GameState): Survivor[] {
  return state.survivors.filter((s) => s.alive);
}

export function byId(state: GameState, id: string): Survivor {
  return state.survivors.find((s) => s.id === id)!;
}

function trySpend(state: GameState, n: number): GameState | null {
  const have = apOf(state);
  if (have < n) return null;
  return { ...state, dayAP: have - n };
}

function bumpNoise(state: GameState, locId: string, add: number, alert = 0): GameState {
  const ls = state.locations[locId];
  const noiseToday = (ls.noiseToday ?? 0) + add;
  return {
    ...state,
    locations: {
      ...state.locations,
      [locId]: {
        ...ls,
        noiseToday,
        threat: Math.max(ls.threat ?? 0, noiseToday),
        alertLevel: (ls.alertLevel ?? 0) + alert,
      },
    },
  };
}

function mapSur(state: GameState, id: string, fn: (s: Survivor) => Survivor): GameState {
  return {
    ...state,
    survivors: state.survivors.map((s) => (s.id === id ? fn(s) : s)),
  };
}

function salvageToStash(state: GameState, s: Survivor): GameState {
  const items = salvageWorn(s);
  if (!items.length) return state;
  return {
    ...state,
    stash: [...(state.stash ?? []), ...items],
    survivors: state.survivors.map((x) =>
      x.id === s.id ? { ...x, worn: {}, weapon: "fists" as WeaponId } : x,
    ),
  };
}

function addRes(a: Resources, b: Partial<Resources>): Resources {
  return {
    food: a.food + (b.food ?? 0),
    water: a.water + (b.water ?? 0),
    materials: a.materials + (b.materials ?? 0),
    medicine: a.medicine + (b.medicine ?? 0),
    ammo: a.ammo + (b.ammo ?? 0),
    fuel: a.fuel + (b.fuel ?? 0),
  };
}

function makeSurvivor(
  stateR: number,
  opts: {
    name: string;
    occupation: OccupationId;
    traits: TraitId[];
    stance: Survivor["stance"];
    portrait?: string;
    weapon?: WeaponId;
    alloc?: Partial<Skills>;
  },
): { r: number; s: Survivor } {
  const occ = occById(opts.occupation);
  const traits = withOccupationTraits(opts.occupation, opts.traits);
  const skills = composeSkills(occ.skills, traits.map(traitById), opts.alloc ?? {});
  const maxHp = maxHpFor(occ.hp, traits);
  const u = uid(stateR);
  const morale = startingMorale(traits.map(traitById));
  return {
    r: u.r,
    s: {
      id: u.id,
      name: opts.name,
      occupation: opts.occupation,
      traits,
      portrait: opts.portrait ?? FACES[0].id,
      skills,
      skillXp: emptySkills(),
      skillBase: { ...skills },
      lastSkillUp: null,
      hp: maxHp,
      maxHp,
      hunger: 80,
      thirst: 80,
      morale,
      fatigue: 20,
      infected: false,
      weapon: opts.weapon ?? occ.weapon,
      worn: {} as Worn,
      stance: opts.stance,
      job: "rest",
      alive: true,
      death: "",
      daysIn: 0,
      kills: 0,
    },
  };
}

function randomName(r: number): { r: number; name: string } {
  const a = pick(r, FIRST_NAMES);
  const b = pick(a.r, LAST_NAMES);
  return { r: b.r, name: `${a.item} ${b.item}` };
}

function pickFace(r: number, used: string[] = []) {
  const free = FACES.filter((f) => !used.includes(f.id));
  return pick(r, free.length ? free : FACES);
}

export function randomCreate(r0 = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0): {
  r: number;
  input: CreateInput;
} {
  let r = r0 || 1;
  const occ = pick(r, OCCUPATIONS);
  r = occ.r;
  const pos = pick(r, TRAITS.filter((x) => x.kind === "pos"));
  r = pos.r;
  const neg = pick(r, TRAITS.filter((x) => x.kind === "neg"));
  r = neg.r;
  const sh = pick(r, START_SHELTERS);
  r = sh.r;
  const nm = randomName(r);
  r = nm.r;
  const face = pickFace(r);
  r = face.r;
  return {
    r,
    input: {
      name: nm.name,
      occupation: occ.item.id,
      portrait: face.item.id,
      traits: [pos.item.id, neg.item.id],
      alloc: {},
      shelterId: sh.item.id,
    },
  };
}

export function createNewGame(input: CreateInput): GameState {
  const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0 || 1;
  let r = seed;
  const start = START_SHELTERS.find((s) => s.id === input.shelterId)!;
  const player0 = makeSurvivor(r, {
    name: input.name.trim() || t("ui.anon"),
    occupation: input.occupation,
    traits: input.traits,
    stance: "leader",
    portrait: input.portrait || FACES[0].id,
    alloc: input.alloc,
  });
  const dressed = dressSurvivor(player0.r, input.occupation, player0.s);
  r = dressed.r;
  const bonus = pick(r, ["bat", "cap", "hoodie", "knife", "school"] as const);
  const extra = mintGear(bonus.r, bonus.item, 78);
  r = extra.r;
  const occ = occById(input.occupation);
  let resources: Resources = addRes(
    { food: 4, water: 4, materials: 2, medicine: 1, ammo: 0, fuel: 1 },
    occ.start,
  );
  resources = addRes(resources, start.extras);

  const locations: Record<string, LocationState> = {};
  for (const loc of LOCATIONS) {
    const z = jitter(r, loc.zombies, Math.max(1, Math.round(loc.zombies * 0.2)));
    r = z.r;
    const stock = seedLoot(r, loc.id);
    r = stock.r;
    const known = !!loc.startKnown || loc.id === start.locationId;
    locations[loc.id] = {
      zombies: loc.id === start.locationId ? Math.max(0, z.n - 3) : z.n,
      discovered: known,
      cleared: false,
      occupied: loc.id === start.locationId,
      visited: loc.id === start.locationId,
      survivorOpen: loc.survivorChance > 0,
      lootRemaining: stock.bag,
      threat: 0,
      noiseToday: 0,
      alertLevel: 0,
    };
  }

  const facilities: GameState["shelter"]["facilities"] = {
    beds: 0,
    kitchen: 0,
    water: 0,
    workshop: 0,
    infirmary: 0,
    garden: 0,
    radio: 0,
    watch: 0,
    ...start.facilities,
  };

  let state: GameState = {
    version: SAVE_VERSION,
    screen: "shelter",
    seed,
    rng: r,
    day: 1,
    dayAP: MAX_AP,
    maxAP: MAX_AP,
    survivors: [dressed.s],
    shelter: {
      locationId: start.locationId,
      capacity: start.capacity,
      facilities,
      barricade: start.barricade,
    },
    resources,
    locations,
    log: [],
    mission: null,
    encounter: null,
    squadPick: [dressed.s.id],
    mapTarget: null,
    ended: null,
    muted: false,
    occupiedCount: 1,
    bonds: {},
    stash: [...dressed.extra, extra.item],
    notices: [],
    dispatches: [],
  };
  state = pushLog(
    state,
    t("log.settle", { name: dressed.s.name, occ: t(`occ.${occ.id}`), place: t(`sh.${start.id}`) }),
  );
  return state;
}

export function isDiscovered(state: GameState, id: string): boolean {
  const loc = locById(id);
  const ls = state.locations[id];
  if (ls.discovered) return true;
  if (id === state.shelter.locationId) return true;
  const home = locById(state.shelter.locationId);
  if (home.neighbors.includes(id)) return true;
  if (state.shelter.facilities.radio >= 1 && loc.region === home.region) return true;
  if (state.shelter.facilities.radio >= 2) return true;
  return false;
}

export function canTravel(state: GameState, id: string): { ok: boolean; reason: string } {
  if (!isDiscovered(state, id)) return { ok: false, reason: t("travel.unknown") };
  if (id === state.shelter.locationId) return { ok: false, reason: t("travel.home") };
  const loc = locById(id);
  if (state.resources.fuel < loc.fuel) return { ok: false, reason: t("travel.fuel", { n: loc.fuel }) };
  if (living(state).length === 0) return { ok: false, reason: t("travel.nobody") };
  if (!living(state).filter((s) => !isAway(state, s.id)).some(canMission)) return { ok: false, reason: t("travel.mood") };
  if (apOf(state) < 1) return { ok: false, reason: t("ap.none") };
  return { ok: true, reason: "" };
}

function squadOf(state: GameState, ids: string[]): Survivor[] {
  return ids.map((id) => byId(state, id)).filter((s) => s && s.alive);
}

function best(state: GameState, squad: Survivor[], key: keyof Skills): Survivor {
  return [...squad].sort((a, b) => {
    const sa = effectiveSkills(state, a, squad.map((x) => x.id));
    const sb = effectiveSkills(state, b, squad.map((x) => x.id));
    return sb[key] - sa[key];
  })[0];
}

function zoneChoices(state: GameState): Choice[] {
  const mission = state.mission!;
  const dry = apOf(state) < 1;
  const hint = dry ? t("ap.need", { n: 1 }) : undefined;
  const c: Choice[] = [];
  if (!mission.searched) {
    c.push({
      id: "search_quiet",
      label: t("ch.searchQuiet"),
      hint: dry ? hint : t("ch.searchQuietHint"),
      disabled: dry,
    });
    c.push({
      id: "search_loud",
      label: t("ch.searchLoud"),
      hint: dry ? hint : t("ch.searchLoudHint"),
      disabled: dry,
    });
  }
  c.push({ id: "fight", label: t("ch.fight"), hint: dry ? hint : t("ch.fightHint"), danger: true, disabled: dry });
  if (mission.searched) c.push({ id: "next", label: t("ch.next"), hint: dry ? hint : t("ap.cost", { n: 1 }), disabled: dry });
  c.push({ id: "extract", label: t("ch.extract"), hint: t("ap.extract") });
  return c;
}

function choicesFor(state: GameState, mission: MissionState): Choice[] {
  return zoneChoices({ ...state, mission });
}

function beginZone(state: GameState, index: number): GameState {
  const m = state.mission!;
  const loc = locById(m.locationId);
  const zoneName = loc.zones[Math.min(index, loc.zones.length - 1)];
  const ls = state.locations[m.locationId];
  const zone = tRoom(zoneName);
  const flavors = [t("flav.0", { zone }), t("flav.1", { zone }), t("flav.2", { zone }), t("flav.3", { zone })];
  const f = pick(state.rng, flavors);
  const promptBody =
    ls.zombies > 0 ? `${f.item} ${t("flav.zeds", { n: ls.zombies })}` : `${f.item} ${t("flav.quiet")}`;
  const next: MissionState = {
    ...m,
    zoneIndex: index,
    zoneName,
    searched: false,
    phase: "zone",
    fightStyle: null,
    promptTitle: `${tLoc(loc.id)} · ${zone}`,
    promptBody,
    image: loc.image,
    choices: [],
  };
  next.choices = choicesFor({ ...state, rng: f.r, mission: next }, next);
  return { ...state, rng: f.r, mission: next, screen: "mission" };
}

export function startMission(state: GameState, locationId: string, squadIds: string[]): GameState {
  const loc = locById(locationId);
  const able = squadIds.filter((id) => {
    const s = state.survivors.find((x) => x.id === id);
    return s && canMission(s) && !isAway(state, id);
  });
  const fallback = squadIds.filter((id) => !isAway(state, id));
  const squad = squadOf(state, able.length ? able : fallback);
  if (squad.length === 0) return pushLog(state, t("log.noMoodGo"));
  if (squad.some((s) => has(s, "agoraphobic"))) {
    state = {
      ...state,
      survivors: state.survivors.map((s) =>
        able.includes(s.id) && has(s, "agoraphobic") ? { ...s, morale: clamp(s.morale - 6, 0, 100) } : s,
      ),
    };
  }
  const spent = trySpend(state, AP_COST.travel);
  if (!spent) return pushLog(state, t("ap.none"));
  const fuel = loc.fuel;
  const bag = EMPTY_BAG();
  const names = squad.map((s) => s.name).join(t("ui.comma"));
  let next: GameState = {
    ...spent,
    resources: { ...spent.resources, fuel: spent.resources.fuel - fuel },
    mapTarget: null,
    squadPick: squad.map((s) => s.id),
    mission: {
      locationId,
      squadIds: squad.map((s) => s.id),
      zoneIndex: 0,
      zoneCount: loc.zones.length,
      zoneName: loc.zones[0],
      searched: false,
      bag,
      finds: [],
      noise: 0,
      promptTitle: tLoc(loc.id),
      promptBody: t(`loc.${loc.id}.desc`),
      image: loc.image,
      choices: [],
      phase: "zone",
      fightStyle: null,
      kills: 0,
    },
    locations: {
      ...spent.locations,
      [locationId]: { ...spent.locations[locationId], visited: true, discovered: true },
    },
  };
  next = pushLog(next, t("log.depart", { names, loc: tLoc(loc.id), state: t(`state.${loc.region}`) }));
  return beginZone(next, 0);
}

function lootMult(scout: Survivor, loud: boolean): number {
  let lucky = 1;
  if (has(scout, "lucky")) lucky *= 1.16;
  if (has(scout, "unlucky")) lucky *= 0.84;
  if (has(scout, "organized")) lucky *= 1.12;
  if (!loud && has(scout, "burglarhands")) lucky *= 1.18;
  if (!loud && has(scout, "catseyes")) lucky *= 1.08;
  if (!loud && has(scout, "dextrous")) lucky *= 1.06;
  if (!loud && has(scout, "shortsighted")) lucky *= 0.9;
  return (loud ? 1.05 : 0.42) * lucky * (1 + carryOf([scout]) * 0.05);
}

function stepNoise(r: number) {
  return ((r >>> 0) % 1000) / 1000;
}

function autoWield(state: GameState, id: string, item: GearItem): GameState {
  const s = byId(state, id);
  if (!s) return state;
  const def = gearById(item.defId);
  if (!def || def.slot !== "weapon") return state;
  const old = s.worn?.weapon;
  const finds = (state.mission?.finds ?? []).filter((x) => x.uid !== item.uid);
  const stash = old ? [...(state.stash ?? []), old] : (state.stash ?? []);
  return {
    ...state,
    stash,
    mission: state.mission ? { ...state.mission, finds } : state.mission,
    survivors: state.survivors.map((x) =>
      x.id === id ? { ...x, worn: { ...x.worn, weapon: item }, weapon: def.id as WeaponId } : x,
    ),
  };
}

function rollLoot(state: GameState, loud: boolean): { state: GameState; got: Partial<Resources> } {
  const m = state.mission!;
  const loc = locById(m.locationId);
  const ls = state.locations[m.locationId];
  const remaining = { ...(ls.lootRemaining ?? EMPTY_BAG()) };
  const stock = lootLeft(remaining);
  const squad = squadOf(state, m.squadIds);
  const scout = best(state, squad, "scavenge");
  const sk = effectiveSkills(state, scout, m.squadIds);
  let r = state.rng;
  const got: Partial<Resources> = {};
  if (stock <= 0) {
    return {
      state: {
        ...state,
        rng: (r + 23) | 0,
        locations: { ...state.locations, [m.locationId]: { ...ls, lootRemaining: remaining } },
      },
      got,
    };
  }
  const scv = skillFx("scavenge", sk.scavenge);
  const sth = skillFx("stealth", sk.stealth);
  let mult = lootMult(scout, loud) * scv.loot;
  if (!loud) mult *= sth.quietLoot;
  for (const [k, pair] of Object.entries(loc.loot) as [keyof Resources, [number, number]][]) {
    const n = range(r, pair[0], pair[1]);
    r = n.r;
    const want = Math.max(0, Math.round(n.n * mult * (0.35 + stepNoise(r) * 0.45)));
    r = (r + 17) | 0;
    const amt = Math.min(want, remaining[k]);
    remaining[k] -= amt;
    if (amt > 0) got[k] = amt;
  }
  const luck = Math.max(...squad.map(luckMult));
  const rolled = rollSearchGear(r, loc.id, {
    luck,
    carry: carryOf(squad),
    loud,
    day: state.day,
    gearP: scv.gearP,
    extraGear: scv.extraGear,
  });
  r = rolled.r;
  let nextState: GameState = {
    ...state,
    rng: r,
    mission: { ...m, finds: [...(m.finds ?? []), ...rolled.items] },
    locations: { ...state.locations, [m.locationId]: { ...ls, lootRemaining: remaining } },
  };
  if (rolled.items.length) {
    const wep = rolled.items.find((it) => gearById(it.defId)?.slot === "weapon");
    const scoutW = liveWeapon(scout);
    if (wep && scoutW.melee <= 2) nextState = autoWield(nextState, scout.id, wep);
  }
  return { state: nextState, got };
}

function maybeEncounter(state: GameState): GameState {
  const m = state.mission!;
  const loc = locById(m.locationId);
  const ls = state.locations[m.locationId];
  if (!ls.survivorOpen) return state;
  let r = state.rng;
  const roll = chance(r, loc.survivorChance * (m.zoneIndex === 0 ? 1.15 : 0.7));
  r = roll.r;
  if (!roll.ok) return { ...state, rng: r };
  const occ = pick(r, OCCUPATIONS);
  r = occ.r;
  const nm = randomName(r);
  r = nm.r;
  const face = pickFace(r);
  r = face.r;
  const moodPick = pick(r, ["grateful", "wary", "hostile", "hurt"] as EncounterState["mood"][]);
  r = moodPick.r;
  const pos = pick(r, TRAITS.filter((x) => x.kind === "pos"));
  r = pos.r;
  const neg = pick(r, TRAITS.filter((x) => x.kind === "neg"));
  r = neg.r;
  const enc: EncounterState = {
    name: nm.name,
    occupation: occ.item.id,
    portrait: face.item.id,
    body: t(`enc.body.${moodPick.item}`, { name: nm.name, occ: t(`occ.${occ.item.id}`) }),
    mood: moodPick.item,
    skills: occ.item.skills,
    weapon: occ.item.weapon,
    traits: [pos.item.id, neg.item.id],
  };
  return {
    ...state,
    rng: r,
    encounter: enc,
    screen: "encounter",
    locations: {
      ...state.locations,
      [m.locationId]: { ...ls, survivorOpen: false },
    },
  };
}

function attract(state: GameState, extra: number, spawn = true): GameState {
  const m = state.mission!;
  const ls = state.locations[m.locationId];
  const loc = locById(m.locationId);
  const add = spawn ? Math.min(3, extra) : 0;
  return {
    ...state,
    locations: {
      ...state.locations,
      [m.locationId]: { ...ls, zombies: Math.min(loc.zombies + 15, ls.zombies + add) },
    },
    mission: { ...m, noise: m.noise + extra },
  };
}

function killZombies(state: GameState, n: number): GameState {
  const m = state.mission!;
  const ls = state.locations[m.locationId];
  const left = Math.max(0, ls.zombies - n);
  return {
    ...state,
    locations: {
      ...state.locations,
      [m.locationId]: { ...ls, zombies: left, cleared: left === 0 },
    },
  };
}

function shiftMorale(state: GameState, ids: string[] | "all", delta: number): GameState {
  return {
    ...state,
    survivors: state.survivors.map((s) => {
      if (!s.alive) return s;
      if (ids !== "all" && !ids.includes(s.id)) return s;
      return { ...s, morale: clamp(s.morale + delta, 0, 100) };
    }),
  };
}

function infectMod(s: Survivor): number {
  let m = 1;
  if (has(s, "thickskinned")) m *= 0.55;
  if (has(s, "thinskinned")) m *= 1.45;
  if (has(s, "lucky")) m *= 0.75;
  if (has(s, "unlucky")) m *= 1.3;
  if (has(s, "proneillness")) m *= 1.3;
  return m * infectFromArmor(s);
}

function dmgMod(s: Survivor): number {
  let m = 1;
  if (has(s, "thickskinned")) m *= 0.72;
  if (has(s, "thinskinned")) m *= 1.35;
  if (has(s, "weak")) m *= 1.15;
  if (has(s, "athletic") || has(s, "stout") || has(s, "strong")) m *= 0.92;
  const wound = skillFx("combat", s.skills.combat).woundPct;
  if (wound) m *= 1 - wound / 100;
  return m * dmgFromArmor(s);
}

function combatMod(s: Survivor): number {
  let m = 1;
  if (has(s, "coward")) m *= 0.82;
  if (has(s, "brave") || has(s, "desensitized")) m *= 1.08;
  if (has(s, "adrenaline") && s.hp / s.maxHp < 0.45) m *= 1.18;
  if (has(s, "pacifist")) m *= 0.9;
  if (has(s, "asthmatic")) m *= 0.92;
  return m;
}

function hurt(state: GameState, id: string, dmg: number, infectP: number, cause: string): GameState {
  const s = byId(state, id);
  if (!s || !s.alive) return state;
  let r = state.rng;
  const taken = Math.max(1, Math.round(dmg * dmgMod(s)));
  const inf = chance(r, infectP * infectMod(s));
  r = inf.r;
  const hp = s.hp - taken;
  const dead = hp <= 0;
  let moraleHit = dead ? 0 : has(s, "desensitized") ? 2 : 6;
  if (!dead && has(s, "hemophobic")) moraleHit += 8;
  let next = mapSur(
    { ...state, rng: r },
    id,
    (x) => ({
      ...x,
      hp: Math.max(0, hp),
      infected: x.infected || (!dead && inf.ok),
      alive: !dead,
      death: dead ? cause : x.death,
      morale: clamp(x.morale - moraleHit, 0, 100),
    }),
  );
  if (dead) {
    next = salvageToStash(next, s);
    next = pushLog(next, t("log.died", { name: s.name, cause }));
    for (const o of living(next)) {
      const rel = relationOf(bondOf(next, o.id, s.id)).id;
      let drop = 18;
      if (rel === "friend") drop = 26;
      if (rel === "lover") drop = 34;
      next = mapSur(next, o.id, (x) => ({ ...x, morale: clamp(x.morale - drop, 0, 100) }));
    }
    next = pushLog(next, t("log.grief"));
    next = checkWipe(next);
  } else if (inf.ok) {
    next = pushLog(next, t("log.bitten", { name: s.name }));
  }
  return next;
}

function checkWipe(state: GameState): GameState {
  if (living(state).length > 0) return state;
  return {
    ...state,
    screen: "end",
    ended: { kind: "lose", reason: t("end.loseBody", { day: state.day }) },
    mission: null,
    encounter: null,
  };
}

function fightPrompt(state: GameState): GameState {
  const m = state.mission!;
  const ls = state.locations[m.locationId];
  const squad = squadOf(state, m.squadIds);
  if (ls.zombies <= 0) {
    return {
      ...state,
      mission: {
        ...m,
        phase: "zone",
        promptTitle: tRoom(m.zoneName),
        promptBody: t("txt.fightCleared"),
        choices: choicesFor(state, { ...m, searched: m.searched }),
      },
    };
  }
  const choices: Choice[] = [
    { id: "melee", label: t("ch.melee"), hint: t("ch.meleeHint"), danger: true },
    {
      id: "gun",
      label: t("ch.gun"),
      hint: t("ch.gunHint", { n: state.resources.ammo }),
      danger: true,
      disabled: state.resources.ammo <= 0 || !squad.some((s) => liveWeapon(s).gun),
    },
    {
      id: "flank",
      label: t("ch.flank"),
      hint: t("ch.flankHint"),
      disabled: (() => {
        const sneak = effectiveSkills(state, best(state, squad, "stealth"), m.squadIds);
        return sneak.stealth < skillFx("stealth", sneak.stealth).flankNeed;
      })(),
    },
    { id: "back", label: t("ch.back") },
  ];
  return {
    ...state,
    mission: {
      ...m,
      phase: "fight",
      promptTitle: t("ch.contact", { n: ls.zombies }),
      promptBody: t("txt.fightBody", { zone: tRoom(m.zoneName) }),
      choices,
    },
  };
}

function resolveFight(state: GameState, style: "melee" | "gun" | "flank"): GameState {
  const m = state.mission!;
  const squad = squadOf(state, m.squadIds);
  if (squad.length === 0) return checkWipe(state);
  const ls = state.locations[m.locationId];
  let r = state.rng;
  const fighter =
    style === "flank"
      ? best(state, squad, "stealth")
      : style === "gun"
        ? squad.find((s) => liveWeapon(s).gun) ?? best(state, squad, "combat")
        : best(state, squad, "combat");
  const sk = effectiveSkills(state, fighter, m.squadIds);
  const w = liveWeapon(fighter);
  let power = (sk.combat * 8 + w.melee * 2) * combatMod(fighter);
  let ammoUse = 0;
  let noise = 1 + Math.round(armorOf(fighter).noise);
  if (style === "gun") {
    ammoUse = Math.min(state.resources.ammo, 2 + Math.floor(ls.zombies / 8));
    power += 18 + ammoUse * 6;
    noise = 8;
  } else if (style === "flank") {
    power += sk.stealth * 4;
    noise = 2;
  } else {
    noise = 3;
  }
  if (has(fighter, "quiet") || has(fighter, "inconspicuous") || has(fighter, "gymnast")) noise = Math.max(1, noise - 1);
  if (has(fighter, "clumsy") || has(fighter, "conspicuous")) noise += 2;
  if (has(fighter, "keenhearing")) power += 4;
  const cfx = skillFx("combat", sk.combat);
  const sfx = skillFx("stealth", sk.stealth);
  noise = Math.max(0, Math.round(noise * (1 - sfx.noisePct / 100)));
  const zPow = ls.zombies * 7 + m.noise;
  const rollA = range(r, 80, 120);
  r = rollA.r;
  const rollB = range(r, 80, 120);
  r = rollB.r;
  const score = power * (rollA.n / 100) - zPow * (rollB.n / 100);
  let kills = 1 + Math.floor(w.melee / 7) + cfx.extraKill;
  if (style === "gun") kills = 2 + ammoUse + Math.floor(sk.combat / 4) + (cfx.extraKill > 1 ? 1 : 0);
  if (style === "flank") kills = 1 + sfx.extraFlank;
  if (score > 25) kills += 2;
  else if (score > 5) kills += 1;
  else if (score < -20) kills = Math.max(1, kills - 1);
  kills = Math.min(ls.zombies, kills);
  if (ls.zombies - kills > 0 && ls.zombies - kills <= 2 && score >= -12) kills = ls.zombies;
  let next: GameState = { ...state, rng: r, resources: { ...state.resources, ammo: state.resources.ammo - ammoUse } };
  next = killZombies(next, kills);
  next = attract(next, noise, false);
  next = bumpNoise(next, m.locationId, noise, style === "gun" ? 1 : 0);
  const prevFighter = fighter;
  const worn = degradeWorn({ ...fighter, kills: fighter.kills + kills }, "weapon", 5 + Math.min(8, kills));
  const xp = applySkillXp(worn, "combat", 8 * kills);
  next = {
    ...next,
    survivors: next.survivors.map((s) => (s.id === fighter.id ? xp.survivor : s)),
    mission: next.mission ? { ...next.mission, kills: (next.mission.kills ?? 0) + kills } : next.mission,
  };
  next = noteSkillUps(next, prevFighter, xp.survivor);
  const left = next.locations[m.locationId].zombies;
  let dmg = 0;
  let infectP = 0;
  if (score < -10) {
    dmg = range(next.rng, 18, 40).n;
    next = { ...next, rng: range(next.rng, 18, 40).r };
    infectP = style === "melee" ? 0.35 : 0.22;
  } else if (score < 20) {
    dmg = range(next.rng, 6, 16).n;
    next = { ...next, rng: range(next.rng, 6, 16).r };
    infectP = style === "melee" ? 0.18 : 0.08;
  }
  if (dmg > 0) next = hurt(next, fighter.id, dmg, infectP, t("death.torn"));
  if (next.ended) return next;
  if (dmg > 0) {
    next = mapSur(next, fighter.id, (x) => (x.alive ? degradeWorn(degradeWorn(x, "body", 2), "head", 1) : x));
  }
  const aliveSquad = squadOf(next, m.squadIds);
  if (aliveSquad.length === 0) {
    next = pushLog(next, t("log.wipe", { loc: tLoc(locById(m.locationId).id) }));
    return finishMission(next, false);
  }
  const body =
    score > 20
      ? t("txt.win", { name: fighter.name, n: kills, left })
      : score > 0
        ? t("txt.ok", { name: fighter.name, n: kills, left })
        : t("txt.bad", { name: fighter.name, n: kills, left });
  const cleared = left === 0;
  next = {
    ...next,
    mission: {
      ...next.mission!,
      phase: "zone",
      promptTitle: cleared ? t("ch.clearedTitle") : tRoom(m.zoneName),
      promptBody: (cleared ? `${body} ${t("txt.canOccupy")}` : body) + (xpGainLine("combat", { ...xp, survivor: xp.survivor }) ? ` ${xpGainLine("combat", xp)}` : ""),
      choices: choicesFor(next, next.mission!),
    },
  };
  next = pushLog(next, t("log.fight", { name: fighter.name, zone: tRoom(m.zoneName), n: kills }));
  return next;
}

function doSearch(state: GameState, loud: boolean): GameState {
  const m = state.mission!;
  const squad = squadOf(state, m.squadIds);
  const scout = best(state, squad, loud ? "scavenge" : "stealth");
  const sk = effectiveSkills(state, scout, m.squadIds);
  let next = { ...state };
  const loot = rollLoot(next, loud);
  next = loot.state;
  const bag = addRes(m.bag, loot.got);
  let noiseAdd = loud ? 5 : 1;
  if (has(scout, "quiet") || has(scout, "gymnast") || has(scout, "burglarhands")) noiseAdd = Math.max(0, noiseAdd - 1);
  if (has(scout, "clumsy") || has(scout, "conspicuous")) noiseAdd += 2;
  if (!loud && has(scout, "burglarhands")) noiseAdd = 0;
  noiseAdd = Math.max(0, Math.round(noiseAdd * (1 - skillFx("stealth", sk.stealth).noisePct / 100)));
  const cur = next.mission!;
  next = attract(
    { ...next, mission: { ...cur, bag, searched: true, noise: cur.noise + noiseAdd } },
    loud ? 1 : 0,
  );
  next = bumpNoise(next, m.locationId, noiseAdd, loud ? 1 : 0);
  const prevScout = scout;
  next = grantSquadXpNoted(next, m.squadIds, loud ? "scavenge" : "stealth", loud ? 10 : 8);
  if (loud) next = grantSquadXpNoted(next, m.squadIds, "scavenge", 4);
  const train = loud ? "scavenge" as const : "stealth" as const;
  const searchNote = xpGainLine(train, applySkillXp(prevScout, train, loud ? 10 : 8));
  const bits = Object.entries(loot.got)
    .filter(([, v]) => (v as number) > 0)
    .map(([k, v]) => `${t(`res.${k}`)} ${v}`);
  const gearBits = (next.mission?.finds ?? [])
    .filter((it) => !(m.finds ?? []).some((old) => old.uid === it.uid))
    .map((it) => labelItem(it));
  const found = [...bits, ...gearBits].length ? [...bits, ...gearBits].join(t("ui.comma")) : t("txt.empty");
  const dryStock = lootLeft(next.locations[m.locationId].lootRemaining) <= 0 && bits.length === 0 && gearBits.length === 0;
  const sneak = !loud && sk.stealth >= 7;
  let body = loud
    ? t("txt.loudFind", { name: scout.name, found })
    : `${t("txt.quietFind", { name: scout.name, found })}${sneak ? t("txt.sneak") : ""}`;
  if (searchNote) body = `${body} ${searchNote}`;
  next = {
    ...next,
    mission: {
      ...next.mission!,
      promptTitle: tRoom(m.zoneName),
      promptBody: dryStock ? `${body} ${t("log.lootDry")}` : body,
      choices: choicesFor(next, next.mission!),
    },
  };
  if (dryStock) next = pushLog(next, t("log.lootDry"));
  if (apOf(next) >= AP_COST.encounter) next = maybeEncounter(next);
  if (next.screen === "encounter") return next;
  let hordeP = loud ? 0.34 : 0.14 + next.mission!.noise / 70;
  hordeP += (next.locations[m.locationId].noiseToday ?? 0) / 120;
  hordeP += (next.locations[m.locationId].alertLevel ?? 0) * 0.04;
  if (squad.some((s) => has(s, "inconspicuous"))) hordeP *= 0.65;
  if (squad.some((s) => has(s, "conspicuous"))) hordeP *= 1.4;
  const horde = chance(next.rng, hordeP);
  next = { ...next, rng: horde.r };
  if (horde.ok && next.locations[m.locationId].zombies > 0) {
    next = attract(next, 1);
    const dry = apOf(next) < 1;
    const need = dry ? t("ap.need", { n: 1 }) : undefined;
    next = {
      ...next,
      mission: {
        ...next.mission!,
        promptBody: `${body} ${t("txt.heard")}`,
        choices: [
          { id: "fight", label: t("ch.meet"), danger: true, disabled: dry, hint: need },
          { id: "extract", label: t("ch.fleeNow"), danger: true, hint: t("ap.extract") },
          { id: "next", label: t("ch.otherRoom"), disabled: dry, hint: need },
        ],
      },
    };
  }
  return next;
}

export function missionChoice(state: GameState, choiceId: string): GameState {
  const m = state.mission;
  if (!m) return state;
  if (m.phase === "fight") {
    if (choiceId === "back") {
      return {
        ...state,
        mission: {
          ...m,
          phase: "zone",
          promptTitle: `${tLoc(locById(m.locationId).id)} · ${tRoom(m.zoneName)}`,
          promptBody: t("txt.hold"),
          choices: choicesFor(state, m),
        },
      };
    }
    if (choiceId === "melee" || choiceId === "gun" || choiceId === "flank") {
      return resolveFight(state, choiceId);
    }
  }
  if (choiceId === "search_quiet" || choiceId === "search_loud") {
    const spent = trySpend(state, AP_COST.search);
    if (!spent) return state;
    return doSearch(spent, choiceId === "search_loud");
  }
  if (choiceId === "fight") {
    const spent = trySpend(state, AP_COST.fight);
    if (!spent) return state;
    return fightPrompt(spent);
  }
  if (choiceId === "next") {
    const nxt = m.zoneIndex + 1;
    if (nxt >= m.zoneCount) {
      return {
        ...state,
        mission: {
          ...m,
          promptTitle: t("ch.endTitle"),
          promptBody: t("txt.endBody"),
          choices: [
            { id: "fight", label: t("ch.clearRest"), danger: true },
            { id: "extract", label: t("ch.goHome") },
          ],
        },
      };
    }
    const spent = trySpend(state, AP_COST.next);
    if (!spent) return state;
    return beginZone(spent, nxt);
  }
  if (choiceId === "extract") return finishMission(state, true);
  return state;
}

function growBonds(state: GameState, ids: string[], success: boolean): GameState {
  let next = state;
  const alive = ids.filter((id) => next.survivors.find((s) => s.id === id && s.alive));
  if (alive.length < 2) return next;
  for (let i = 0; i < alive.length; i++) {
    for (let j = i + 1; j < alive.length; j++) {
      const a = byId(next, alive[i]);
      const b = byId(next, alive[j]);
      const selfish = has(a, "selfish") || has(b, "selfish");
      const base = success ? 8 : 4;
      const roll = range(next.rng, 3, base + (selfish ? 0 : 5) + (has(a, "leader") || has(b, "leader") ? 3 : 0));
      next = { ...next, rng: roll.r };
      const before = relationOf(bondOf(next, a.id, b.id));
      next = addBond(next, a.id, b.id, roll.n);
      const after = relationOf(bondOf(next, a.id, b.id));
      if (after.id !== before.id && (after.id === "friend" || after.id === "lover")) {
        next = pushLog(next, t("log.bond", { a: a.name, b: b.name, rel: after.name }));
      }
    }
  }
  return next;
}

function finishMission(state: GameState, success: boolean): GameState {
  const m = state.mission;
  if (!m) return state;
  const loc = locById(m.locationId);
  const ls = state.locations[m.locationId];
  let next: GameState = {
    ...state,
    resources: success ? addRes(state.resources, m.bag) : state.resources,
    stash: success ? [...(state.stash ?? []), ...(m.finds ?? [])] : (state.stash ?? []),
    mission: null,
    encounter: null,
  };
  const bagBits = tResBits(m.bag);
  if (success) {
    next = pushLog(next, t("log.return", { loc: tLoc(loc.id), bag: bagBits ? t("log.brought", { bag: bagBits }) : t("log.emptyBag") }));
    next = shiftMorale(next, m.squadIds, 8);
    if ((m.finds ?? []).length) {
      next = pushLog(next, t("log.gear", { n: m.finds.length, bits: m.finds.map(labelItem).join(t("ui.comma")) }));
    }
    if (ls.zombies > 0) {
      const fleeP = clamp(0.22 + ls.zombies / 50 + m.noise / 60, 0.22, 0.65);
      const flee = chance(next.rng, fleeP);
      next = { ...next, rng: flee.r };
      if (flee.ok) {
        const lost: Partial<Resources> = {};
        (Object.keys(m.bag) as (keyof Resources)[]).forEach((k) => {
          if (m.bag[k] > 0) lost[k] = -Math.min(next.resources[k], Math.max(1, Math.round(m.bag[k] * 0.35)));
        });
        if (Object.values(lost).some((n) => n)) {
          next = { ...next, resources: addRes(next.resources, lost) };
          next = pushLog(next, t("log.fleeBag"));
        }
        const hurtRoll = chance(next.rng, 0.5);
        next = { ...next, rng: hurtRoll.r };
        const victim = m.squadIds.map((id) => byId(next, id)).find((s) => s && s.alive);
        if (hurtRoll.ok && victim) {
          const dmg = range(next.rng, 8, 16);
          next = { ...next, rng: dmg.r };
          next = hurt(next, victim.id, dmg.n, 0.08, t("death.flee"));
          if (!next.ended) next = pushLog(next, t("log.fleeHurt", { name: victim.name }));
        }
      }
    }
    next = {
      ...next,
      survivors: next.survivors.map((s) => {
        if (!m.squadIds.includes(s.id) || !s.alive) return s;
        const fat = Math.max(0, armorOf(s).fatigue);
        return { ...s, fatigue: clamp(s.fatigue + fat, 0, 100) };
      }),
    };
  } else {
    next = pushLog(next, t("log.fail", { loc: tLoc(loc.id) }));
    next = shiftMorale(next, m.squadIds, -18);
    next = shiftMorale(next, "all", -6);
  }

  const overkill = Math.max(0, (m.kills ?? 0) - 12);
  if (overkill > 0) {
    const drop = Math.min(18, overkill);
    next = {
      ...next,
      survivors: next.survivors.map((s) => {
        if (!m.squadIds.includes(s.id) || !s.alive) return s;
        const extra = has(s, "pacifist") ? drop + 8 : has(s, "desensitized") ? Math.floor(drop / 3) : drop;
        return { ...s, morale: clamp(s.morale - extra, 0, 100) };
      }),
    };
    next = pushLog(next, t("log.tooManyKills"));
  }

  next = growBonds(next, m.squadIds, success);
  const canOccupy = siteQuiet(ls) && success;
  if (canOccupy && loc.id !== state.shelter.locationId) {
    next = { ...next, screen: "occupy", mapTarget: loc.id };
    next = pushLog(next, t("log.clear", { loc: tLoc(loc.id) }));
    return next;
  }
  next = { ...next, screen: "shelter", mapTarget: null };
  return next;
}

export function resolveEncounter(state: GameState, action: "invite" | "turn" | "fight" | "trade"): GameState {
  const enc = state.encounter;
  const m = state.mission;
  if (!enc || !m) return { ...state, screen: "mission", encounter: null };
  if (action !== "turn") {
    const spent = trySpend(state, AP_COST.encounter);
    if (!spent) return state;
    state = spent;
  }
  let next: GameState = { ...state, encounter: null, screen: "mission" };
  const livingN = living(state).length;
  if (action === "invite") {
    if (livingN >= state.shelter.capacity) {
      next = {
        ...next,
        mission: { ...m, promptBody: t("txt.fullHouse", { name: enc.name }), choices: choicesFor(next, m) },
      };
      next = pushLog(next, t("log.full", { name: enc.name }));
      return next;
    }
    if (enc.mood === "hostile") {
      const c = chance(next.rng, 0.45);
      next = { ...next, rng: c.r };
      if (!c.ok) {
        const target = squadOf(next, m.squadIds)[0];
        next = hurt(next, target.id, 16, 0.05, t("death.survivor"));
        if (next.ended) return next;
        next = pushLog(next, t("log.betray", { name: enc.name }));
        next = {
          ...next,
          mission: {
            ...next.mission!,
            promptBody: t("txt.betray", { name: enc.name }),
            choices: choicesFor(next, next.mission!),
          },
        };
        return next;
      }
    }
    const made0 = makeSurvivor(next.rng, {
      name: enc.name,
      occupation: enc.occupation,
      traits: enc.traits,
      stance: enc.mood === "grateful" || enc.mood === "hurt" ? "friend" : enc.mood === "hostile" ? "rival" : "neutral",
      portrait: enc.portrait,
      weapon: enc.weapon,
    });
    const dressed = dressSurvivor(made0.r, enc.occupation, made0.s);
    next = {
      ...next,
      rng: dressed.r,
      stash: [...(next.stash ?? []), ...dressed.extra],
      survivors: [...next.survivors, dressed.s],
      mission: { ...m, promptBody: t("txt.joinWalk", { name: enc.name }), choices: choicesFor(next, m) },
    };
    const seed = enc.mood === "grateful" || enc.mood === "hurt" ? 18 : enc.mood === "hostile" ? 4 : 10;
    for (const id of m.squadIds) next = addBond(next, dressed.s.id, id, seed);
    next = pushLog(next, t("log.join", { name: enc.name, occ: t(`occ.${enc.occupation}`) }));
    return next;
  }
  if (action === "turn") {
    next = pushLog(next, t("log.leave", { name: enc.name }));
    next = {
      ...next,
      mission: { ...m, promptBody: t("txt.turnedAway", { name: enc.name }), choices: choicesFor(next, m) },
    };
    return next;
  }
  if (action === "trade") {
    const giveFood = Math.min(2, m.bag.food);
    const bag = { ...m.bag, food: m.bag.food - giveFood, medicine: m.bag.medicine + (enc.mood === "hurt" ? 0 : 2) };
    next = {
      ...next,
      mission: {
        ...m,
        bag,
        promptBody: giveFood > 0 ? t("txt.tradeOk", { name: enc.name }) : t("txt.tradeEmpty", { name: enc.name }),
        choices: choicesFor(next, { ...m, bag }),
      },
    };
    return next;
  }
  const target = squadOf(next, m.squadIds)[0];
  const atk = range(next.rng, 10, 28);
  next = { ...next, rng: atk.r };
  next = hurt(next, target.id, atk.n, 0.04, t("death.firefight"));
  if (next.ended) return next;
  const drop = range(next.rng, 1, 4);
  next = { ...next, rng: drop.r };
  const bag = addRes(m.bag, { ammo: drop.n, food: 1 });
  next = pushLog(next, t("log.firefight", { name: enc.name, zone: tRoom(m.zoneName) }));
  next = {
    ...next,
    mission: {
      ...m,
      bag,
      promptBody: t("txt.shot", { zone: tRoom(m.zoneName), name: enc.name }),
      choices: choicesFor(next, { ...m, bag }),
    },
  };
  next = attract(next, 2);
  return next;
}

export function occupyHere(state: GameState): GameState {
  const id = state.mapTarget;
  if (!id) return { ...state, screen: "shelter" };
  const loc = locById(id);
  const old = locById(state.shelter.locationId);
  const fac = { ...state.shelter.facilities };
  for (const [k, v] of Object.entries(loc.occupyFacilities) as [FacilityId, number][]) {
    fac[k] = Math.max(fac[k], v);
  }
  let next: GameState = {
    ...state,
    screen: "shelter",
    mapTarget: null,
    occupiedCount: state.occupiedCount + 1,
    shelter: {
      locationId: id,
      capacity: loc.occupyCapacity,
      facilities: fac,
      barricade: Math.max(state.shelter.barricade, loc.occupyBarricade),
    },
    locations: {
      ...state.locations,
      [old.id]: { ...state.locations[old.id], occupied: false },
      [id]: { ...state.locations[id], occupied: true, cleared: true, zombies: 0, discovered: true },
    },
  };
  next = pushLog(
    next,
    t("log.move", { old: tLoc(old.id), loc: tLoc(loc.id), state: t(`state.${loc.region}`), n: loc.occupyCapacity }),
  );
  for (const n of loc.neighbors) {
    next = { ...next, locations: { ...next.locations, [n]: { ...next.locations[n], discovered: true } } };
  }
  if (loc.size === "metro") {
    next = {
      ...next,
      screen: "end",
      ended: { kind: "win", reason: t("end.winBody", { day: next.day, loc: tLoc(loc.id) }) },
    };
  }
  return next;
}

export function declineOccupy(state: GameState): GameState {
  return { ...state, screen: "shelter", mapTarget: null };
}

export function assignJob(state: GameState, id: string, job: JobId): GameState {
  if (isAway(state, id)) return state;
  return mapSur(state, id, (s) => ({ ...s, job }));
}

export function kickSurvivor(state: GameState, id: string): GameState {
  const s = byId(state, id);
  if (!s || s.stance === "leader") return state;
  let next = salvageToStash(state, s);
  next = mapSur(next, id, (x) => ({ ...x, alive: false, death: t("death.kick") }));
  next = shiftMorale(next, "all", -8);
  next = pushLog(next, t("log.kick", { name: s.name }));
  return checkWipe(next);
}

export function upgradeFacility(state: GameState, id: FacilityId): GameState {
  const def = FACILITIES.find((f) => f.id === id)!;
  const lv = state.shelter.facilities[id];
  if (lv >= def.max) return state;
  if (apOf(state) < AP_COST.build) return state;
  const costM = def.cost.materials * (lv + 1);
  const extra = def.cost.extra ?? {};
  if (state.resources.materials < costM) return state;
  for (const [k, v] of Object.entries(extra)) {
    if (state.resources[k as keyof Resources] < (v as number) * (lv + 1)) return state;
  }
  let res = { ...state.resources, materials: state.resources.materials - costM };
  for (const [k, v] of Object.entries(extra)) {
    const key = k as keyof Resources;
    res[key] = res[key] - (v as number) * (lv + 1);
  }
  let next: GameState = {
    ...state,
    dayAP: apOf(state) - AP_COST.build,
    resources: res,
    shelter: {
      ...state.shelter,
      facilities: { ...state.shelter.facilities, [id]: lv + 1 },
      capacity: id === "beds" ? state.shelter.capacity + 1 : state.shelter.capacity,
    },
  };
  next = pushLog(next, t("log.upgrade", { fac: t(`fac.${id}`), n: lv + 1 }));
  return next;
}

export function repairWall(state: GameState): GameState {
  if (apOf(state) < AP_COST.repairWall) return state;
  if (state.resources.materials < WALL_REPAIR_MATS) return state;
  const handy = living(state).some((s) => has(s, "handy") || has(s, "vehicleknow"));
  const builder = [...living(state)].sort((a, b) => b.skills.build - a.skills.build)[0];
  const bfx = skillFx("build", builder?.skills.build ?? 0);
  const gain = bfx.wall + bfx.wallExtra + (handy ? 3 : 0);
  const barricade = clamp(state.shelter.barricade + gain, 0, 100);
  let next: GameState = {
    ...state,
    dayAP: apOf(state) - AP_COST.repairWall,
    resources: { ...state.resources, materials: state.resources.materials - WALL_REPAIR_MATS },
    shelter: { ...state.shelter, barricade },
  };
  const worker = [...living(next)].sort((a, b) => b.skills.build - a.skills.build)[0];
  if (worker) {
    const prev = worker;
    const xp = applySkillXp(worker, "build", 8);
    next = mapSur(next, worker.id, () => xp.survivor);
    next = noteSkillUps(next, prev, xp.survivor);
  }
  next = pushLog(next, t("log.repairWall", { n: barricade }));
  return next;
}

export function restNight(state: GameState, fromHome: boolean): GameState {
  if (state.ended) return state;
  let next: GameState = {
    ...state,
    day: state.day + 1,
    dayAP: state.maxAP ?? MAX_AP,
  };
  const away = awayIds(next);
  const home = living(next).filter(
    (s) => !away.has(s.id) && (!next.mission || !next.mission.squadIds.includes(s.id) || fromHome),
  );
  const kitchen = next.shelter.facilities.kitchen;
  const waterLv = next.shelter.facilities.water;
  const garden = next.shelter.facilities.garden;
  const inf = next.shelter.facilities.infirmary;
  const watch = next.shelter.facilities.watch;
  const people = living(next).filter((s) => !away.has(s.id));
  const eaters = people.reduce((n, s) => n + (has(s, "heartyappetite") ? 1.4 : has(s, "lighteater") ? 0.7 : 1), 0);
  const drinkers = people.reduce((n, s) => n + (has(s, "highthirst") ? 1.5 : has(s, "lowthirst") ? 0.7 : 1), 0);
  const waste = next.day >= 16 ? 1 : 0;
  const eat = Math.max(1, Math.round(eaters - kitchen * 0.4 + waste));
  const drink = Math.max(1, Math.round(drinkers - waterLv * 0.4 + waste));
  const foodHave = next.resources.food;
  const waterHave = next.resources.water;
  const foodUsed = Math.min(foodHave, eat);
  const waterUsed = Math.min(waterHave, drink);
  next.resources = { ...next.resources, food: foodHave - foodUsed, water: waterHave - waterUsed };
  const hungry = foodUsed < eat;
  const thirsty = waterUsed < drink;

  let foodGain = 0;
  let waterGain = waterLv > 0 ? Math.max(1, Math.round(waterLv * 0.6)) : 0;
  let medUsed = 0;
  let barricade = next.shelter.barricade;
  let radioFind = false;
  let radioPerson = false;

  for (const s of home) {
    if (!s.alive) continue;
    const working = canWork(s) && s.job !== "rest";
    const job = working ? s.job : "rest";
    if (!working && s.job !== "rest") next = pushLog(next, t("log.lieDown", { name: s.name }));
    let hp = s.hp;
    let hunger = s.hunger;
    let thirst = s.thirst;
    let fatigue = s.fatigue;
    let morale = s.morale;
    let infected = s.infected;
    let alive = true;
    let death = s.death;
    let nextS = s;

    let hungerDelta = hungry ? -28 : 18;
    if (has(s, "lighteater")) hungerDelta = hungry ? -18 : 26;
    if (has(s, "heartyappetite")) hungerDelta = hungry ? -40 : 10;
    if (has(s, "smoker")) hungerDelta -= 4;
    if (job === "cook") hungerDelta += 8;
    hunger = clamp(hunger + hungerDelta, 0, 100);

    let thirstDelta = thirsty ? -34 : 22;
    if (has(s, "lowthirst")) thirstDelta = thirsty ? -20 : 32;
    if (has(s, "highthirst")) thirstDelta = thirsty ? -50 : 12;
    thirst = clamp(thirst + thirstDelta, 0, 100);

    if (job === "rest") {
      let restHp = 12;
      if (has(s, "slowhealer")) restHp = 6;
      if (has(s, "athletic") || has(s, "stout")) restHp += 3;
      if (has(s, "unfit")) restHp -= 4;
      hp = clamp(hp + restHp, 0, s.maxHp);
      let restFat = 35;
      if (has(s, "wakeful")) restFat = 48;
      if (has(s, "sleepyhead")) restFat = 20;
      if (has(s, "insomnia")) restFat = 18;
      if (has(s, "unfit") || has(s, "asthmatic")) restFat -= 8;
      fatigue = clamp(fatigue - restFat, 0, 100);
      morale = clamp(morale + 6, 0, 100);
    } else {
      fatigue = clamp(fatigue + 12 + (has(s, "asthmatic") ? 6 : 0), 0, 100);
    }
    if (job === "farm" && garden > 0) {
      const ffx = skillFx("farm", s.skills.farm);
      foodGain += Math.round(garden * ffx.farmMul) + ffx.extraCrop + (has(s, "gardener") ? 1 : 0);
      nextS = addSkillXp(nextS, "farm", 12);
    }
    if (job === "cook" && kitchen > 0) {
      const kfx = skillFx("cook", s.skills.cook);
      foodGain += 1 + kfx.cookFood + (has(s, "keencook") ? 1 : 0);
      morale = clamp(morale + 8 + kfx.cookMorale, 0, 100);
      nextS = addSkillXp(nextS, "cook", 12);
    }
    if (job === "repair") {
      const rfx = skillFx("build", s.skills.build);
      barricade = clamp(barricade + rfx.wall + rfx.wallExtra + (has(s, "handy") || has(s, "vehicleknow") ? 3 : 0), 0, 100);
      nextS = addSkillXp(nextS, "build", 10);
    }
    if (job === "craft" && next.shelter.facilities.workshop > 0 && next.resources.materials > 0) {
      next.resources = { ...next.resources, materials: next.resources.materials - 1 };
      barricade = clamp(barricade + 6 + (has(s, "vehicleknow") ? 2 : 0), 0, 100);
      nextS = addSkillXp(nextS, "build", 8);
      const cfx = skillFx("build", nextS.skills.build);
      const amt = cfx.mend + (has(s, "handy") ? 3 : 0);
      const shopLv = next.shelter.facilities.workshop;
      let stash = repairWorst(next.stash ?? [], amt);
      if (shopLv >= 2 || cfx.doubleMend) stash = repairWorst(stash, amt);
      next.stash = stash;
      const folks = living(next);
      for (const p of folks) {
        const pieces = salvageWorn(p);
        if (!pieces.length) continue;
        const fixed = repairWorst(pieces, Math.round(amt * 0.6));
        const worn: Worn = {};
        for (const it of fixed) {
          const def = gearById(it.defId);
          if (def) worn[def.slot] = it;
        }
        next = mapSur(next, p.id, (x) => ({ ...x, worn: { ...x.worn, ...worn } }));
      }
      next = pushLog(next, t("log.repair", { name: s.name }));
    }
    if (job === "tend" && inf > 0) {
      const mfx = skillFx("medical", s.skills.medical);
      hp = clamp(hp + 4 + mfx.tendHp, 0, s.maxHp);
      nextS = addSkillXp(nextS, "medical", 12);
      if (has(s, "hemophobic")) morale -= 8;
      if (s.infected && next.resources.medicine > 0) {
        const c = chance(next.rng, skillFx("medical", s.skills.medical).cure * 0.7 + inf * 0.1);
        next = { ...next, rng: c.r };
        if (c.ok) infected = false;
        medUsed += 1;
      }
    }
    if (job === "radio" && next.shelter.facilities.radio > 0) {
      const a = chance(next.rng, 0.35);
      next = { ...next, rng: a.r };
      if (a.ok) radioFind = true;
      const b = chance(next.rng, 0.12);
      next = { ...next, rng: b.r };
      if (b.ok) radioPerson = true;
    }
    if (hungry) morale -= 14;
    if (thirsty) morale -= 10;
    if (has(s, "smoker")) morale -= 3;
    if (has(s, "depressed")) morale -= 6;
    if (has(s, "outdoorsman")) morale += 2;
    if (hunger <= 0) {
      hp -= has(s, "irongut") ? 10 : has(s, "weakstomach") ? 24 : 18;
      morale -= 10;
    }
    if (thirst <= 0) {
      hp -= 24;
      morale -= 8;
    }
    if (infected) {
      hp -= Math.round(10 * (has(s, "proneillness") ? 1.4 : 1));
      const worse = chance(next.rng, 0.18 + (has(s, "proneillness") ? 0.1 : 0));
      next = { ...next, rng: worse.r };
      if (worse.ok && next.resources.medicine <= 0) hp -= 20;
      if (inf > 0 && next.resources.medicine > 0 && job !== "tend") {
        medUsed += 1;
        const c = chance(next.rng, 0.25 + inf * 0.1);
        next = { ...next, rng: c.r };
        if (c.ok) infected = false;
      }
    }
    if (hp <= 0) {
      alive = false;
      death = infected ? t("death.infect") : hunger <= 0 || thirst <= 0 ? t("death.starve") : t("death.wound");
    }
    morale = clamp(morale, 0, 100);
    next = mapSur(next, s.id, (x) => ({
      ...x,
      skills: nextS.skills,
      skillXp: nextS.skillXp,
      hp: Math.max(0, hp),
      hunger,
      thirst,
      fatigue,
      morale,
      infected,
      alive,
      death,
      daysIn: x.daysIn + 1,
      job: working ? x.job : "rest",
    }));
    if (!alive) {
      next = salvageToStash(next, s);
      next = pushLog(next, t("log.nightDeath", { name: s.name, cause: death }));
      for (const o of living(next)) {
        const rel = relationOf(bondOf(next, o.id, s.id)).id;
        const drop = rel === "lover" ? 28 : rel === "friend" ? 20 : 12;
        next = mapSur(next, o.id, (x) => ({ ...x, morale: clamp(x.morale - drop, 0, 100) }));
      }
    } else {
      next = noteSkillUps(next, s, { ...s, skills: nextS.skills, skillXp: nextS.skillXp });
    }
  }

  const leader = living(next).find((s) => has(s, "leader"));
  if (leader) {
    next = {
      ...next,
      survivors: next.survivors.map((s) =>
        s.alive && s.id !== leader.id ? { ...s, morale: clamp(s.morale + 2, 0, 100) } : s,
      ),
    };
  }

  const tender = home.find((s) => s.job === "tend" && s.alive && canWork(s));
  if (tender && inf > 0) {
    for (const o of living(next)) {
      if (o.hp < o.maxHp) {
        next = mapSur(next, o.id, (x) => ({ ...x, hp: clamp(x.hp + skillFx("medical", tender.skills.medical).heal, 0, x.maxHp) }));
      }
      if (o.infected && next.resources.medicine > medUsed && !has(tender, "hemophobic")) {
        const c = chance(next.rng, skillFx("medical", tender.skills.medical).cure);
        next = { ...next, rng: c.r };
        if (c.ok) {
          next = mapSur(next, o.id, (x) => ({ ...x, infected: false }));
          medUsed += 1;
          next = pushLog(next, t("log.clearedInfect", { who: tender.name, name: o.name }));
        }
      }
    }
  }

  next.resources = {
    ...next.resources,
    food: next.resources.food + foodGain,
    water: next.resources.water + waterGain,
    medicine: Math.max(0, next.resources.medicine - medUsed),
  };
  if (next.resources.food > 10) {
    const rot = Math.max(1, Math.ceil((next.resources.food - 10) * 0.07));
    next.resources = { ...next.resources, food: next.resources.food - rot };
    next = pushLog(next, t("log.rot", { n: rot }));
  }
  next.shelter = { ...next.shelter, barricade };

  if (radioFind) {
    const hidden = LOCATIONS.filter((l) => !next.locations[l.id].discovered);
    if (hidden.length) {
      const p = pick(next.rng, hidden);
      next = { ...next, rng: p.r };
      next.locations = { ...next.locations, [p.item.id]: { ...next.locations[p.item.id], discovered: true } };
      next = pushLog(next, t("log.radioLoc", { loc: tLoc(p.item.id), state: t(`state.${p.item.region}`) }));
    }
  }
  if (radioPerson && living(next).length < next.shelter.capacity) {
    const occ = pick(next.rng, OCCUPATIONS);
    const nm = randomName(occ.r);
    const face = pickFace(nm.r);
    const pos = pick(face.r, TRAITS.filter((x) => x.kind === "pos"));
    const neg = pick(pos.r, TRAITS.filter((x) => x.kind === "neg"));
    const made = makeSurvivor(neg.r, {
      name: nm.name,
      occupation: occ.item.id,
      traits: [pos.item.id, neg.item.id],
      stance: "neutral",
      portrait: face.item.id,
    });
    const dressed = dressSurvivor(made.r, occ.item.id, made.s);
    next = {
      ...next,
      rng: dressed.r,
      stash: [...(next.stash ?? []), ...dressed.extra],
      survivors: [...next.survivors, dressed.s],
    };
    next = pushLog(next, t("log.radioPerson", { name: dressed.s.name }));
  }

  next = resolveDispatches(next);
  if (next.ended) return next;

  const stillHome = living(next).filter((s) => !awayIds(next).has(s.id));
  const guards = stillHome.filter((s) => s.job === "guard").length;
  const pressure = nightPressure(next.day);
  const floorP = 0.04 * Math.min(1, next.day / 8);
  const raidP = clamp(((100 - barricade) / 170) * pressure - guards * 0.055 - watch * 0.04, floorP, 0.75);
  const raid = chance(next.rng, raidP);
  next = { ...next, rng: raid.r };
  if (raid.ok && living(next).length > 0) {
    const pool = stillHome.filter((s) => s.alive);
    const victim = pick(next.rng, pool.length ? pool : living(next));
    next = { ...next, rng: victim.r };
    const dmg = range(next.rng, 14, 32);
    next = { ...next, rng: dmg.r };
    next = hurt(next, victim.item.id, dmg.n, 0.22, t("death.raid"));
    const steal = 2 + Math.floor(next.day / 12);
    next.resources = { ...next.resources, food: Math.max(0, next.resources.food - steal) };
    next.shelter = { ...next.shelter, barricade: clamp(next.shelter.barricade - 10, 0, 100) };
    if (!next.ended) next = pushLog(next, t("log.raid"));
    if (!next.ended && next.shelter.barricade < 35) {
      const extra = chance(next.rng, 0.4);
      next = { ...next, rng: extra.r };
      if (extra.ok) {
        const other = (pool.length ? pool : living(next)).filter((s) => s.id !== victim.item.id);
        if (other.length) {
          const v2 = pick(next.rng, other);
          next = { ...next, rng: v2.r };
          const d2 = range(next.rng, 8, 20);
          next = { ...next, rng: d2.r };
          next = hurt(next, v2.item.id, d2.n, 0.15, t("death.raid"));
          if (!next.ended) next = pushLog(next, t("log.raidHard"));
        }
      }
    }
  }

  if (hungry) next = pushLog(next, t("log.hungry"));
  if (thirsty) next = pushLog(next, t("log.thirsty"));
  if (foodGain > 0) next = pushLog(next, t("log.harvest", { n: foodGain }));

  const locations = { ...next.locations };
  let rr = next.rng;
  const wanderIds: string[] = [];
  for (const id of Object.keys(locations)) {
    const cur = locations[id];
    let loc = { ...cur, noiseToday: 0, threat: Math.max(0, (cur.threat ?? 0) - 5) };
    if (loc.zombies === 0) {
      const p = chance(rr, 0.05 + next.day / 400);
      rr = p.r;
      if (p.ok) {
        loc = { ...loc, zombies: 1, cleared: false };
        if (loc.discovered || loc.visited) wanderIds.push(id);
      }
    }
    locations[id] = loc;
  }
  next = { ...next, rng: rr, locations };
  for (const id of wanderIds) next = pushLog(next, t("log.wander", { loc: tLoc(id) }));

  next = checkWipe(next);
  if (next.ended) return next;
  if (next.screen !== "occupy" && next.screen !== "end") next = { ...next, screen: "shelter" };
  return next;
}

export function daysOfFood(state: GameState): number {
  const n = Math.max(1, Math.round(living(state).length - state.shelter.facilities.kitchen * 0.4));
  if (n <= 0) return 99;
  return Math.floor(state.resources.food / n);
}

export function extractMission(state: GameState): GameState {
  return finishMission(state, true);
}
export function failMission(state: GameState): GameState {
  return finishMission(state, false);
}
export function forceEncounter(state: GameState): GameState {
  if (!state.mission) return state;
  const loc = state.mission.locationId;
  return maybeEncounter({
    ...state,
    locations: { ...state.locations, [loc]: { ...state.locations[loc], survivorOpen: true } },
  });
}
export function grantMissionLoot(state: GameState, got: Partial<Resources>, gear?: GearItem[]): GameState {
  if (!state.mission) return state;
  const lootIds = state.mission.squadIds;
  let r = state.rng;
  let items = gear;
  if (items === undefined) {
    const squad = squadOf(state, state.mission.squadIds);
    const scout = squad[0];
    const rolled = rollSearchGear(r, state.mission.locationId, {
      luck: scout ? luckMult(scout) : 1,
      carry: carryOf(squad),
      loud: false,
      day: state.day,
    });
    r = rolled.r;
    items = rolled.items;
  }
  let next: GameState = {
    ...state,
    rng: r,
    mission: {
      ...state.mission,
      bag: addRes(state.mission.bag, got),
      finds: [...(state.mission.finds ?? []), ...items],
    },
  };
  if (items.length) {
    const wep = items.find((it) => gearById(it.defId)?.slot === "weapon");
    const scout = squadOf(next, next.mission!.squadIds)[0];
    if (wep && scout && liveWeapon(scout).melee <= 2) next = autoWield(next, scout.id, wep);
  }
  next = grantSquadXpNoted(next, lootIds, "scavenge", 6);
  return next;
}
export function missionKill(state: GameState, n: number, killerId?: string): GameState {
  if (!state.mission) return state;
  let next = killZombies(state, n);
  if (killerId) {
    const prev = next.survivors.find((s) => s.id === killerId);
    if (prev && prev.alive) {
      const xp = applySkillXp({ ...prev, kills: prev.kills + n }, "combat", 8 * n);
      next = { ...next, survivors: next.survivors.map((s) => (s.id === killerId ? xp.survivor : s)) };
      next = noteSkillUps(next, prev, xp.survivor);
    }
  }
  return next;
}
export function missionStrike(state: GameState, id: string, dmg: number, infect: boolean): GameState {
  return hurt(state, id, dmg, infect ? 1 : 0, t("death.torn"));
}

export function equipItem(state: GameState, survivorId: string, uid: string): GameState {
  const s = state.survivors.find((x) => x.id === survivorId && x.alive);
  if (!s) return state;
  const stash = state.stash ?? [];
  const idx = stash.findIndex((x) => x.uid === uid);
  if (idx < 0) return state;
  const item = stash[idx];
  const def = gearById(item.defId);
  if (!def) return state;
  const prev = s.worn?.[def.slot];
  const nextStash = stash.filter((x) => x.uid !== uid);
  if (prev) nextStash.push(prev);
  const weapon = def.slot === "weapon" ? (def.id as WeaponId) : s.weapon;
  return {
    ...state,
    stash: nextStash,
    survivors: state.survivors.map((x) =>
      x.id === survivorId ? { ...x, worn: { ...x.worn, [def.slot]: item }, weapon } : x,
    ),
  };
}

export function unequipSlot(state: GameState, survivorId: string, slot: EquipSlot): GameState {
  const s = state.survivors.find((x) => x.id === survivorId && x.alive);
  const item = s?.worn?.[slot];
  if (!s || !item) return state;
  const worn = { ...s.worn };
  delete worn[slot];
  const weapon = slot === "weapon" ? ("fists" as WeaponId) : s.weapon;
  return {
    ...state,
    stash: [...(state.stash ?? []), item],
    survivors: state.survivors.map((x) => (x.id === survivorId ? { ...x, worn, weapon } : x)),
  };
}

export function discardItem(state: GameState, uid: string): GameState {
  const stash = state.stash ?? [];
  const item = stash.find((x) => x.uid === uid);
  if (!item) return state;
  const mats = item.cond >= 40 ? 1 : 0;
  let next: GameState = {
    ...state,
    stash: stash.filter((x) => x.uid !== uid),
    resources: mats ? addRes(state.resources, { materials: mats }) : state.resources,
  };
  next = pushLog(
    next,
    mats ? t("log.discardSalvage", { name: labelItem(item), n: mats }) : t("log.discard", { name: labelItem(item) }),
  );
  return next;
}