/**
 * Overnight forage parties. Cheaper than a raid: 1 AP, no fuel,
 * returns at dusk with skill-weighted loot, injury, or a chance find.
 */
import {
  EMPTY_BAG,
  FACES,
  FIRST_NAMES,
  LAST_NAMES,
  LOCATIONS,
  OCCUPATIONS,
  TRAITS,
  locById,
  occById,
  traitById,
  withOccupationTraits,
} from "./data";
import { dressSurvivor, GEAR, labelItem, liveWeapon, mintGear, salvageWorn } from "./gear";
import {
  addSkillXp,
  applySkillXp,
  canWork,
  clamp,
  composeSkills,
  emptySkills,
  noteSkillUps,
  pairKey,
  startingMorale,
} from "./growth";
import { t, tLoc, tResBits } from "./i18n";
import { addHerb, herbCount, knowsOnSight, nameByDoctor, rollHerb } from "./herbs";
import { chance, pick, range, uid } from "./rng";
import type {
  DispatchFocus,
  DispatchParty,
  DispatchTask,
  GameState,
  GearItem,
  OccupationId,
  Resources,
  SkillId,
  Stance,
  Survivor,
  TraitId,
  WeaponId,
} from "./types";
import { AP_COST, apOf } from "./v03";
import { addIntelOne } from "./longrun";

export const DISPATCH_TASKS: DispatchTask[] = ["herbs", "supplies", "forage", "auto"];
export const DISPATCH_MAX = 2;

const FOCUS_SKILL: Record<DispatchFocus, SkillId> = {
  herbs: "medical",
  supplies: "scavenge",
  forage: "farm",
};

function bag(): Resources {
  return EMPTY_BAG();
}

function addBag(a: Resources, b: Partial<Resources>): Resources {
  return {
    food: a.food + (b.food ?? 0),
    water: a.water + (b.water ?? 0),
    materials: a.materials + (b.materials ?? 0),
    medicine: a.medicine + (b.medicine ?? 0),
    ammo: a.ammo + (b.ammo ?? 0),
    fuel: a.fuel + (b.fuel ?? 0),
  };
}

function living(state: GameState): Survivor[] {
  return state.survivors.filter((s) => s.alive);
}

function mapSur(state: GameState, id: string, fn: (s: Survivor) => Survivor): GameState {
  return { ...state, survivors: state.survivors.map((s) => (s.id === id ? fn(s) : s)) };
}

function pushLog(state: GameState, text: string): GameState {
  const log = [{ day: state.day, text }, ...state.log].slice(0, 40);
  return { ...state, log };
}

function has(s: Survivor, id: TraitId) {
  return s.traits.includes(id);
}

export function awayIds(state: GameState): Set<string> {
  const ids = new Set<string>();
  for (const p of state.dispatches ?? []) {
    for (const id of p.memberIds) ids.add(id);
  }
  for (const b of state.bands ?? []) {
    if (b.envoyId) ids.add(b.envoyId);
  }
  return ids;
}

export function isAway(state: GameState, id: string): boolean {
  return awayIds(state).has(id);
}

export function focusOf(s: Survivor, task: DispatchTask): DispatchFocus {
  const herbs =
    s.skills.medical * 1.2 +
    s.skills.farm * 0.7 +
    (has(s, "firstaid") ? 2 : 0) +
    (has(s, "gardener") ? 1.5 : 0);
  const supplies =
    s.skills.scavenge * 1.2 +
    s.skills.build * 0.6 +
    (has(s, "organized") ? 2 : 0) +
    (has(s, "burglarhands") ? 1.5 : 0);
  const forage =
    s.skills.farm * 1.1 +
    s.skills.cook * 0.5 +
    (has(s, "outdoorsman") ? 2 : 0) +
    (has(s, "hunter") ? 2 : 0) +
    (has(s, "gardener") ? 1 : 0);
  if (task === "herbs" || task === "supplies" || task === "forage") return task;
  if (herbs >= supplies && herbs >= forage) return "herbs";
  if (forage >= supplies) return "forage";
  return "supplies";
}

