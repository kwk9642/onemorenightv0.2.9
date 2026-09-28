import { FACES, locById, LOCATIONS } from "./data";
import { t } from "./i18n";
import { chance } from "./rng";
import type { FacilityId, GameState, LocationState, PlayMode, Survivor } from "./types";
import { modeOf } from "./mode";

export type PhaseId = "settle" | "thin" | "season";
export type BandId = string;
export type BandStance = "neutral" | "friendly" | "hostile";
export type Want = "parts" | "medicine" | "fuel" | "food" | "ammo";

export interface Band {
  id: BandId;
  met: boolean;
  stance: BandStance;
  exposure: number;
  homeKnown: boolean;
  captiveId: string | null;
  home: string;
  region: string;
  want: Want;
  envoyId?: string | null;
  guard?: number;
  with?: Record<string, BandStance>;
  face?: string;
}

export const NEAR_MILES = 190;

export const BAND_POOL: { id: string; region: string; home: string; want: Want }[] = [
  { id: "garage", region: "ky", home: "westpoint_shop", want: "parts" },
  { id: "clinic", region: "ky", home: "louisville_er", want: "medicine" },
  { id: "drums", region: "ky", home: "westpoint_town", want: "fuel" },
  { id: "cave", region: "ky", home: "mammoth_cave", want: "food" },
  { id: "steel", region: "in", home: "gary", want: "parts" },
  { id: "circle", region: "oh", home: "cincinnati", want: "medicine" },
  { id: "capitol", region: "oh", home: "columbus", want: "ammo" },
  { id: "lake", region: "oh", home: "cleveland_oh", want: "fuel" },
  { id: "forge", region: "pa", home: "pittsburgh_pa", want: "parts" },
  { id: "motor", region: "mi", home: "detroit_mi", want: "fuel" },
  { id: "brew", region: "wi", home: "milwaukee_wi", want: "food" },
  { id: "wind", region: "il", home: "chicago", want: "ammo" },
  { id: "corn", region: "ia", home: "des_moines_ia", want: "food" },
  { id: "arch", region: "mo", home: "stlouis", want: "parts" },
  { id: "music", region: "tn", home: "nashville", want: "medicine" },
  { id: "delta", region: "tn", home: "memphis", want: "food" },
  { id: "rock", region: "ar", home: "little_rock_ar", want: "medicine" },
  { id: "rocket", region: "al", home: "huntsville_al", want: "ammo" },
  { id: "iron", region: "al", home: "birmingham_al", want: "parts" },
  { id: "river", region: "ms", home: "jackson_ms", want: "food" },
];

