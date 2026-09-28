/**
 * v0.3: AP, finite loot, threat, and the survival-pressure pass
 * from player reports (quiet search too strong, fights spawn more
 * zombies, raids too soft, stash cannot be thrown away).
 */
import { EMPTY_BAG, LOCATIONS, locById } from "./data";
import { range } from "./rng";
import type { GameState, LocationState, Resources } from "./types";

export const MAX_AP = 6;

export const AP_COST = {
  travel: 1,
  search: 1,
  fight: 1,
  next: 1,
  extract: 0,
  encounter: 1,
  build: 2,
  repairWall: 1,
  dispatch: 1,
} as const;

export const WALL_REPAIR_MATS = 2;

export function apOf(state: GameState) {
  return state.dayAP ?? MAX_AP;
}

export function threatBand(noise: number): "quiet" | "elevated" | "danger" | "horde" | "severe" {
  if (noise >= 50) return "severe";
  if (noise >= 35) return "horde";
  if (noise >= 20) return "danger";
  if (noise >= 10) return "elevated";
  return "quiet";
}

/** Day 1 = 1, ~day 25 = 2, cap ~3.2. Night raids and hunger waste scale on this. */
export function nightPressure(day: number) {
  return 1 + Math.min(2.2, Math.max(0, day - 1) / 24);
}

export function siteQuiet(ls: LocationState | undefined) {
  return !ls || ls.zombies <= 0;
}

export function seedLoot(r: number, locId: string): { r: number; bag: Resources } {
  const loc = locById(locId);
  const bag = EMPTY_BAG();
  let rng = r;
  const z = Math.max(1, loc.zones.length);
  for (const [k, pair] of Object.entries(loc.loot) as [keyof Resources, [number, number]][]) {
    const n = range(rng, pair[0] * z, pair[1] * z);
    rng = n.r;
    bag[k] = n.n;
  }
  return { r: rng, bag };
}

export function padLocation(ls: LocationState, locId: string, r: number): { r: number; ls: LocationState } {
  if (ls.lootRemaining && ls.threat != null && ls.noiseToday != null && ls.alertLevel != null) {
    return {
      r,
      ls: {
        ...ls,
        infection: ls.infection ?? 0,
        baseZombies: ls.baseZombies ?? locById(locId).zombies,
      },
    };
  }
  const seeded = ls.lootRemaining ? { r, bag: ls.lootRemaining } : seedLoot(r, locId);
  return {
    r: seeded.r,
    ls: {
      ...ls,
      lootRemaining: ls.lootRemaining ?? seeded.bag,
      threat: ls.threat ?? 0,
      noiseToday: ls.noiseToday ?? 0,
      alertLevel: ls.alertLevel ?? 0,
      infection: ls.infection ?? 0,
      baseZombies: ls.baseZombies ?? locById(locId).zombies,
    },
  };
}

export function padV03(state: GameState): GameState {
  let r = state.rng;
  const locations = { ...state.locations };
  for (const loc of LOCATIONS) {
    const cur = locations[loc.id];
    if (!cur) {
      const seeded = seedLoot(r, loc.id);
      r = seeded.r;
      const z = range(r, Math.max(1, loc.zombies - 2), loc.zombies + 2);
      r = z.r;
      locations[loc.id] = {
        zombies: z.n,
        discovered: !!loc.startKnown,
        cleared: false,
        occupied: false,
        visited: false,
        survivorOpen: loc.survivorChance > 0,
        lootRemaining: seeded.bag,
        threat: 0,
        noiseToday: 0,
        alertLevel: 0,
      };
      continue;
    }
    const padded = padLocation(cur, loc.id, r);
    r = padded.r;
    locations[loc.id] = padded.ls;
  }
  return {
    ...state,
    rng: r,
    version: Math.max(state.version ?? 0, 6),
    dayAP: state.dayAP ?? MAX_AP,
    maxAP: state.maxAP ?? MAX_AP,
    locations,
    dispatches: Array.isArray(state.dispatches) ? state.dispatches : [],
    mode: state.mode ?? "normal",
    stillCooldown: state.stillCooldown ?? 0,
    herbs: state.herbs ?? [],
    mags: state.mags ?? [],
    scenario: state.scenario ?? null,
    shelter: state.shelter
      ? {
          ...state.shelter,
          facilities: { ...state.shelter.facilities, still: state.shelter.facilities.still ?? 0 },
        }
      : state.shelter,
  };
}

export function lootLeft(bag: Resources | undefined) {
  if (!bag) return 0;
  return bag.food + bag.water + bag.materials + bag.medicine + bag.ammo + bag.fuel;
}