import { locById } from "./data";
import { chance, range } from "./rng";
import type { GameState, LocationState, PlayMode } from "./types";
import { modeOf } from "./mode";

export type ZombieKind = "walker" | "runner" | "brute" | "screamer" | "mutant";

export function pressureBand(day: number): number {
  if (day <= 3) return 1;
  if (day <= 7) return 2;
  if (day <= 14) return 3;
  if (day <= 21) return 4;
  return 5;
}

function rallyStart(mode: PlayMode): number {
  if (mode === "casual") return 16;
  if (mode === "extinct") return 6;
  return 10;
}

function rallyChance(mode: PlayMode): number {
  if (mode === "casual") return 0.08;
  if (mode === "extinct") return 0.18;
  return 0.12;
}

function rallyCapMul(mode: PlayMode): number {
  if (mode === "casual") return 1.2;
  if (mode === "extinct") return 2;
  return 1.5;
}

export function baseZombies(ls: LocationState, locId: string): number {
  return ls.baseZombies ?? locById(locId).zombies;
}

export function infectionWord(n: number): "low" | "mid" | "high" | "crit" {
  if (n >= 75) return "crit";
  if (n >= 50) return "high";
  if (n >= 25) return "mid";
  return "low";
}

/** Uncleared, non-neighbor pins may gain one. Cleared pins stay empty except extinct late. */
export function rallyNight(state: GameState): GameState {
  const mode = modeOf(state);
  const day = state.day;
  if (day < rallyStart(mode)) return state;
  const home = locById(state.shelter.locationId);
  let next = state;
  for (const loc of Object.keys(next.locations)) {
    if (loc === next.shelter.locationId) continue;
    const ls = next.locations[loc];
    if (!ls.discovered) continue;
    const def = locById(loc);
    const neighbor = home.neighbors.includes(loc) || def.neighbors.includes(home.id);
    if (neighbor) continue;
    const cap = Math.max(1, Math.round(baseZombies(ls, loc) * rallyCapMul(mode)));
    if (ls.zombies <= 0) {
      if (mode !== "extinct" || day < 20) continue;
      const back = chance(next.rng, 0.05);
      next = { ...next, rng: back.r };
      if (!back.ok) continue;
      next = {
        ...next,
        locations: {
          ...next.locations,
          [loc]: { ...ls, zombies: 1, cleared: false },
        },
      };
      continue;
    }
    if (ls.zombies >= cap) continue;
    const grow = chance(next.rng, rallyChance(mode));
    next = { ...next, rng: grow.r };
    if (!grow.ok) continue;
    const inf = Math.min(100, (ls.infection ?? 0) + 1);
    next = {
      ...next,
      locations: {
        ...next.locations,
        [loc]: { ...ls, zombies: ls.zombies + 1, infection: inf, cleared: false },
      },
    };
  }
  return next;
}

export function bumpInfection(state: GameState): GameState {
  const locations = { ...state.locations };
  for (const id of Object.keys(locations)) {
    const ls = locations[id];
    if (!ls.discovered || ls.occupied) continue;
    const noise = ls.noiseToday ?? 0;
    const add = 1 + (noise >= 4 ? 1 : 0);
    locations[id] = { ...ls, infection: Math.min(100, (ls.infection ?? 0) + add), noiseToday: 0 };
  }
  return { ...state, locations };
}

export function rollKind(state: GameState, locId: string, raid: boolean): { r: number; kind: ZombieKind } {
  const day = state.day;
  const mode = modeOf(state);
  const inf = state.locations[locId]?.infection ?? 0;
  let r = state.rng;
  if (raid && day >= 16) {
    const night = chance(r, mode === "extinct" ? 0.1 : mode === "casual" ? 0.04 : 0.06);
    r = night.r;
    if (night.ok) return { r, kind: "screamer" };
  }
  const earliest =
    mode === "casual" ? { runner: 8, brute: 14, screamer: 16, mutant: 20 } : mode === "extinct" ? { runner: 4, brute: 6, screamer: 8, mutant: 10 } : { runner: 5, brute: 8, screamer: 10, mutant: 15 };
  if (day < earliest.runner) return { r, kind: "walker" };
  const roll = range(r, 1, 100);
  r = roll.r;
  let n = roll.n;
  const bias = Math.floor(inf / 25);
  n = Math.min(100, n + bias * 4);
  if (day >= earliest.mutant && n >= 96) return { r, kind: "mutant" };
  if (day >= earliest.screamer && n >= 90) return { r, kind: "screamer" };
  if (day >= earliest.brute && n >= 78) return { r, kind: "brute" };
  if (n >= 62) return { r, kind: "runner" };
  return { r, kind: "walker" };
}

export function raidDamage(day: number, mode: PlayMode): [number, number] {
  if (day >= 16) return mode === "extinct" ? [22, 44] : [18, 40];
  if (day >= 8) return [16, 36];
  return [14, 32];
}