export function focusScore(s: Survivor, focus: DispatchFocus): number {
  if (focus === "herbs") {
    return (
      s.skills.medical * 1.2 +
      s.skills.farm * 0.7 +
      (has(s, "firstaid") ? 2 : 0) +
      (has(s, "gardener") ? 1.5 : 0)
    );
  }
  if (focus === "supplies") {
    return (
      s.skills.scavenge * 1.2 +
      s.skills.build * 0.6 +
      (has(s, "organized") ? 2 : 0) +
      (has(s, "burglarhands") ? 1.5 : 0)
    );
  }
  return (
    s.skills.farm * 1.1 +
    s.skills.cook * 0.5 +
    (has(s, "outdoorsman") ? 2 : 0) +
    (has(s, "hunter") ? 2 : 0) +
    (has(s, "gardener") ? 1 : 0)
  );
}

export function dispatchBlock(state: GameState, s: Survivor): "ok" | "away" | "out" | "mood" | "hurt" | "tired" {
  if (!s.alive || isAway(state, s.id)) return "away";
  if (state.mission?.squadIds.includes(s.id)) return "out";
  if (!canWork(s)) return "mood";
  if (s.hp <= 14) return "hurt";
  if (s.fatigue >= 90) return "tired";
  return "ok";
}

export function canDispatchPerson(state: GameState, s: Survivor): boolean {
  return dispatchBlock(state, s) === "ok";
}

export function canStartDispatch(
  state: GameState,
  ids: string[],
): { ok: boolean; reason: string } {
  if ((state.dispatches ?? []).length > 0) return { ok: false, reason: t("dispatch.busy") };
  if (apOf(state) < AP_COST.dispatch) return { ok: false, reason: t("dispatch.needAp") };
  const people = living(state);
  if (people.length < 2) return { ok: false, reason: t("dispatch.needPeople") };
  const uniq = [...new Set(ids)];
  if (!uniq.length) return { ok: false, reason: t("dispatch.none") };
  if (uniq.length > DISPATCH_MAX) return { ok: false, reason: t("dispatch.max") };
  if (uniq.length >= people.length) return { ok: false, reason: t("dispatch.needStay") };
  for (const id of uniq) {
    const s = state.survivors.find((x) => x.id === id);
    if (!s || !canDispatchPerson(state, s)) return { ok: false, reason: t("dispatch.none") };
  }
  return { ok: true, reason: "" };
}

function pickDest(state: GameState): string {
  const home = locById(state.shelter.locationId);
  const near = home.neighbors.filter((id) => {
    const ls = state.locations[id];
    return ls && (ls.discovered || ls.visited || ls.occupied);
  });
  if (!near.length) return home.id;
  return [...near].sort((a, b) => (state.locations[a].zombies ?? 0) - (state.locations[b].zombies ?? 0))[0];
}

export function startDispatch(state: GameState, ids: string[], task: DispatchTask): GameState {
  const check = canStartDispatch(state, ids);
  if (!check.ok) return pushLog(state, check.reason);
  const uniq = [...new Set(ids)];
  const members = uniq.map((id) => state.survivors.find((s) => s.id === id)!);
  const n = members.length;
  const takeF = Math.min(state.resources.food, n);
  const takeW = Math.min(state.resources.water, n);
  const hungry = takeF < n || takeW < n;
  const made = uid(state.rng);
  const destId = pickDest(state);
  const destName = destId === state.shelter.locationId ? t("dispatch.woods") : tLoc(destId);
  const names = members.map((s) => s.name).join(t("ui.comma"));
  const party: DispatchParty = {
    id: made.id,
    memberIds: uniq,
    task,
    sentDay: state.day,
    returnDay: state.day,
    destId,
    hungry,
  };
  let next: GameState = {
    ...state,
    rng: made.r,
    dayAP: apOf(state) - AP_COST.dispatch,
    resources: {
      ...state.resources,
      food: state.resources.food - takeF,
      water: state.resources.water - takeW,
    },
    dispatches: [...(state.dispatches ?? []), party],
    squadPick: state.squadPick.filter((id) => !uniq.includes(id)),
  };
  next = pushLog(
    next,
    t("dispatch.log.send", {
      names,
      loc: destName,
      task: t(`dispatch.task.${task}`),
      food: takeF,
      water: takeW,
    }),
  );
  if (hungry) next = pushLog(next, t("dispatch.log.hungry", { names }));
  for (const s of members) {
    if (has(s, "agoraphobic")) {
      next = mapSur(next, s.id, (x) => ({ ...x, morale: clamp(x.morale - 5, 0, 100) }));
    }
  }
  return next;
}

