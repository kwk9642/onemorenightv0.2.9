import type { GameState, Survivor } from "./types";
import { chance, range } from "./rng";
import { t } from "./i18n";

export type AilmentId =
  | "wound"
  | "sepsis"
  | "fever"
  | "dysentery"
  | "cough"
  | "insomnia"
  | "poison"
  | "mutant";

export type HerbId =
  | "plantain"
  | "yarrow"
  | "mint"
  | "dandelion"
  | "pine"
  | "coneflower"
  | "elder"
  | "goldenseal"
  | "ginseng"
  | "yew";

export interface Ailment {
  id: AilmentId;
  since: number;
}

export interface HerbStack {
  id: HerbId;
  qty: number;
  known: boolean;
}

const ROADSIDE: HerbId[] = ["plantain", "yarrow", "mint", "dandelion", "pine"];
const LATER: HerbId[] = ["coneflower", "elder", "yew"];

export function potency(medical: number): number {
  if (medical >= 8) return 1.4;
  if (medical >= 5) return 1.2;
  if (medical >= 3) return 1.0;
  return 0.6;
}

export function ailmentsOf(s: Survivor): Ailment[] {
  return s.ailments ?? [];
}

export function hasAilment(s: Survivor, id: AilmentId): boolean {
  return ailmentsOf(s).some((a) => a.id === id);
}

export function herbsOf(state: GameState): HerbStack[] {
  return state.herbs ?? [];
}

function put(s: Survivor, list: Ailment[]): Survivor {
  return { ...s, ailments: list.slice(0, 2) };
}

export function addAilment(s: Survivor, id: AilmentId, day: number): Survivor {
  if (hasAilment(s, id)) return s;
  const cur = ailmentsOf(s);
  if (cur.length >= 2) return s;
  return put(s, [...cur, { id, since: day }]);
}

export function dropAilment(s: Survivor, id: AilmentId): Survivor {
  return put(s, ailmentsOf(s).filter((a) => a.id !== id));
}

export function addHerb(state: GameState, id: HerbId, known: boolean, qty = 1): GameState {
  const herbs = herbsOf(state).map((h) => ({ ...h }));
  const hit = herbs.find((h) => h.id === id && h.known === known);
  if (hit) hit.qty += qty;
  else herbs.push({ id, qty, known });
  return { ...state, herbs };
}

export function rollHerb(day: number, r0: number): { r: number; id: HerbId } {
  const pool = day >= 8 ? [...ROADSIDE, ...LATER] : ROADSIDE;
  const p = range(r0, 0, pool.length - 1);
  return { r: p.r, id: pool[p.n] };
}

export function knowsOnSight(s: Survivor): boolean {
  return s.skills.medical >= 4 || s.skills.farm >= 5;
}

/** Nightly disease. Bite is untouched. */
export function tickAilments(state: GameState): GameState {
  let next = state;
  let apCut = 0;
  for (const s of next.survivors) {
    if (!s.alive) continue;
    let cur = s;
    for (const a of [...ailmentsOf(cur)]) {
      const nights = next.day - a.since;
      if (a.id === "wound" && nights >= 2) {
        cur = dropAilment(cur, "wound");
        cur = addAilment(cur, "sepsis", next.day);
        next = log(next, t("herb.log.sepsis", { name: cur.name }));
      } else if (a.id === "sepsis" && nights >= 3) {
        const c = chance(next.rng, 0.35);
        next = { ...next, rng: c.r };
        if (c.ok) {
          cur = { ...cur, alive: false, hp: 0, death: t("herb.death.sepsis") };
          next = log(next, t("herb.log.sepsisDie", { name: s.name }));
        }
      } else if (a.id === "fever" || a.id === "mutant") {
        apCut = 1;
      } else if (a.id === "poison" && nights >= 1) {
        cur = dropAilment(cur, "poison");
      } else if (a.id === "dysentery" && next.resources.water > 0) {
        next = { ...next, resources: { ...next.resources, water: next.resources.water - 1 } };
      }
    }
    next = {
      ...next,
      survivors: next.survivors.map((x) => (x.id === s.id ? cur : x)),
    };
  }
  if (apCut) {
    next = { ...next, dayAP: Math.max(1, next.dayAP - 1) };
    next = log(next, t("herb.log.feverAp"));
  }
  return next;
}

function log(state: GameState, text: string): GameState {
  return { ...state, log: [{ day: state.day, text }, ...state.log].slice(0, 40) };
}

const POULTICE = new Set<HerbId>(["plantain", "yarrow", "goldenseal"]);
const TEA = new Set<HerbId>(["mint", "pine", "elder", "dandelion", "coneflower"]);

