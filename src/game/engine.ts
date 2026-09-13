import {
  EMPTY_BAG,
  FACILITIES,
  FIRST_NAMES,
  LAST_NAMES,
  LOCATIONS,
  OCCUPATIONS,
  START_SHELTERS,
  TRAITS,
  WEAPONS,
  locById,
  occById,
  traitById,
} from "./data";
import { chance, jitter, pick, range, uid } from "./rng";
import type {
  Choice,
  CreateInput,
  EncounterState,
  FacilityId,
  GameState,
  JobId,
  LocationState,
  MissionState,
  OccupationId,
  Resources,
  Skills,
  Survivor,
  TraitId,
  WeaponId,
} from "./types";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function sumSkills(base: Skills, traits: TraitId[]): Skills {
  const s = { ...base };
  for (const id of traits) {
    const t = traitById(id);
    s.combat = clamp(s.combat + (t.combat ?? 0), 1, 10);
    s.stealth = clamp(s.stealth + (t.stealth ?? 0), 1, 10);
    s.medical = clamp(s.medical + (t.medical ?? 0), 1, 10);
    s.build = clamp(s.build + (t.build ?? 0), 1, 10);
  }
  return s;
}

function maxHpFor(occHp: number, traits: TraitId[]): number {
  let hp = occHp;
  for (const id of traits) hp += traitById(id).hp ?? 0;
  return clamp(hp, 50, 140);
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

function mapSur(state: GameState, id: string, fn: (s: Survivor) => Survivor): GameState {
  return {
    ...state,
    survivors: state.survivors.map((s) => (s.id === id ? fn(s) : s)),
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
  },
): { r: number; s: Survivor } {
  const occ = occById(opts.occupation);
  const skills = sumSkills(occ.skills, opts.traits);
  const maxHp = maxHpFor(occ.hp, opts.traits);
  const u = uid(stateR);
  let morale = 62;
  for (const t of opts.traits) morale += traitById(t).morale ?? 0;
  return {
    r: u.r,
    s: {
      id: u.id,
      name: opts.name,
      occupation: opts.occupation,
      traits: opts.traits,
      portrait: opts.portrait ?? occ.portrait,
      skills,
      hp: maxHp,
      maxHp,
      hunger: 80,
      thirst: 80,
      morale: clamp(morale, 20, 100),
      fatigue: 20,
      infected: false,
      weapon: opts.weapon ?? occ.weapon,
      stance: opts.stance,
      job: "rest",
      alive: true,
      death: "",
      daysIn: 0,
    },
  };
}

function randomName(r: number): { r: number; name: string } {
  const a = pick(r, FIRST_NAMES);
  const b = pick(a.r, LAST_NAMES);
  return { r: b.r, name: `${a.item} ${b.item}` };
}

export function randomCreate(r0 = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0): {
  r: number;
  input: CreateInput;
} {
  let r = r0 || 1;
  const occ = pick(r, OCCUPATIONS);
  r = occ.r;
  const pos = pick(r, TRAITS.filter((t) => t.kind === "pos"));
  r = pos.r;
  const neg = pick(r, TRAITS.filter((t) => t.kind === "neg"));
  r = neg.r;
  const sh = pick(r, START_SHELTERS);
  r = sh.r;
  const nm = randomName(r);
  return {
    r: nm.r,
    input: {
      name: nm.name,
      occupation: occ.item.id,
      posTrait: pos.item.id,
      negTrait: neg.item.id,
      shelterId: sh.item.id,
    },
  };
}

export function createNewGame(input: CreateInput): GameState {
  const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0 || 1;
  let r = seed;
  const start = START_SHELTERS.find((s) => s.id === input.shelterId)!;
  const player = makeSurvivor(r, {
    name: input.name.trim() || "無名",
    occupation: input.occupation,
    traits: [input.posTrait, input.negTrait],
    stance: "leader",
  });
  r = player.r;
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
    const known = !!loc.startKnown || loc.id === start.locationId;
    locations[loc.id] = {
      zombies: loc.id === start.locationId ? Math.max(0, z.n - 3) : z.n,
      discovered: known,
      cleared: false,
      occupied: loc.id === start.locationId,
      visited: loc.id === start.locationId,
      survivorOpen: loc.survivorChance > 0,
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
    version: 1,
    screen: "shelter",
    seed,
    rng: r,
    day: 1,
    survivors: [player.s],
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
    squadPick: [player.s.id],
    mapTarget: null,
    ended: null,
    muted: false,
    occupiedCount: 1,
  };
  state = pushLog(
    state,
    `${player.s.name}（${occ.name}）在${start.name}落腳。外頭的美國已經不是原來那張地圖。`,
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
  if (!isDiscovered(state, id)) return { ok: false, reason: "尚未探明" };
  if (id === state.shelter.locationId) return { ok: false, reason: "這裡就是家" };
  const loc = locById(id);
  if (state.resources.fuel < loc.fuel) return { ok: false, reason: `需要燃油 ${loc.fuel}` };
  if (living(state).length === 0) return { ok: false, reason: "沒有人能出門" };
  return { ok: true, reason: "" };
}

function squadOf(state: GameState, ids: string[]): Survivor[] {
  return ids.map((id) => byId(state, id)).filter((s) => s && s.alive);
}

function best(squad: Survivor[], key: keyof Skills): Survivor {
  return [...squad].sort((a, b) => b.skills[key] - a.skills[key])[0];
}

function zoneChoices(mission: MissionState, ammo: number): Choice[] {
  const c: Choice[] = [];
  if (!mission.searched) {
    c.push({ id: "search_quiet", label: "潛行搜索", hint: "慢、安靜、東西較少" });
    c.push({ id: "search_loud", label: "徹底翻找", hint: "快、吵、東西多" });
  }
  c.push({ id: "fight", label: "清理僵屍", hint: "降低此地數量，才能佔領", danger: true });
  if (mission.searched) c.push({ id: "next", label: "進入下一區" });
  c.push({ id: "extract", label: "帶著東西回去" });
  void ammo;
  return c;
}

function beginZone(state: GameState, index: number): GameState {
  const m = state.mission!;
  const loc = locById(m.locationId);
  const zoneName = loc.zones[Math.min(index, loc.zones.length - 1)];
  const ls = state.locations[m.locationId];
  const flavors = [
    `${zoneName}裡很暗。空氣黏，像有人在裡面住過、又突然離開。`,
    `你們踏進${zoneName}。地板上有拖痕，往裡面去。`,
    `${zoneName}安靜得不對勁。遠處有一下金屬碰撞，然後沒有了。`,
    `推開${zoneName}的門。灰塵、甜味、以及還沒走遠的腳步。`,
  ];
  const f = pick(state.rng, flavors);
  const promptBody =
    ls.zombies > 0
      ? `${f.item} 估計還有 ${ls.zombies} 隻在這棟裡遊蕩。`
      : `${f.item} 暫時聽不到拖步。也許真的清完了。`;
  const next: MissionState = {
    ...m,
    zoneIndex: index,
    zoneName,
    searched: false,
    phase: "zone",
    fightStyle: null,
    promptTitle: `${loc.name} · ${zoneName}`,
    promptBody,
    image: loc.image,
    choices: zoneChoices({ ...m, zoneIndex: index, searched: false }, state.resources.ammo),
  };
  return { ...state, rng: f.r, mission: next, screen: "mission" };
}

export function startMission(state: GameState, locationId: string, squadIds: string[]): GameState {
  const loc = locById(locationId);
  const squad = squadOf(state, squadIds);
  if (squad.length === 0) return state;
  const fuel = loc.fuel;
  const bag = EMPTY_BAG();
  const names = squad.map((s) => s.name).join("、");
  let next: GameState = {
    ...state,
    resources: { ...state.resources, fuel: state.resources.fuel - fuel },
    mapTarget: null,
    squadPick: squadIds,
    mission: {
      locationId,
      squadIds,
      zoneIndex: 0,
      zoneCount: loc.zones.length,
      zoneName: loc.zones[0],
      searched: false,
      bag,
      noise: 0,
      promptTitle: loc.name,
      promptBody: "",
      image: loc.image,
      choices: [],
      phase: "zone" as const,
      fightStyle: null,
    },
    locations: {
      ...state.locations,
      [locationId]: { ...state.locations[locationId], visited: true, discovered: true },
    },
  };
  next = pushLog(next, `${names}出發前往${loc.name}（${loc.state}）。`);
  next = beginZone(next, 0);
  return next;
}

function rollLoot(state: GameState, loud: boolean): { state: GameState; got: Partial<Resources> } {
  const m = state.mission!;
  const loc = locById(m.locationId);
  const squad = squadOf(state, m.squadIds);
  const scout = best(squad, "scavenge");
  let r = state.rng;
  const got: Partial<Resources> = {};
  const mult = (loud ? 1.25 : 0.75) * (0.7 + scout.skills.scavenge / 14);
  for (const [k, pair] of Object.entries(loc.loot) as [keyof Resources, [number, number]][]) {
    const n = range(r, pair[0], pair[1]);
    r = n.r;
    const amt = Math.max(0, Math.round(n.n * mult * (0.6 + stepNoise(r))));
    r = (r + 17) | 0;
    if (amt > 0) got[k] = amt;
  }
  if (loud) {
    const w = chance(r, 0.22);
    r = w.r;
    if (w.ok) {
      const wp = pick(r, ["knife", "bat", "pistol", "axe"] as WeaponId[]);
      r = wp.r;
      const target = scout;
      nextWeapon(state, target.id, wp.item);
    }
  }
  return { state: { ...state, rng: r }, got };
}

function stepNoise(r: number) {
  return ((r >>> 0) % 1000) / 1000;
}

function nextWeapon(state: GameState, id: string, w: WeaponId): void {
  const cur = byId(state, id);
  const better = WEAPONS[w].melee > WEAPONS[cur.weapon].melee || (WEAPONS[w].gun && !WEAPONS[cur.weapon].gun);
  if (better) {
    state.survivors = state.survivors.map((s) => (s.id === id ? { ...s, weapon: w } : s));
  }
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
  const moodPick = pick(r, ["grateful", "wary", "hostile", "hurt"] as EncounterState["mood"][]);
  r = moodPick.r;
  const pos = pick(r, TRAITS.filter((t) => t.kind === "pos"));
  r = pos.r;
  const neg = pick(r, TRAITS.filter((t) => t.kind === "neg"));
  r = neg.r;
  const bodies: Record<EncounterState["mood"], string> = {
    grateful: `${nm.name}從${m.zoneName}的櫃子後面爬出來，雙手空著。「我跟了你們一路。別開槍。我能幫忙。」`,
    wary: `${nm.name}用一根鐵管指著門口。「東西是我先看到的。你們要過，拿換的來。」眼神很活，不像被咬過。`,
    hostile: `暗處有上膛聲。${nm.name}（${occ.item.name}）已經把你們當入侵者。「放下袋子。走。或留下。」`,
    hurt: `${nm.name}靠在牆邊，小腿滲血，還醒著。「別留下我。求你們。我以前是${occ.item.name}。」`,
  };
  const enc: EncounterState = {
    name: nm.name,
    occupation: occ.item.id,
    portrait: occ.item.portrait,
    body: bodies[moodPick.item],
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

function attract(state: GameState, extra: number): GameState {
  const m = state.mission!;
  const ls = state.locations[m.locationId];
  const loc = locById(m.locationId);
  const add = Math.min(8, extra);
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

function hurt(
  state: GameState,
  id: string,
  dmg: number,
  infectP: number,
  cause: string,
): GameState {
  const s = byId(state, id);
  if (!s || !s.alive) return state;
  let r = state.rng;
  const inf = chance(r, infectP);
  r = inf.r;
  const hp = s.hp - dmg;
  const dead = hp <= 0;
  let next = mapSur(
    { ...state, rng: r },
    id,
    (x) => ({
      ...x,
      hp: Math.max(0, hp),
      infected: x.infected || (!dead && inf.ok),
      alive: !dead,
      death: dead ? cause : x.death,
      morale: clamp(x.morale - (dead ? 0 : 6), 0, 100),
    }),
  );
  if (dead) {
    next = pushLog(next, `${s.name}死了。${cause}`);
    next = checkWipe(next);
  } else if (inf.ok) {
    next = pushLog(next, `${s.name}被咬到了。傷口不乾淨。`);
  }
  return next;
}

function checkWipe(state: GameState): GameState {
  if (living(state).length > 0) return state;
  return {
    ...state,
    screen: "end",
    ended: {
      kind: "lose",
      reason: `第 ${state.day} 天，最後一個倖存者也沒回來。美國還在，只是沒有人記得你們。`,
    },
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
        promptTitle: m.zoneName,
        promptBody: "這一帶暫時清乾淨了。可以搜，也可以走。",
        choices: zoneChoices({ ...m, searched: m.searched }, state.resources.ammo),
      },
    };
  }
  const choices: Choice[] = [
    { id: "melee", label: "近戰", hint: "安靜，容易受傷", danger: true },
    {
      id: "gun",
      label: "開槍",
      hint: `耗彈、很吵、有效  · 彈藥 ${state.resources.ammo}`,
      danger: true,
      disabled: state.resources.ammo <= 0 || !squad.some((s) => WEAPONS[s.weapon].gun),
    },
    {
      id: "flank",
      label: "包抄",
      hint: "需要潛行",
      disabled: best(squad, "stealth").skills.stealth < 6,
    },
    { id: "back", label: "先不打" },
  ];
  return {
    ...state,
    mission: {
      ...m,
      phase: "fight",
      promptTitle: `接觸 · ${ls.zombies} 隻`,
      promptBody: `${m.zoneName}裡有東西在轉頭。選怎麼打——打完，這地方才有可能變成下一個家。`,
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
      ? best(squad, "stealth")
      : style === "gun"
        ? squad.find((s) => WEAPONS[s.weapon].gun) ?? best(squad, "combat")
        : best(squad, "combat");
  const w = WEAPONS[fighter.weapon];
  let power = fighter.skills.combat * 8 + w.melee * 2;
  let ammoUse = 0;
  let noise = 1;
  if (style === "gun") {
    ammoUse = Math.min(state.resources.ammo, 2 + Math.floor(ls.zombies / 8));
    power += 18 + ammoUse * 6;
    noise = 8;
  } else if (style === "flank") {
    power += fighter.skills.stealth * 4;
    noise = 2;
  } else {
    noise = 3;
  }
  const zPow = ls.zombies * 7 + m.noise;
  const rollA = range(r, 80, 120);
  r = rollA.r;
  const rollB = range(r, 80, 120);
  r = rollB.r;
  const score = power * (rollA.n / 100) - zPow * (rollB.n / 100);
  let kills = 1;
  if (style === "gun") kills = 2 + Math.floor(ammoUse / 2);
  if (style === "flank") kills = 1 + (fighter.skills.stealth >= 8 ? 2 : 1);
  if (score > 25) kills += 2;
  else if (score > 0) kills += 1;
  kills = Math.min(ls.zombies, kills);
  let next: GameState = { ...state, rng: r, resources: { ...state.resources, ammo: state.resources.ammo - ammoUse } };
  next = killZombies(next, kills);
  next = attract(next, noise);
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
  if (dmg > 0) next = hurt(next, fighter.id, dmg, infectP, "在任務中被撕開");
  if (next.ended) return next;
  const aliveSquad = squadOf(next, m.squadIds);
  if (aliveSquad.length === 0) {
    next = pushLog(next, `外出小隊全軍覆沒。${locById(m.locationId).name}把人吞了。`);
    return finishMission(next, false);
  }
  const body =
    score > 20
      ? `${fighter.name}解決了 ${kills} 隻。還剩 ${left}。`
      : score > 0
        ? `打贏了，但不乾淨。清掉 ${kills} 隻，還剩 ${left}。${fighter.name}喘得很重。`
        : `${fighter.name}幾乎被壓住。清掉 ${kills} 隻，還剩 ${left}。必須決定要不要撤。`;
  const cleared = left === 0;
  next = {
    ...next,
    mission: {
      ...next.mission!,
      phase: "zone",
      promptTitle: cleared ? "清場" : m.zoneName,
      promptBody: cleared
        ? `${body} 聽不到拖步了。如果願意，這裡可以成為下一座庇護所。`
        : body,
      choices: zoneChoices(next.mission!, next.resources.ammo),
    },
  };
  next = pushLog(next, `${fighter.name}在${m.zoneName}戰鬥，消滅 ${kills} 隻。`);
  return next;
}

function doSearch(state: GameState, loud: boolean): GameState {
  const m = state.mission!;
  const squad = squadOf(state, m.squadIds);
  const scout = best(squad, loud ? "scavenge" : "stealth");
  let next = { ...state };
  const loot = rollLoot(next, loud);
  next = loot.state;
  const bag = addRes(m.bag, loot.got);
  const noiseAdd = loud ? 5 : 1;
  next = attract(
    {
      ...next,
      mission: { ...m, bag, searched: true, noise: m.noise + noiseAdd },
    },
    loud ? 2 : 0,
  );
  const bits = Object.entries(loot.got)
    .filter(([, v]) => (v as number) > 0)
    .map(([k, v]) => `${labelRes(k)} ${v}`);
  const found = bits.length ? bits.join("、") : "幾乎是空的";
  const sneak = !loud && scout.skills.stealth >= 7;
  let body = loud
    ? `${scout.name}把抽屜整個拉開。聲音很大。找到：${found}。`
    : `${scout.name}貼著牆翻。找到：${found}。${sneak ? "幾乎沒弄出聲。" : ""}`;
  next = {
    ...next,
    mission: {
      ...next.mission!,
      promptTitle: m.zoneName,
      promptBody: body,
      choices: zoneChoices(next.mission!, next.resources.ammo),
    },
  };
  next = maybeEncounter(next);
  if (next.screen === "encounter") return next;
  const horde = chance(next.rng, loud ? 0.28 : 0.08 + next.mission!.noise / 80);
  next = { ...next, rng: horde.r };
  if (horde.ok && next.locations[m.locationId].zombies > 0) {
    next = attract(next, 3);
    next = {
      ...next,
      mission: {
        ...next.mission!,
        promptBody: `${body} 外頭傳來一串回應的呻吟。它們聽到了。`,
        choices: [
          { id: "fight", label: "迎上去", danger: true },
          { id: "extract", label: "立刻撤離", danger: true },
          { id: "next", label: "先換房間" },
        ],
      },
    };
  }
  return next;
}

function labelRes(k: string): string {
  return { food: "食物", water: "水", materials: "建材", medicine: "藥品", ammo: "彈藥", fuel: "燃油" }[k] ?? k;
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
          promptTitle: `${locById(m.locationId).name} · ${m.zoneName}`,
          promptBody: "先不打。還可以搜，或撤。",
          choices: zoneChoices(m, state.resources.ammo),
        },
      };
    }
    if (choiceId === "melee" || choiceId === "gun" || choiceId === "flank") {
      return resolveFight(state, choiceId);
    }
  }
  if (choiceId === "search_quiet") return doSearch(state, false);
  if (choiceId === "search_loud") return doSearch(state, true);
  if (choiceId === "fight") return fightPrompt(state);
  if (choiceId === "next") {
    const nxt = m.zoneIndex + 1;
    if (nxt >= m.zoneCount) {
      return {
        ...state,
        mission: {
          ...m,
          promptTitle: "盡頭",
          promptBody: "這棟能搜的都走完了。可以清場、佔領，或帶著袋子回家。",
          choices: [
            { id: "fight", label: "把剩下的清掉", danger: true },
            { id: "extract", label: "回家" },
          ],
        },
      };
    }
    return beginZone(state, nxt);
  }
  if (choiceId === "extract") return finishMission(state, true);
  return state;
}

function finishMission(state: GameState, success: boolean): GameState {
  const m = state.mission;
  if (!m) return state;
  const loc = locById(m.locationId);
  const ls = state.locations[m.locationId];
  let next: GameState = {
    ...state,
    resources: success ? addRes(state.resources, m.bag) : state.resources,
    mission: null,
    encounter: null,
  };
  const bagBits = Object.entries(m.bag)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${labelRes(k)} ${v}`)
    .join("、");
  if (success) {
    next = pushLog(next, `小隊從${loc.name}回來。${bagBits ? `帶回 ${bagBits}。` : "兩手空空。"}`);
  }
  const canOccupy = ls.zombies === 0 && success;
  if (canOccupy && loc.id !== state.shelter.locationId) {
    next = {
      ...next,
      screen: "occupy",
      mapTarget: loc.id,
    };
    next = pushLog(next, `${loc.name}暫時清場。可以搬過來，把這裡變成更大的家。`);
    return restNight(next, false);
  }
  next = { ...next, screen: "shelter", mapTarget: null };
  return restNight(next, true);
}

export function resolveEncounter(state: GameState, action: "invite" | "turn" | "fight" | "trade"): GameState {
  const enc = state.encounter;
  const m = state.mission;
  if (!enc || !m) return { ...state, screen: "mission", encounter: null };
  let next: GameState = { ...state, encounter: null, screen: "mission" };
  const livingN = living(state).length;
  if (action === "invite") {
    if (livingN >= state.shelter.capacity) {
      next = {
        ...next,
        mission: {
          ...m,
          promptBody: `${enc.name}看了看你們的人數。「你們住的地方已經滿了。我自己想辦法。」人影沒入走廊。`,
          choices: zoneChoices(m, state.resources.ammo),
        },
      };
      next = pushLog(next, `${enc.name}想加入，但庇護所已滿。`);
      return next;
    }
    if (enc.mood === "hostile") {
      const c = chance(next.rng, 0.45);
      next = { ...next, rng: c.r };
      if (!c.ok) {
        const target = squadOf(next, m.squadIds)[0];
        next = hurt(next, target.id, 16, 0.05, "被其他倖存者襲擊");
        if (next.ended) return next;
        next = pushLog(next, `${enc.name}假裝答應，然後動手。`);
        next = {
          ...next,
          mission: {
            ...next.mission!,
            promptBody: `${enc.name}撲上來。衝突很短。人跑了，東西還在。`,
            choices: zoneChoices(next.mission!, next.resources.ammo),
          },
        };
        return next;
      }
    }
    const made = makeSurvivor(next.rng, {
      name: enc.name,
      occupation: enc.occupation,
      traits: enc.traits,
      stance: enc.mood === "grateful" || enc.mood === "hurt" ? "friend" : enc.mood === "hostile" ? "rival" : "neutral",
      portrait: enc.portrait,
      weapon: enc.weapon,
    });
    next = {
      ...next,
      rng: made.r,
      survivors: [...next.survivors, made.s],
      mission: {
        ...m,
        promptBody: `${enc.name}點頭，把背包甩到肩上。「走。我不想一個人死在這兒。」`,
        choices: zoneChoices(m, next.resources.ammo),
      },
    };
    next = pushLog(next, `${enc.name}（${occById(enc.occupation).name}）加入了你們。`);
    return next;
  }
  if (action === "turn") {
    next = pushLog(next, `你們讓${enc.name}離開。`);
    next = {
      ...next,
      mission: {
        ...m,
        promptBody: `${enc.name}咒了一句，退回暗處。也許還會再遇見。`,
        choices: zoneChoices(m, next.resources.ammo),
      },
    };
    return next;
  }
  if (action === "trade") {
    const giveFood = Math.min(2, m.bag.food);
    const bag = { ...m.bag, food: m.bag.food - giveFood, medicine: m.bag.medicine + (enc.mood === "hurt" ? 0 : 2) };
    if (enc.mood === "hurt") {
      next.resources = addRes(next.resources, { medicine: 0 });
    }
    next = {
      ...next,
      mission: {
        ...m,
        bag,
        promptBody:
          giveFood > 0
            ? `你們丟出食物。${enc.name}扔回來一小包藥，然後消失。`
            : `${enc.name}看你們口袋空空，啐了一口走了。`,
        choices: zoneChoices({ ...m, bag }, next.resources.ammo),
      },
    };
    return next;
  }
  // fight
  const target = squadOf(next, m.squadIds)[0];
  const atk = range(next.rng, 10, 28);
  next = { ...next, rng: atk.r };
  next = hurt(next, target.id, atk.n, 0.04, "與敵對倖存者交火");
  if (next.ended) return next;
  const drop = range(next.rng, 1, 4);
  next = { ...next, rng: drop.r };
  const bag = addRes(m.bag, { ammo: drop.n, food: 1 });
  next = pushLog(next, `與${enc.name}交火。對方倒在${m.zoneName}。`);
  next = {
    ...next,
    mission: {
      ...m,
      bag,
      promptBody: `槍聲在${m.zoneName}裡彈了兩下。${enc.name}不再動。你們不是唯一的獵人。`,
      choices: zoneChoices({ ...m, bag }, next.resources.ammo),
    },
  };
  next = attract(next, 6);
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
  next = pushLog(next, `撤離${old.name}，佔領${loc.name}（${loc.state}）。新家能住 ${loc.occupyCapacity} 人。`);
  for (const n of loc.neighbors) {
    next = {
      ...next,
      locations: { ...next.locations, [n]: { ...next.locations[n], discovered: true } },
    };
  }
  if (loc.size === "metro") {
    next = {
      ...next,
      screen: "end",
      ended: {
        kind: "win",
        reason: `第 ${next.day} 天，你們把${loc.name}從廢土裡挖出來。美國還是廢墟，但這座城現在有燈。`,
      },
    };
  }
  return next;
}

export function declineOccupy(state: GameState): GameState {
  return { ...state, screen: "shelter", mapTarget: null };
}

export function assignJob(state: GameState, id: string, job: JobId): GameState {
  return mapSur(state, id, (s) => ({ ...s, job }));
}

export function kickSurvivor(state: GameState, id: string): GameState {
  const s = byId(state, id);
  if (!s || s.stance === "leader") return state;
  let next = mapSur(state, id, (x) => ({ ...x, alive: false, death: "被請離隊伍，從此失蹤" }));
  next = pushLog(next, `你們讓${s.name}離開。門在後面關上。`);
  return checkWipe(next);
}

export function upgradeFacility(state: GameState, id: FacilityId): GameState {
  const def = FACILITIES.find((f) => f.id === id)!;
  const lv = state.shelter.facilities[id];
  if (lv >= def.max) return state;
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
    resources: res,
    shelter: {
      ...state.shelter,
      facilities: { ...state.shelter.facilities, [id]: lv + 1 },
      capacity: id === "beds" ? state.shelter.capacity + 1 : state.shelter.capacity,
    },
  };
  next = pushLog(next, `${def.name}升到 ${lv + 1} 級。`);
  return next;
}

export function restNight(state: GameState, fromHome: boolean): GameState {
  if (state.ended) return state;
  let next: GameState = { ...state, day: state.day + 1 };
  const home = living(next).filter((s) => !next.mission || !next.mission.squadIds.includes(s.id) || fromHome);
  const kitchen = next.shelter.facilities.kitchen;
  const waterLv = next.shelter.facilities.water;
  const garden = next.shelter.facilities.garden;
  const inf = next.shelter.facilities.infirmary;
  const watch = next.shelter.facilities.watch;
  const people = living(next);
  const eat = Math.max(1, people.length - kitchen);
  const drink = Math.max(1, people.length - waterLv);
  const foodHave = next.resources.food;
  const waterHave = next.resources.water;
  const foodUsed = Math.min(foodHave, eat);
  const waterUsed = Math.min(waterHave, drink);
  next.resources = {
    ...next.resources,
    food: foodHave - foodUsed,
    water: waterHave - waterUsed,
  };
  const hungry = foodUsed < eat;
  const thirsty = waterUsed < drink;

  let foodGain = 0;
  let waterGain = waterLv;
  let medUsed = 0;
  let barricade = next.shelter.barricade;
  let radioFind = false;
  let radioPerson = false;

  for (const s of home) {
    if (!s.alive) continue;
    let hp = s.hp;
    let hunger = s.hunger;
    let thirst = s.thirst;
    let fatigue = s.fatigue;
    let morale = s.morale;
    let infected = s.infected;
    let alive = true;
    let death = s.death;

    hunger = clamp(hunger + (hungry ? -28 : 18) - (s.job === "cook" ? -8 : 0), 0, 100);
    thirst = clamp(thirst + (thirsty ? -34 : 22), 0, 100);
    if (s.job === "rest") {
      hp = clamp(hp + 12, 0, s.maxHp);
      fatigue = clamp(fatigue - 35, 0, 100);
      morale = clamp(morale + 4, 0, 100);
    } else {
      fatigue = clamp(fatigue + 12, 0, 100);
    }
    if (s.job === "farm" && garden > 0) {
      foodGain += Math.round(garden * (1 + s.skills.farm / 8));
    }
    if (s.job === "cook" && kitchen > 0) {
      foodGain += 1;
      morale = clamp(morale + 6, 0, 100);
    }
    if (s.job === "repair") {
      barricade = clamp(barricade + 8 + s.skills.build, 0, 100);
    }
    if (s.job === "craft" && next.shelter.facilities.workshop > 0 && next.resources.materials > 0) {
      next.resources = { ...next.resources, materials: next.resources.materials - 1 };
      barricade = clamp(barricade + 6, 0, 100);
    }
    if (s.job === "tend" && inf > 0) {
      hp = clamp(hp + 4, 0, s.maxHp);
      if (s.infected && next.resources.medicine > 0) {
        const c = chance(next.rng, 0.35 + s.skills.medical / 20 + inf * 0.1);
        next = { ...next, rng: c.r };
        if (c.ok) infected = false;
        medUsed += 1;
      }
    }
    if (s.job === "radio" && next.shelter.facilities.radio > 0) {
      const a = chance(next.rng, 0.35);
      next = { ...next, rng: a.r };
      if (a.ok) radioFind = true;
      const b = chance(next.rng, 0.12);
      next = { ...next, rng: b.r };
      if (b.ok) radioPerson = true;
    }
    if (hunger <= 0) {
      hp -= 18;
      morale -= 10;
    }
    if (thirst <= 0) {
      hp -= 24;
      morale -= 8;
    }
    if (infected) {
      hp -= 10;
      const worse = chance(next.rng, 0.18);
      next = { ...next, rng: worse.r };
      if (worse.ok && next.resources.medicine <= 0) {
        hp -= 20;
      }
      if (inf > 0 && next.resources.medicine > 0 && s.job !== "tend") {
        medUsed += 1;
        const c = chance(next.rng, 0.25 + inf * 0.1);
        next = { ...next, rng: c.r };
        if (c.ok) infected = false;
      }
    }
    if (hp <= 0) {
      alive = false;
      death = infected ? "感染發作" : hunger <= 0 || thirst <= 0 ? "脫水與飢餓" : "傷勢惡化";
    }
    morale = clamp(morale, 0, 100);
    next = mapSur(next, s.id, (x) => ({
      ...x,
      hp: Math.max(0, hp),
      hunger,
      thirst,
      fatigue,
      morale,
      infected,
      alive,
      death,
      daysIn: x.daysIn + 1,
    }));
    if (!alive) next = pushLog(next, `${s.name}在夜裡死去。${death}。`);
  }

  // heal others via tend
  const tender = home.find((s) => s.job === "tend" && s.alive);
  if (tender && inf > 0) {
    for (const o of living(next)) {
      if (o.hp < o.maxHp) {
        next = mapSur(next, o.id, (x) => ({ ...x, hp: clamp(x.hp + 10 + tender.skills.medical, 0, x.maxHp) }));
      }
      if (o.infected && next.resources.medicine > medUsed) {
        const c = chance(next.rng, 0.4 + tender.skills.medical / 15);
        next = { ...next, rng: c.r };
        if (c.ok) {
          next = mapSur(next, o.id, (x) => ({ ...x, infected: false }));
          medUsed += 1;
          next = pushLog(next, `${tender.name}清掉了${o.name}的感染。`);
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
  next.shelter = { ...next.shelter, barricade };

  if (radioFind) {
    const hidden = LOCATIONS.filter((l) => !next.locations[l.id].discovered);
    if (hidden.length) {
      const p = pick(next.rng, hidden);
      next = { ...next, rng: p.r };
      next.locations = { ...next.locations, [p.item.id]: { ...next.locations[p.item.id], discovered: true } };
      next = pushLog(next, `無線電收到雜訊……${p.item.name}（${p.item.state}）的位置被標了下來。`);
    }
  }
  if (radioPerson && living(next).length < next.shelter.capacity) {
    const occ = pick(next.rng, OCCUPATIONS);
    const nm = randomName(occ.r);
    const pos = pick(nm.r, TRAITS.filter((t) => t.kind === "pos"));
    const neg = pick(pos.r, TRAITS.filter((t) => t.kind === "neg"));
    const made = makeSurvivor(neg.r, {
      name: nm.name,
      occupation: occ.item.id,
      traits: [pos.item.id, neg.item.id],
      stance: "neutral",
    });
    next = { ...next, rng: made.r, survivors: [...next.survivors, made.s] };
    next = pushLog(next, `一個聲音從廢頻裡走來：${made.s.name}找到了你們的門。`);
  }

  const guards = home.filter((s) => s.job === "guard" && s.alive).length;
  const raidP = clamp((100 - barricade) / 220 - guards * 0.08 - watch * 0.06, 0, 0.45);
  const raid = chance(next.rng, raidP);
  next = { ...next, rng: raid.r };
  if (raid.ok && living(next).length > 0) {
    const victim = pick(
      next.rng,
      living(next).filter((s) => home.some((h) => h.id === s.id)) || living(next),
    );
    next = { ...next, rng: victim.r };
    const dmg = range(next.rng, 10, 28);
    next = { ...next, rng: dmg.r };
    next = hurt(next, victim.item.id, dmg.n, 0.2, "夜襲");
    next.resources = {
      ...next.resources,
      food: Math.max(0, next.resources.food - 2),
    };
    next.shelter = { ...next.shelter, barricade: clamp(next.shelter.barricade - 8, 0, 100) };
    if (!next.ended) next = pushLog(next, `夜襲。東西從圍牆縫裡擠進來。`);
  }

  if (hungry) next = pushLog(next, "存糧不夠。有人空著肚子睡。");
  if (thirsty) next = pushLog(next, "水不夠。喉嚨在夜裡發乾。");
  if (foodGain > 0) next = pushLog(next, `菜園與廚房產出食物 ${foodGain}。`);

  next = checkWipe(next);
  if (next.ended) return next;
  if (next.screen !== "occupy" && next.screen !== "end") next = { ...next, screen: "shelter" };
  return next;
}

export function daysOfFood(state: GameState): number {
  const n = Math.max(1, living(state).length - state.shelter.facilities.kitchen);
  if (n <= 0) return 99;
  return Math.floor(state.resources.food / n);
}