type EventId =
  | "success"
  | "lucky"
  | "cache"
  | "note"
  | "person"
  | "empty"
  | "scratch"
  | "ambush"
  | "delay"
  | "torn"
  | "greenhouse"
  | "cellar"
  | "deer"
  | "clinic"
  | "truck"
  | "warning";

function pickWeighted(r: number, items: { id: EventId; w: number }[]): { r: number; id: EventId } {
  const live = items.filter((x) => x.w > 0);
  const total = live.reduce((n, x) => n + x.w, 0);
  const roll = range(r, 1, Math.max(1, Math.round(total * 100)));
  let acc = 0;
  const target = roll.n / 100;
  for (const it of live) {
    acc += it.w;
    if (target <= acc) return { r: roll.r, id: it.id };
  }
  return { r: roll.r, id: live[live.length - 1]?.id ?? "success" };
}

function eventTable(party: DispatchParty, folks: Survivor[], destZ: number): { id: EventId; w: number }[] {
  const stealth = Math.max(0, ...folks.map((s) => s.skills.stealth));
  const combat = Math.max(0, ...folks.map((s) => s.skills.combat));
  const lucky = folks.some((s) => has(s, "lucky"));
  const unlucky = folks.some((s) => has(s, "unlucky"));
  const quiet = folks.some((s) => has(s, "quiet") || has(s, "inconspicuous"));
  const loud = folks.some((s) => has(s, "conspicuous"));
  const outdoor = folks.some((s) => has(s, "outdoorsman") || has(s, "hunter") || has(s, "gardener"));
  const threat = Math.min(0.4, destZ * 0.035);
  const hungry = party.hungry ? 1 : 0;
  const delayed = party.delayed ? 1 : 0;
  return [
    { id: "success", w: 34 + stealth + (quiet ? 4 : 0) + (outdoor ? 3 : 0) },
    { id: "lucky", w: 8 + (lucky ? 8 : 0) - (unlucky ? 4 : 0) },
    { id: "cache", w: 6 + (lucky ? 3 : 0) },
    { id: "note", w: 6 },
    { id: "person", w: 5 },
    { id: "empty", w: 5 + hungry * 4 + (unlucky ? 3 : 0) - (outdoor ? 3 : 0) },
    { id: "scratch", w: 7 + hungry * 3 + threat * 20 + (unlucky ? 3 : 0) - stealth * 0.6 },
    { id: "ambush", w: 8 + threat * 28 + (loud ? 6 : 0) - stealth * 0.8 - (quiet ? 4 : 0) - combat * 0.3 },
    { id: "delay", w: delayed ? 0 : 4 + hungry * 2 },
    { id: "torn", w: 5 + hungry * 2 },
    { id: "greenhouse", w: party.task === "herbs" || party.task === "forage" || party.task === "auto" ? 4 : 1 },
    { id: "cellar", w: 4 },
    { id: "deer", w: outdoor ? 5 : 2 },
    { id: "clinic", w: party.task === "herbs" || folks.some((s) => s.skills.medical >= 4) ? 5 : 2 },
    { id: "truck", w: party.task === "supplies" ? 5 : 2 },
    { id: "warning", w: 4 },
  ];
}