export function useHerb(state: GameState, whoId: string, index: number, how: "poultice" | "brew"): GameState {
  const who = state.survivors.find((s) => s.id === whoId && s.alive);
  const stack = herbsOf(state)[index];
  if (!who || !stack || stack.qty < 1) return state;
  let next: GameState = {
    ...state,
    herbs: herbsOf(state)
      .map((h, i) => (i === index ? { ...h, qty: h.qty - 1 } : h))
      .filter((h) => h.qty > 0),
  };
  if (!stack.known && how === "brew") {
    const real = stack.id;
    next = map(next, who.id, (s) => addAilment(s, "poison", next.day));
    if (real === "yew") {
      const c = chance(next.rng, 0.08);
      next = { ...next, rng: c.r };
      if (c.ok) {
        next = map(next, who.id, (s) => ({ ...s, alive: false, hp: 0, death: t("herb.death.yew") }));
        return log(next, t("herb.log.yew", { name: who.name }));
      }
    }
    return log(next, t("herb.log.poison", { name: who.name }));
  }
  const med = who.skills.medical;
  const pot = potency(med);
  const id = stack.id;
  if (how === "poultice" && POULTICE.has(id) && (hasAilment(who, "wound") || hasAilment(who, "sepsis"))) {
    const c = chance(next.rng, Math.min(0.85, 0.45 * pot));
    next = { ...next, rng: c.r };
    if (c.ok && hasAilment(who, "wound")) {
      next = map(next, who.id, (s) => dropAilment(s, "wound"));
      return log(next, t("herb.log.poultice", { name: who.name }));
    }
    if (hasAilment(who, "sepsis") && med >= 5) {
      next = map(next, who.id, (s) => ({
        ...s,
        ailments: ailmentsOf(s).map((a) => (a.id === "sepsis" ? { ...a, since: next.day } : a)),
      }));
      return log(next, t("herb.log.slow", { name: who.name }));
    }
    return log(next, t("herb.log.weak", { name: who.name }));
  }
  if (how === "brew" && TEA.has(id)) {
    if (id === "mint" && hasAilment(who, "dysentery") && pot >= 1) {
      next = map(next, who.id, (s) => dropAilment(s, "dysentery"));
      return log(next, t("herb.log.tea", { name: who.name }));
    }
    if ((id === "elder" || id === "coneflower") && (hasAilment(who, "fever") || hasAilment(who, "mutant")) && pot >= 1) {
      const drop = pot >= 1.2 ? "fever" : null;
      next = map(next, who.id, (s) => {
        let n = drop ? dropAilment(s, "fever") : s;
        if (pot >= 1.2 && hasAilment(s, "mutant")) {
          n = {
            ...n,
            ailments: ailmentsOf(n).map((a) => (a.id === "mutant" ? { ...a, since: next.day } : a)),
          };
        }
        return n;
      });
      return log(next, t("herb.log.tea", { name: who.name }));
    }
    if (id === "pine" && hasAilment(who, "cough") && pot >= 1) {
      next = map(next, who.id, (s) => dropAilment(s, "cough"));
      return log(next, t("herb.log.tea", { name: who.name }));
    }
    return log(next, t("herb.log.sip", { name: who.name }));
  }
  return log(next, t("herb.log.wrong", { name: who.name }));
}

function map(state: GameState, id: string, fn: (s: Survivor) => Survivor): GameState {
  return { ...state, survivors: state.survivors.map((s) => (s.id === id ? fn(s) : s)) };
}

export function woundFromHurt(s: Survivor, day: number): Survivor {
  return addAilment(s, "wound", day);
}

export function afterFightHurt(s: Survivor, day: number, foe: string | undefined, melee: boolean): Survivor {
  let n = woundFromHurt(s, day);
  if (foe === "screamer") n = addAilment(n, "cough", day);
  if (melee && day >= 15 && (foe === "mutant" || foe === "brute")) n = addAilment(n, "mutant", day);
  return n;
}

export function applyLate(state: GameState): GameState {
  const lead = state.survivors[0];
  if (!lead) return state;
  const hurtLead = addAilment(addAilment({ ...lead, hp: Math.round(lead.maxHp * 0.55), morale: 28 }, "wound", 8), "fever", 8);
  return {
    ...state,
    scenario: "late",
    day: 8,
    resources: {
      ...state.resources,
      food: Math.min(state.resources.food, 4),
      water: Math.min(state.resources.water, 2),
      fuel: Math.min(state.resources.fuel, 1),
      medicine: Math.min(state.resources.medicine, 1),
    },
    shelter: {
      ...state.shelter,
      barricade: Math.min(state.shelter.barricade, 24),
      facilities: { ...state.shelter.facilities, water: Math.min(state.shelter.facilities.water, 1) },
    },
    survivors: state.survivors.map((s, i) => (i === 0 ? hurtLead : s)),
    log: [{ day: 8, text: t("herb.log.late") }, ...state.log].slice(0, 40),
  };
}