export function milesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = (n: number) => (n * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const WANTS: Want[] = ["parts", "medicine", "fuel", "food", "ammo"];

function mix(n: number): number {
  return (Math.imul(n >>> 0 || 1, 1664525) + 1013904223) >>> 0;
}

export function rollBands(seed: number, anchorId = "muldraugh_farm", usedFaces: string[] = []): Band[] {
  let r = seed >>> 0 || 1;
  const next = () => {
    r = mix(r);
    return r;
  };
  const anchor = locById(anchorId);
  const near = new Set<string>([anchor.region]);
  for (const id of anchor.neighbors) near.add(locById(id).region);
  const open = LOCATIONS.filter((l) => l.id !== anchor.id);
  const takeFrom = (region: string, n: number, used: Set<string>) => {
    const bag = open.filter((l) => l.region === region && !used.has(l.id));
    const out: typeof bag = [];
    while (out.length < n && bag.length) {
      out.push(bag.splice(next() % bag.length, 1)[0]);
    }
    return out;
  };
  const used = new Set<string>();
  const picked = [...takeFrom(anchor.region, 2, used)];
  for (const loc of picked) used.add(loc.id);
  for (const region of near) {
    if (region === anchor.region) continue;
    for (const loc of takeFrom(region, 1, used)) {
      picked.push(loc);
      used.add(loc.id);
    }
  }
  const rest = open.filter((l) => !used.has(l.id));
  const seenState = new Set(picked.map((l) => l.region));
  while (picked.length < 24 && rest.length) {
    const far = rest.findIndex((l) => !seenState.has(l.region));
    const i = far >= 0 ? far : next() % rest.length;
    const loc = rest.splice(i, 1)[0];
    seenState.add(loc.region);
    picked.push(loc);
  }
  const taken = new Set(usedFaces);
  return picked.slice(0, 24).map((loc, i) => {
    const free = FACES.filter((f) => !taken.has(f.id));
    const bag = free.length ? free : FACES;
    const face = bag[next() % bag.length];
    taken.add(face.id);
    return {
      id: loc.id,
      met: false,
      stance: "neutral" as const,
      exposure: 0,
      homeKnown: false,
      captiveId: null,
      home: loc.id,
      region: loc.region,
      want: WANTS[i % WANTS.length],
      envoyId: null,
      guard: 0,
      with: {},
      face: face.id,
    };
  });
}

export function bandLabel(id: string): string {
  const key = `long.band.${id}`;
  const named = t(key);
  if (named !== key) return named;
  const locKey = `loc.${id}`;
  const loc = t(locKey);
  if (loc !== locKey) return t("long.bandAt", { loc });
  return named;
}

const TEND: Partial<Record<FacilityId, string>> = {
  kitchen: "cook",
  garden: "farm",
  infirmary: "tend",
  workshop: "craft",
  watch: "guard",
  still: "press",
  water: "tend",
  radio: "radio",
};

export function phaseCuts(mode: PlayMode): { thin: number; season: number } {
  if (mode === "casual") return { thin: 21, season: 41 };
  if (mode === "extinct") return { thin: 9, season: 19 };
  return { thin: 15, season: 31 };
}

export function phaseOf(day: number, mode: PlayMode): PhaseId {
  const c = phaseCuts(mode);
  if (day < c.thin) return "settle";
  if (day < c.season) return "thin";
  return "season";
}

export function searchPctOf(ls: LocationState): number {
  if (typeof ls.searchPct === "number") return ls.searchPct;
  return ls.discovered ? 100 : 0;
}

export function freshBands(seed = 1): Band[] {
  return rollBands(seed);
}

export function bandsOf(state: GameState): Band[] {
  return state.bands?.length ? state.bands : rollBands(state.seed || 1);
}

function putBands(state: GameState, bands: Band[]): GameState {
  return { ...state, bands };
}

const FAR_HOP = new Set([
  "seattle_wa|juneau_ak",
  "juneau_ak|anchorage_ak",
  "anchorage_ak|fairbanks_ak",
  "los_angeles_ca|honolulu_hi",
  "honolulu_hi|hilo_hi",
]);

export function nearLeads(state: GameState, fromId: string): string[] {
  const from = locById(fromId);
  const home = locById(state.shelter.locationId);
  return from.neighbors.filter((id) => {
    const ls = state.locations[id];
    if (!ls || ls.discovered) return false;
    const other = locById(id);
    const hop = milesBetween(from, other);
    const fromHome = milesBetween(home, other);
    const far = FAR_HOP.has(`${fromId}|${id}`) || FAR_HOP.has(`${id}|${fromId}`);
    if (far) return milesBetween(home, from) <= NEAR_MILES;
    return hop <= NEAR_MILES && fromHome <= NEAR_MILES;
  });
}

function bumpRng(n: number): number {
  return (Math.imul(n >>> 0 || 1, 1664525) + 1013904223) >>> 0;
}

export function addIntelTo(state: GameState, fromId: string, id: string, amount: number): GameState {
  if (!nearLeads(state, fromId).includes(id) || amount <= 0) return state;
  const ls = state.locations[id];
  const had = ls.intel ?? 0;
  const pct = Math.min(100, had + amount);
  const miles = Math.round(milesBetween(locById(fromId), locById(id)));
  let next: GameState = {
    ...state,
    locations: {
      ...state.locations,
      [id]: { ...ls, intel: pct, miles, heard: true, discovered: pct >= 100, searchPct: pct >= 100 ? 0 : ls.searchPct },
    },
  };
  if (had < 100 && pct >= 100) next = push(next, t("long.placedOne", { loc: t(`loc.${id}`), miles }));
  else next = push(next, t("long.intel", { loc: t(`loc.${id}`), pct, add: amount, miles }));
  return next;
}

export function addIntelOne(state: GameState, fromId: string, amount: number): GameState {
  const leads = nearLeads(state, fromId);
  if (!leads.length) return push(state, t("long.noNear", { loc: t(`loc.${fromId}`) }));
  const r = bumpRng(state.rng || 1);
  const id = leads[r % leads.length];
  return addIntelTo({ ...state, rng: r }, fromId, id, amount);
}

export function addIntelEach(state: GameState, fromId: string, amount: number): GameState {
  let next = state;
  for (const id of nearLeads(state, fromId)) next = addIntelTo(next, fromId, id, amount);
  return next;
}

export function stampMiles(state: GameState): GameState {
  const home = locById(state.shelter.locationId);
  const locations = { ...state.locations };
  for (const loc of LOCATIONS) {
    const ls = locations[loc.id];
    if (!ls) continue;
    locations[loc.id] = { ...ls, miles: Math.round(milesBetween(home, loc)) };
  }
  return { ...state, locations };
}

export function applySearch(state: GameState, locId: string, scavenge: number): GameState {
  const ls = state.locations[locId];
  if (!ls) return state;
  const poster = chance(state.rng, Math.min(0.55, 0.16 + Math.max(0, scavenge) * 0.03));
  let next: GameState = { ...state, rng: poster.r };
  if (poster.ok) {
    next = addIntelOne(next, locId, 100);
    next = push(next, t("long.poster", { loc: t(`loc.${locId}`) }));
  }
  const host = bandsOf(next).find((b) => b.met && b.stance === "friendly" && b.home === locId);
  if (host) next = push(next, t("long.safe", { band: bandLabel(host.id) }));
  if (partsHere(locId)) {
    const drop = chance(next.rng, 0.45);
    next = { ...next, rng: drop.r };
    if (drop.ok) {
      next = { ...next, parts: (next.parts ?? 0) + 1 };
      next = push(next, t("long.part", { loc: t(`loc.${locId}`) }));
    }
  }
  return maybeMeet(next, locId);
}

function partsHere(id: string): boolean {
  return /shop|wh|scrap|knox|station|town|mall/.test(id);
}

export function tickWear(state: GameState, homeJobs: string[]): GameState {
  const phase = phaseOf(state.day, modeOf(state));
  let next = state;
  const wear = { ...(state.wear ?? {}) };
  const halted = { ...(state.halted ?? {}) };
  const jobs = new Set(homeJobs);
  for (const id of Object.keys(state.shelter.facilities) as FacilityId[]) {
    const lv = state.shelter.facilities[id] ?? 0;
    if (lv <= 0 || halted[id]) continue;
    const tended = jobs.has(TEND[id] ?? "");
    let add = tended ? 8 : 16;
    if (phase === "season") add += 8;
    const n = Math.min(100, (wear[id] ?? 0) + add);
    wear[id] = n;
    if (n >= 100) {
      halted[id] = true;
      next = push(next, t("long.halt", { fac: t(`fac.${id}`) }));
    }
  }
  return { ...next, wear, halted };
}

export function machineDown(state: GameState, id: FacilityId): boolean {
  return !!(state.halted ?? {})[id];
}

export function repairMachine(state: GameState, id: FacilityId): GameState {
  const lv = state.shelter.facilities[id] ?? 0;
  if (lv <= 0) return state;
  if ((state.resources.materials ?? 0) < 1 || (state.parts ?? 0) < 1) {
    return push(state, t("long.needPart", { fac: t(`fac.${id}`) }));
  }
  const wear = { ...(state.wear ?? {}) };
  const halted = { ...(state.halted ?? {}) };
  wear[id] = 0;
  halted[id] = false;
  return push(
    {
      ...state,
      parts: (state.parts ?? 0) - 1,
      resources: { ...state.resources, materials: state.resources.materials - 1 },
      wear,
      halted,
    },
    t("long.fixed", { fac: t(`fac.${id}`) }),
  );
}

export function phaseNote(prevDay: number, day: number, mode: PlayMode): string | null {
  const a = phaseOf(prevDay, mode);
  const b = phaseOf(day, mode);
  if (a === b) return null;
  if (b === "thin") return t("long.phaseThin");
  if (b === "season") return t("long.phaseSeason");
  return null;
}

export function regrow(state: GameState): GameState {
  if (phaseOf(state.day, modeOf(state)) === "settle") return state;
  if (state.day % 6 !== 0) return state;
  let next = state;
  for (const loc of LOCATIONS) {
    const ls = next.locations[loc.id];
    if (!ls?.discovered || !ls.cleared || loc.id === next.shelter.locationId) continue;
    const bag = { ...ls.lootRemaining };
    bag.food = (bag.food ?? 0) + 1;
    next = {
      ...next,
      locations: { ...next.locations, [loc.id]: { ...ls, lootRemaining: bag } },
    };
  }
  return push(next, t("long.regrow"));
}

function maybeMeet(state: GameState, locId: string): GameState {
  if (state.meet) return state;
  if (state.metDay === state.day) return state;
  const phase = phaseOf(state.day, modeOf(state));
  const bands = bandsOf(state);
  const met = bands.filter((b) => b.met).length;
  if (phase === "settle" && met > 0) return state;
  const odds = phase === "settle" ? 0.12 : phase === "thin" ? 0.28 : 0.22;
  const roll = chance(state.rng, odds);
  let next = { ...state, rng: roll.r };
  if (!roll.ok) return next;
  const here = locById(locId).region;
  const pool = bands.filter((b) => b.region === here && (phase !== "settle" || !b.met));
  const pick = pool[Math.abs(next.rng) % Math.max(1, pool.length)];
  if (!pool.length || !pick) return next;
  const updated = bands.map((b) => (b.id === pick.id ? { ...b, met: true } : b));
  next = putBands(next, updated);
  next = { ...next, meet: { band: pick.id, locId }, metDay: next.day };
  next = push(next, t("long.meet", { band: bandLabel(pick.id), loc: t(`loc.${locId}`) }));
  return next;
}

export function meetChoices(state: GameState): { id: string; label: string; hint?: string; danger?: boolean }[] {
  const meet = state.meet;
  if (!meet) return [];
  const band = bandsOf(state).find((b) => b.id === meet.band);
  if (!band) return [];
  const what = t(band.want === "parts" ? "long.parts" : `res.${band.want}`);
  const out: { id: string; label: string; hint?: string; danger?: boolean }[] = [];
  if (band.stance === "friendly") {
    out.push(
      { id: `band_road_${band.id}`, label: t("long.act.road"), hint: t("dip.btn.road") },
      { id: `band_aid_${band.id}`, label: t("long.act.aid"), hint: t("dip.btn.aid") },
      { id: `band_guard_${band.id}`, label: t("long.act.guard"), hint: t("dip.btn.guard") },
      { id: `band_pay_${band.id}`, label: t("long.act.trade", { what }), hint: t("dip.btn.trade") },
    );
  } else if (band.stance === "hostile") {
    out.push(
      { id: `band_pay_${band.id}`, label: t("long.act.pay", { what }), hint: t("dip.btn.payHostile") },
      { id: `band_fight_${band.id}`, label: t("long.act.fight"), hint: t("dip.btn.fight"), danger: true },
    );
  } else {
    out.push(
      { id: `band_yield_${band.id}`, label: t("long.act.yield"), hint: t("dip.btn.yield") },
      { id: `band_pay_${band.id}`, label: t("long.act.pay", { what }), hint: t("dip.btn.payNeutral") },
      { id: `band_take_${band.id}`, label: t("long.act.take"), hint: t("dip.btn.take"), danger: true },
      { id: `band_fight_${band.id}`, label: t("long.act.fight"), hint: t("dip.btn.fight"), danger: true },
    );
  }
  if (band.captiveId && (band.homeKnown || state.locations[band.home]?.discovered)) {
    out.push({ id: `band_ransom_${band.id}`, label: t("long.act.ransom", { what }), hint: t("dip.btn.ransom") });
  }
  return out;
}

export function resolveBand(state: GameState, choiceId: string): GameState | null {
  const m = choiceId.match(/^band_(yield|pay|take|fight|ransom|road|aid|guard)_(.+)$/);
  if (!m) return null;
  const act = m[1] as "yield" | "pay" | "take" | "fight" | "ransom" | "road" | "aid" | "guard";
  const id = m[2];
  let bands = bandsOf(state).map((b) => ({ ...b }));
  const band = bands.find((b) => b.id === id);
  if (!band) return null;
  const def = band;
  let next: GameState = { ...state, meet: null };
  const who = next.survivors.find((s) => s.alive);
  const name = who?.name ?? "";

  if (act === "yield") {
    if (band.stance === "neutral") band.stance = "friendly";
    next = push(next, t("long.did.yield", { band: bandLabel(id), stance: t(`long.stance.${band.stance}`) }));
  } else if (act === "pay") {
    const ok = spendWant(next, def.want);
    if (!ok) {
      next = push({ ...state }, t("long.cantPay", { what: t(def.want === "parts" ? "long.parts" : `res.${def.want}`) }));
      return next;
    }
    next = ok;
    const gift = grantOther(next, def.want);
    next = gift;
    if (band.stance === "neutral") band.stance = "friendly";
    else if (band.stance === "hostile") band.stance = "neutral";
    if (!band.homeKnown && phaseOf(next.day, modeOf(next)) !== "settle") {
      const home = locById(band.home);
      const miles = milesBetween(locById(next.shelter.locationId), home);
      if (miles <= NEAR_MILES) {
        band.homeKnown = true;
        next = revealHome(next, band.home);
        next = push(next, t("long.told", { band: bandLabel(id), loc: t(`loc.${band.home}`) }));
      } else {
        next = push(next, t("long.tooFar", { loc: t(`loc.${band.home}`), miles: Math.round(miles) }));
      }
    }
    next = push(next, t("long.did.pay", { band: bandLabel(id), stance: t(`long.stance.${band.stance}`) }));
  } else if (act === "take") {
    band.stance = "hostile";
    next = {
      ...next,
      resources: { ...next.resources, food: next.resources.food + 1, materials: next.resources.materials + 1 },
    };
    next = push(next, t("long.did.take", { band: bandLabel(id), stance: t(`long.stance.hostile`) }));
  } else if (act === "fight") {
    band.stance = "hostile";
    const victim = next.survivors.find((s) => s.alive && s.stance !== "leader");
    const roll = chance(next.rng, victim ? 0.45 : 0.2);
    next = { ...next, rng: roll.r };
    if (roll.ok && victim) {
      band.captiveId = victim.id;
      band.exposure = Math.max(band.exposure, 15);
      next = {
        ...next,
        survivors: next.survivors.map((s) => (s.id === victim.id ? { ...s, alive: false, death: t("long.taken", { band: bandLabel(id) }) } : s)),
      };
      next = push(next, t("long.did.taken", { name: victim.name, band: bandLabel(id) }));
    } else {
      next = push(next, t("long.did.fight", { name, band: bandLabel(id) }));
    }
  } else if (act === "ransom") {
    const ok = spendWant(next, def.want);
    if (!ok || !band.captiveId) {
      return push(state, t("long.cantPay", { what: t(def.want === "parts" ? "long.parts" : `res.${def.want}`) }));
    }
    next = ok;
    const cid = band.captiveId;
    band.captiveId = null;
    band.exposure = Math.max(0, band.exposure - 20);
    if (band.stance === "hostile") band.stance = "neutral";
    next = {
      ...next,
      survivors: next.survivors.map((s) =>
        s.id === cid ? { ...s, alive: true, hp: Math.max(1, Math.round(s.maxHp * 0.4)), morale: Math.max(0, s.morale - 20) } : s,
      ),
    };
    const back = next.survivors.find((s) => s.id === cid);
    next = push(next, t("long.did.ransom", { name: back?.name ?? "", band: bandLabel(id), stance: t(`long.stance.${band.stance}`) }));
  } else if (act === "road") {
    if (band.stance !== "friendly") return push(state, t("long.notFriend", { band: bandLabel(id) }));
    const miles = milesBetween(locById(next.shelter.locationId), locById(band.home));
    if (miles > NEAR_MILES) {
      next = push(next, t("long.tooFar", { loc: t(`loc.${band.home}`), miles: Math.round(miles) }));
    } else {
      next = addIntelOne(next, band.home, 40);
      next = push(next, t("long.did.road", { band: bandLabel(id) }));
    }
  } else if (act === "aid") {
    if (band.stance !== "friendly") return push(state, t("long.notFriend", { band: bandLabel(id) }));
    const away = new Set((next.dispatches ?? []).flatMap((p) => p.memberIds));
    for (const b of bands) if (b.envoyId) away.add(b.envoyId);
    const envoy = next.survivors.find((s) => s.alive && s.stance !== "leader" && !away.has(s.id)) ?? next.survivors.find((s) => s.alive && !away.has(s.id));
    if (!envoy) return push(state, t("long.noHand"));
    band.envoyId = envoy.id;
    next = push(next, t("long.did.aid", { name: envoy.name, band: bandLabel(id), loc: t(`loc.${band.home}`) }));
  } else if (act === "guard") {
    if (band.stance !== "friendly") return push(state, t("long.notFriend", { band: bandLabel(id) }));
    band.guard = 3;
    next = push(next, t("long.did.guard", { band: bandLabel(id) }));
  }
  return putBands(next, bands);
}

function grantOther(state: GameState, want: Want): GameState {
  const give = WANTS.find((w) => w !== want) ?? "food";
  if (give === "parts") return { ...state, parts: (state.parts ?? 0) + 1 };
  return { ...state, resources: { ...state.resources, [give]: (state.resources[give] ?? 0) + 1 } };
}

function relocate(band: Band, bands: Band[], state: GameState): string | null {
  const here = locById(band.home);
  const taken = new Set(bands.map((b) => b.home));
  taken.add(state.shelter.locationId);
  const options = LOCATIONS.filter((l) => !taken.has(l.id) && milesBetween(here, l) > 20 && milesBetween(here, l) <= NEAR_MILES);
  if (!options.length) return null;
  const r = mix(state.rng || 1);
  return options[r % options.length].id;
}

function spendWant(state: GameState, want: Want): GameState | null {
  if (want === "parts") {
    if ((state.parts ?? 0) < 1) return null;
    return { ...state, parts: (state.parts ?? 0) - 1 };
  }
  if ((state.resources[want] ?? 0) < 1) return null;
  return { ...state, resources: { ...state.resources, [want]: state.resources[want] - 1 } };
}

function revealHome(state: GameState, id: string): GameState {
  const ls = state.locations[id];
  if (!ls) return state;
  return {
    ...state,
    locations: { ...state.locations, [id]: { ...ls, discovered: true, searchPct: ls.searchPct ?? 0 } },
  };
}

export function tickBands(state: GameState): GameState {
  const phase = phaseOf(state.day, modeOf(state));
  let next = state;
  const bands = bandsOf(next).map((b) => ({ ...b, with: { ...(b.with ?? {}) } }));
  for (const band of bands) {
    if (band.envoyId) {
      const envoy = next.survivors.find((s) => s.id === band.envoyId);
      const hurt = chance(next.rng, 0.18);
      next = { ...next, rng: hurt.r };
      if (envoy && hurt.ok) {
        next = {
          ...next,
          survivors: next.survivors.map((s) => (s.id === envoy.id ? { ...s, hp: Math.max(1, s.hp - 8) } : s)),
        };
      }
      next = push(next, t("long.envoyBack", { name: envoy?.name ?? "", band: bandLabel(band.id) }));
      band.envoyId = null;
    }
    if (band.stance === "friendly" && band.captiveId) {
      const roll = chance(next.rng, 0.4);
      next = { ...next, rng: roll.r };
      if (roll.ok) {
        const cid = band.captiveId;
        band.captiveId = null;
        next = {
          ...next,
          survivors: next.survivors.map((s) =>
            s.id === cid ? { ...s, alive: true, hp: Math.max(1, Math.round(s.maxHp * 0.45)), morale: Math.max(0, s.morale - 12) } : s,
          ),
        };
        const back = next.survivors.find((s) => s.id === cid);
        next = push(next, t("long.did.returned", { name: back?.name ?? "", band: bandLabel(band.id) }));
      }
    }
    if (!band.captiveId) continue;
    const held = next.survivors.find((s) => s.id === band.captiveId);
    if (held && !held.alive && band.stance === "hostile") {
      const before = band.exposure;
      band.exposure = Math.min(100, band.exposure + 20);
      if (before < 100 && band.exposure >= 100) {
        next = push(next, t("long.exposed", { band: bandLabel(band.id) }));
      } else if (band.exposure < 100) {
        next = push(next, t("long.ask", { band: bandLabel(band.id), name: held.name, pct: band.exposure }));
      }
    }
  }
  if (phase !== "settle" && state.day % 3 === 0 && bands.length > 1) {
    const roll = chance(next.rng, 0.65);
    next = { ...next, rng: roll.r };
    if (roll.ok) {
      const a = bands[Math.abs(next.rng) % bands.length];
      next = { ...next, rng: mix(next.rng || 1) };
      const near = bands.filter((b) => b.id !== a.id && milesBetween(locById(a.home), locById(b.home)) <= 400);
      const b = near[Math.abs(next.rng) % Math.max(1, near.length)];
      if (b) {
        next = { ...next, rng: mix(next.rng) };
        const stance: BandStance = next.rng % 3 === 0 ? "hostile" : next.rng % 3 === 1 ? "friendly" : "neutral";
        a.with = { ...(a.with ?? {}), [b.id]: stance };
        b.with = { ...(b.with ?? {}), [a.id]: stance };
        const known = a.met || b.met || next.locations[a.home]?.discovered || next.locations[b.home]?.discovered;
        if (known) {
          next = push(next, t(stance === "hostile" ? "long.feud" : "long.pact", { a: bandLabel(a.id), b: bandLabel(b.id), stance: t(`long.stance.${stance}`) }));
        }
        if (stance === "hostile") {
          const mover = a.met ? b : a;
          const wasKnown = mover.homeKnown || !!next.locations[mover.home]?.discovered;
          const dest = relocate(mover, bands, next);
          if (dest) {
            mover.home = dest;
            mover.region = locById(dest).region;
            mover.homeKnown = false;
            next = { ...next, rng: mix(next.rng) };
            if (wasKnown || mover.met) next = push(next, t("long.theyMoved", { band: bandLabel(mover.id) }));
          }
        }
      }
    }
  }
  if (phase === "season" && state.day % 4 === 0) {
    const angry = bands.find((b) => b.met && b.stance === "hostile" && b.exposure >= 100 && !b.captiveId);
    const cover = bands.find((b) => b.stance === "friendly" && (b.guard ?? 0) > 0);
    if (angry && cover) {
      next = push(next, t("long.did.helped", { band: bandLabel(cover.id), foe: bandLabel(angry.id) }));
    } else if (angry && next.shelter.barricade < 45) {
      const facs = (Object.keys(next.shelter.facilities) as FacilityId[]).filter((id) => (next.shelter.facilities[id] ?? 0) > 0 && !(next.halted ?? {})[id]);
      const hit = facs[0];
      if (hit) {
        const halted = { ...(next.halted ?? {}), [hit]: true };
        const parts = Math.max(0, (next.parts ?? 0) - 1);
        next = { ...next, halted, parts };
        next = push(next, t("long.raid", { band: bandLabel(angry.id), fac: t(`fac.${hit}`) }));
      }
    } else if (angry && next.shelter.barricade >= 45) {
      next = push(next, t("long.skirmish", { band: bandLabel(angry.id) }));
    }
  }
  for (const band of bands) {
    if ((band.guard ?? 0) > 0) band.guard = (band.guard ?? 0) - 1;
  }
  return putBands(next, bands);
}

export function clearExposure(state: GameState): GameState {
  const bands = bandsOf(state);
  const known = bands.some((b) => b.stance === "hostile" && b.exposure > 0);
  const next = putBands(
    state,
    bands.map((b) => ({ ...b, exposure: 0 })),
  );
  return known ? push(next, t("long.lostUs")) : next;
}

function push(state: GameState, text: string): GameState {
  return { ...state, log: [...(state.log ?? []), { day: state.day, text }].slice(-80) };
}

export function portraitTaken(people: Survivor[], id: string): boolean {
  return people.some((s) => s.alive && s.portrait === id && !s.faceData);
}