function lootFor(focus: DispatchFocus, score: number, r0: number, mul = 1): { r: number; bag: Resources } {
  const n0 = range(r0, 0, 1);
  const n = Math.max(1, Math.round((1 + Math.floor(score / 3) + n0.n) * mul));
  const bag = EMPTY_BAG();
  if (focus === "herbs") {
    bag.medicine = n;
    if (score >= 5) bag.food = Math.max(0, Math.floor(n / 2));
  } else if (focus === "supplies") {
    bag.materials = n;
    if (score >= 6) bag.ammo = 1;
    if (score >= 8) bag.fuel = 1;
  } else {
    bag.food = n;
    bag.water = Math.max(1, n - 1);
  }
  return { r: n0.r, bag };
}

function tinyLoot(focus: DispatchFocus): Partial<Resources> {
  if (focus === "herbs") return { medicine: 1 };
  if (focus === "supplies") return { materials: 1 };
  return { food: 1 };
}

function gearFor(focus: DispatchFocus, r: number): { r: number; item: GearItem | null } {
  const tags =
    focus === "herbs" ? ["home", "farm"] : focus === "supplies" ? ["tool", "work"] : ["farm", "home"];
  const pool = GEAR.filter((g) => (g.rarity === "common" || g.rarity === "uncommon") && g.tags.some((tag) => tags.includes(tag)));
  const list = pool.length ? pool : GEAR.filter((g) => g.rarity === "common");
  const p = pick(r, list);
  const made = mintGear(p.r, p.item.id, 62);
  return { r: made.r, item: made.item };
}

function hiddenLocs(state: GameState) {
  return LOCATIONS.filter((l) => !state.locations[l.id]?.discovered && l.id !== state.shelter.locationId);
}

function discoverOne(state: GameState): { state: GameState; name: string } {
  return { state, name: "" };
}

function makeFound(state: GameState, r0: number): { r: number; s: Survivor; extra: GearItem[] } {
  const occ = pick(r0, OCCUPATIONS);
  const nm = pick(occ.r, FIRST_NAMES);
  const ln = pick(nm.r, LAST_NAMES);
  const pos = pick(ln.r, TRAITS.filter((x) => x.kind === "pos"));
  const neg = pick(pos.r, TRAITS.filter((x) => x.kind === "neg"));
  const used = [
    ...state.survivors.filter((s) => s.alive && !s.faceData).map((s) => s.portrait),
    ...(state.bands ?? []).map((b) => b.face).filter((id): id is string => !!id),
  ];
  const free = FACES.filter((f) => !used.includes(f.id));
  const face = pick(neg.r, free.length ? free : FACES);
  const traits = withOccupationTraits(occ.item.id, [pos.item.id, neg.item.id]);
  const skills = composeSkills(occById(occ.item.id as OccupationId).skills, traits.map(traitById));
  const hp = clamp(occById(occ.item.id as OccupationId).hp, 50, 140);
  const u = uid(face.r);
  const raw: Survivor = {
    id: u.id,
    name: `${nm.item} ${ln.item}`,
    occupation: occ.item.id,
    traits,
    portrait: face.item.id,
    skills,
    skillXp: emptySkills(),
    skillBase: { ...skills },
    lastSkillUp: null,
    hp,
    maxHp: hp,
    hunger: 70,
    thirst: 70,
    morale: startingMorale(traits.map(traitById)),
    fatigue: 35,
    infected: false,
    weapon: occById(occ.item.id).weapon,
    worn: {},
    stance: "neutral" as Stance,
    job: "rest",
    alive: true,
    death: "",
    daysIn: 0,
    kills: 0,
  };
  const dressed = dressSurvivor(u.r, occ.item.id, raw);
  return { r: dressed.r, s: dressed.s, extra: dressed.extra };
}

function salvageDead(state: GameState, s: Survivor): GameState {
  const items = salvageWorn(s);
  if (!items.length) {
    return {
      ...state,
      survivors: state.survivors.map((x) => (x.id === s.id ? { ...x, worn: {}, weapon: "fists" as WeaponId } : x)),
    };
  }
  return {
    ...state,
    stash: [...(state.stash ?? []), ...items],
    survivors: state.survivors.map((x) =>
      x.id === s.id ? { ...x, worn: {}, weapon: "fists" as WeaponId } : x,
    ),
  };
}

function injure(
  state: GameState,
  id: string,
  dmg: number,
  infectP: number,
  cause: string,
): GameState {
  const s = state.survivors.find((x) => x.id === id);
  if (!s || !s.alive) return state;
  const inf = chance(state.rng, infectP);
  const hp = s.hp - Math.max(1, dmg);
  const dead = hp <= 0;
  let next = mapSur(
    { ...state, rng: inf.r },
    id,
    (x) => ({
      ...x,
      hp: Math.max(0, hp),
      infected: x.infected || (!dead && inf.ok),
      alive: !dead,
      death: dead ? cause : x.death,
      morale: clamp(x.morale - (dead ? 0 : inf.ok ? 10 : 6), 0, 100),
    }),
  );
  if (dead) {
    next = salvageDead(next, s);
    next = pushLog(next, t("dispatch.log.dead", { name: s.name }));
    next = {
      ...next,
      survivors: next.survivors.map((x) =>
        x.alive && x.id !== s.id ? { ...x, morale: clamp(x.morale - 14, 0, 100) } : x,
      ),
    };
  } else if (inf.ok) {
    next = pushLog(next, t("dispatch.log.bitten", { name: s.name }));
  } else {
    next = pushLog(next, t("dispatch.log.hurt", { name: s.name, n: dmg }));
  }
  return next;
}

function grantFocusXp(state: GameState, folks: Survivor[], amount: number): GameState {
  let next = state;
  for (const s of folks) {
    if (!s.alive) continue;
    const cur = next.survivors.find((x) => x.id === s.id);
    if (!cur || !cur.alive) continue;
    const focus = focusOf(cur, "auto");
    const skill = FOCUS_SKILL[focus];
    const prev = cur;
    const xp = applySkillXp(cur, skill, amount);
    next = { ...next, survivors: next.survivors.map((x) => (x.id === cur.id ? xp.survivor : x)) };
    next = noteSkillUps(next, prev, xp.survivor);
  }
  return next;
}

function wearTrip(state: GameState, folks: Survivor[], extraFat: number, extraMorale: number): GameState {
  let next = state;
  for (const s of folks) {
    next = mapSur(next, s.id, (x) => {
      if (!x.alive) return x;
      return {
        ...x,
        fatigue: clamp(x.fatigue + 14 + extraFat, 0, 100),
        morale: clamp(x.morale + extraMorale, 0, 100),
        hunger: clamp(x.hunger - 8, 0, 100),
        thirst: clamp(x.thirst - 8, 0, 100),
        daysIn: x.daysIn + 1,
      };
    });
  }
  return next;
}

function resolveOne(state: GameState, party: DispatchParty): GameState {
  const folks = party.memberIds
    .map((id) => state.survivors.find((s) => s.id === id))
    .filter((s): s is Survivor => !!s && s.alive);
  if (!folks.length) return { ...state, dispatches: (state.dispatches ?? []).filter((p) => p.id !== party.id) };

  if (party.returnDay >= state.day) {
    return pushLog(state, t("dispatch.log.wait", { names: folks.map((s) => s.name).join(t("ui.comma")) }));
  }

  const destZ = state.locations[party.destId]?.zombies ?? 0;
  const destName = party.destId === state.shelter.locationId ? t("dispatch.woods") : tLoc(party.destId);
  const names = folks.map((s) => s.name).join(t("ui.comma"));
  const rolled = pickWeighted(state.rng, eventTable(party, folks, destZ));
  let next: GameState = { ...state, rng: rolled.r };
  const ev = rolled.id;

  if (ev === "delay") {
    next = {
      ...next,
      dispatches: (next.dispatches ?? []).map((p) =>
        p.id === party.id ? { ...p, returnDay: next.day, delayed: true } : p,
      ),
    };
    next = wearTrip(next, folks, 8, -4);
    return pushLog(next, t("dispatch.log.delay", { names, loc: destName }));
  }

  const fromId = next.locations[party.destId] ? party.destId : next.shelter.locationId;
  if (ev === "note") {
    next = addIntelOne(next, fromId, 100);
  } else {
    const bite = range(next.rng, 8, 36);
    next = { ...next, rng: bite.r };
    next = addIntelOne(next, fromId, bite.n);
  }

  let loot = bag();
  for (const s of folks) {
    const focus = focusOf(s, party.task);
    const score = focusScore(s, focus) + (has(s, "lucky") ? 1.5 : 0) - (has(s, "unlucky") ? 1 : 0);
    const rolledLoot = lootFor(focus, score, next.rng, ev === "lucky" ? 1.5 : ev === "empty" ? 0 : 1);
    next = { ...next, rng: rolledLoot.r };
    if (focus === "herbs") {
      const known = knowsOnSight(s);
      const n = herbCount(s);
      for (let i = 0; i < n; i++) {
        const herb = rollHerb(next.day, next.rng);
        next = { ...next, rng: herb.r };
        next = addHerb(next, herb.id, known, 1);
      }
    }
    loot = addBag(loot, rolledLoot.bag);
    if (party.task !== "auto") {
      const own = focusOf(s, "auto");
      if (own !== focus) {
        const side = chance(next.rng, 0.42);
        next = { ...next, rng: side.r };
        if (side.ok) loot = addBag(loot, tinyLoot(own));
      }
    }
  }

  const dropParty = () => {
    next = nameByDoctor({
      ...next,
      dispatches: (next.dispatches ?? []).filter((p) => p.id !== party.id),
    });
    return next;
  };

  const takeLoot = (mul = 1) => {
    const got: Resources = {
      food: Math.round(loot.food * mul),
      water: Math.round(loot.water * mul),
      materials: Math.round(loot.materials * mul),
      medicine: Math.round(loot.medicine * mul),
      ammo: Math.round(loot.ammo * mul),
      fuel: Math.round(loot.fuel * mul),
    };
    next = { ...next, resources: addBag(next.resources, got) };
    return got;
  };

  const maybeGear = (focus: DispatchFocus, p = 0.35) => {
    const hit = chance(next.rng, p);
    next = { ...next, rng: hit.r };
    if (!hit.ok) return;
    const g = gearFor(focus, next.rng);
    next = { ...next, rng: g.r };
    if (g.item) {
      next = { ...next, stash: [...(next.stash ?? []), g.item] };
      next = pushLog(next, t("dispatch.log.gear", { name: folks[0].name, item: labelItem(g.item) }));
    }
  };

  if (ev === "empty") {
    next = dropParty();
    next = wearTrip(next, folks, 6, -4);
    next = grantFocusXp(next, folks, 3);
    return pushLog(next, t("dispatch.log.empty", { names, loc: destName }));
  }

  if (ev === "scratch") {
    const victim = pick(next.rng, folks);
    next = { ...next, rng: victim.r };
    const dmg = range(next.rng, 8, 16);
    next = { ...next, rng: dmg.r };
    const got = takeLoot(0.7);
    next = dropParty();
    next = injure(next, victim.item.id, dmg.n, 0.12, t("dispatch.death"));
    next = wearTrip(next, folks, 10, -6);
    next = grantFocusXp(next, folks, 6);
    const bits = tResBits(got);
    return pushLog(next, t("dispatch.log.scratch", { names, loc: destName, loot: bits || t("dispatch.nothing") }));
  }

  if (ev === "ambush") {
    const combat = Math.max(...folks.map((s) => s.skills.combat));
    const wep = Math.max(...folks.map((s) => liveWeapon(s).melee));
    const fight = combat * 8 + wep * 2;
    const roll = range(next.rng, 0, 24);
    next = { ...next, rng: roll.r };
    const coward = folks.find((s) => has(s, "coward"));
    if (coward) {
      const dmg = range(next.rng, 4, 10);
      next = { ...next, rng: dmg.r };
      next = injure(next, coward.id, dmg.n, 0.05, t("dispatch.death"));
      next = dropParty();
      next = wearTrip(next, folks, 12, -8);
      next = grantFocusXp(next, folks, 4);
      next = {
        ...next,
        survivors: next.survivors.map((s) =>
          folks.some((f) => f.id === s.id) ? addSkillXp(s, "stealth", 6) : s,
        ),
      };
      return pushLog(next, t("dispatch.log.ambushFlee", { names, loc: destName }));
    }
    const win = fight + roll.n >= 36;
    const victim = pick(next.rng, folks);
    next = { ...next, rng: victim.r };
    if (win) {
      const dmg = range(next.rng, 5, 12);
      next = { ...next, rng: dmg.r };
      const got = takeLoot(1);
      next = dropParty();
      next = injure(next, victim.item.id, dmg.n, 0.08, t("dispatch.death"));
      next = wearTrip(next, folks, 12, -2);
      next = grantFocusXp(next, folks, 8);
      next = {
        ...next,
        survivors: next.survivors.map((s) =>
          folks.some((f) => f.id === s.id) ? addSkillXp(s, "combat", 8) : s,
        ),
      };
      return pushLog(
        next,
        t("dispatch.log.ambushWin", { names, loc: destName, loot: tResBits(got) || t("dispatch.nothing") }),
      );
    }
    const dmg = range(next.rng, 14, 26);
    next = { ...next, rng: dmg.r };
    const got = takeLoot(0.35);
    next = dropParty();
    next = injure(next, victim.item.id, dmg.n, 0.18, t("dispatch.death"));
    next = wearTrip(next, folks, 16, -10);
    next = grantFocusXp(next, folks, 5);
    return pushLog(
      next,
      t("dispatch.log.ambush", { names, loc: destName, loot: tResBits(got) || t("dispatch.nothing") }),
    );
  }

  if (ev === "torn") {
    const got = takeLoot(0.45);
    next = dropParty();
    next = wearTrip(next, folks, 8, -3);
    next = grantFocusXp(next, folks, 6);
    return pushLog(next, t("dispatch.log.torn", { names, loc: destName, loot: tResBits(got) || t("dispatch.nothing") }));
  }

  if (ev === "note" || ev === "warning") {
    const found = discoverOne(next);
    next = found.state;
    const got = takeLoot(ev === "warning" ? 0.5 : 0.8);
    next = dropParty();
    next = wearTrip(next, folks, 6, ev === "warning" ? -2 : 4);
    next = grantFocusXp(next, folks, 7);
    const key = ev === "note" ? "dispatch.log.note" : "dispatch.log.warning";
    return pushLog(
      next,
      t(key, {
        names,
        loc: destName,
        found: found.name || t("dispatch.noMap"),
        loot: tResBits(got) || t("dispatch.nothing"),
      }),
    );
  }

  if (ev === "person") {
    const got = takeLoot(0.8);
    const room = living(next).length < next.shelter.capacity;
    next = dropParty();
    next = wearTrip(next, folks, 8, room ? 6 : 2);
    next = grantFocusXp(next, folks, 8);
    if (!room) {
      return pushLog(
        next,
        t("dispatch.log.personFull", { names, loc: destName, loot: tResBits(got) || t("dispatch.nothing") }),
      );
    }
    const found = makeFound(next, next.rng);
    next = {
      ...next,
      rng: found.r,
      stash: [...(next.stash ?? []), ...found.extra],
      survivors: [...next.survivors, found.s],
    };
    const a = folks[0];
    if (a) {
      next = {
        ...next,
        bonds: { ...(next.bonds ?? {}), [pairKey(a.id, found.s.id)]: 12 },
      };
    }
    return pushLog(
      next,
      t("dispatch.log.person", {
        names,
        loc: destName,
        who: found.s.name,
        loot: tResBits(got) || t("dispatch.nothing"),
      }),
    );
  }

  if (ev === "greenhouse") {
    loot = addBag(loot, { food: 2, medicine: 1 });
    const known = folks.some((s) => knowsOnSight(s));
    next = addHerb(next, "plantain", known, 2);
    next = addHerb(next, "mint", known, 1);
    const got = takeLoot(1);
    next = dropParty();
    next = wearTrip(next, folks, 4, 6);
    next = grantFocusXp(next, folks, 10);
    return pushLog(next, t("dispatch.log.greenhouse", { names, loot: tResBits(got) }));
  }
  if (ev === "cellar") {
    loot = addBag(loot, { materials: 2, food: 1, ammo: 1 });
    const got = takeLoot(1);
    maybeGear("supplies", 0.45);
    next = dropParty();
    next = wearTrip(next, folks, 6, 5);
    next = grantFocusXp(next, folks, 10);
    return pushLog(next, t("dispatch.log.cellar", { names, loc: destName, loot: tResBits(got) }));
  }
  if (ev === "deer") {
    loot = addBag(loot, { food: 3 });
    const got = takeLoot(1);
    next = dropParty();
    next = wearTrip(next, folks, 8, 5);
    next = grantFocusXp(next, folks, 9);
    next = {
      ...next,
      survivors: next.survivors.map((s) =>
        folks.some((f) => f.id === s.id) ? addSkillXp(s, "farm", 4) : s,
      ),
    };
    return pushLog(next, t("dispatch.log.deer", { names, loot: tResBits(got) }));
  }
  if (ev === "clinic") {
    loot = addBag(loot, { medicine: 2 });
    const got = takeLoot(1);
    maybeGear("herbs", 0.5);
    next = dropParty();
    next = wearTrip(next, folks, 5, 4);
    next = grantFocusXp(next, folks, 10);
    return pushLog(next, t("dispatch.log.clinic", { names, loc: destName, loot: tResBits(got) }));
  }
  if (ev === "truck") {
    loot = addBag(loot, { fuel: 2, materials: 1 });
    const got = takeLoot(1);
    next = dropParty();
    next = wearTrip(next, folks, 7, 3);
    next = grantFocusXp(next, folks, 9);
    return pushLog(next, t("dispatch.log.truck", { names, loc: destName, loot: tResBits(got) }));
  }
  if (ev === "cache") {
    loot = addBag(loot, { materials: 2, ammo: 1 });
    const got = takeLoot(1);
    maybeGear(focusOf(folks[0], party.task), 0.4);
    next = dropParty();
    next = wearTrip(next, folks, 5, 7);
    next = grantFocusXp(next, folks, 11);
    return pushLog(next, t("dispatch.log.cache", { names, loc: destName, loot: tResBits(got) }));
  }
  if (ev === "lucky") {
    const got = takeLoot(1);
    maybeGear(focusOf(folks[0], party.task), 0.55);
    next = dropParty();
    next = wearTrip(next, folks, 4, 8);
    next = grantFocusXp(next, folks, 12);
    if (folks.length >= 2) {
      const key = pairKey(folks[0].id, folks[1].id);
      next = { ...next, bonds: { ...(next.bonds ?? {}), [key]: (next.bonds?.[key] ?? 0) + 6 } };
    }
    return pushLog(next, t("dispatch.log.lucky", { names, loc: destName, loot: tResBits(got) }));
  }

  const got = takeLoot(1);
  maybeGear(focusOf(folks[0], party.task), 0.22);
  next = dropParty();
  next = wearTrip(next, folks, 6, 4);
  next = grantFocusXp(next, folks, 10);
  if (folks.length >= 2) {
    const key = pairKey(folks[0].id, folks[1].id);
    next = { ...next, bonds: { ...(next.bonds ?? {}), [key]: (next.bonds?.[key] ?? 0) + 4 } };
  }
  return pushLog(next, t("dispatch.log.success", { names, loc: destName, loot: tResBits(got) || t("dispatch.nothing") }));
}

export function resolveDispatches(state: GameState): GameState {
  const list = state.dispatches ?? [];
  if (!list.length) return state;
  let next = state;
  for (const party of list) {
    if (!(next.dispatches ?? []).some((p) => p.id === party.id)) continue;
    next = resolveOne(next, party);
  }
  return next;
}

export function padDispatches(state: GameState): GameState {
  if (Array.isArray(state.dispatches)) return state;
  return { ...state, dispatches: [] };
}
