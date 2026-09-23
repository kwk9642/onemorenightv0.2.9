import { locById } from "./data";
import type { GameState, PlayMode, SandboxOpts, Survivor } from "./types";

export function modeOf(state: Pick<GameState, "mode"> | { mode?: PlayMode }): PlayMode {
  return state.mode ?? "normal";
}

export function personDrink(s: Pick<Survivor, "traits">, waterLv: number): number {
  if (s.traits.includes("highthirst")) return 2;
  if (s.traits.includes("lowthirst")) return waterLv >= 1 ? 0 : 1;
  return 1;
}

export function waterBill(
  people: Pick<Survivor, "traits">[],
  waterLv: number,
  day: number,
  mode: PlayMode,
): { drink: number; yield: number } {
  const shares = people.reduce((n, s) => n + personDrink(s, waterLv), 0);
  let waste = 0;
  if (waterLv <= 0) {
    if (mode === "extinct" && day >= 8) waste = 1;
    else if (mode !== "casual" && day >= 16) waste = 1;
  }
  return { drink: shares + waste, yield: Math.max(0, waterLv) };
}

export function eatWaste(day: number, mode: PlayMode): number {
  if (mode === "casual") return 0;
  if (mode === "extinct") return day >= 8 ? 1 : 0;
  return day >= 16 ? 1 : 0;
}

export function rotAt(mode: PlayMode): number {
  if (mode === "casual") return 14;
  if (mode === "extinct") return 8;
  return 10;
}

export function fuelCost(state: GameState, destId: string): number {
  const home = locById(state.shelter.locationId);
  const dest = locById(destId);
  if (home.neighbors.includes(destId) || dest.neighbors.includes(home.id)) return 0;
  let n = dest.fuel;
  const mode = modeOf(state);
  if (mode === "casual") n = Math.max(0, n - 1);
  else if (mode === "extinct") n += 1;
  return n;
}

export function pressFoodCost(stillLv: number, mode: PlayMode): number {
  if (stillLv <= 0) return 0;
  if (mode === "casual") return stillLv >= 2 ? 1 : 2;
  if (mode === "extinct") return stillLv >= 2 ? 3 : 4;
  return stillLv >= 2 ? 2 : 3;
}

export function lootModeMul(state: GameState): number {
  const mode = modeOf(state);
  if (mode === "sandbox") return state.sandbox?.lootMul ?? 1;
  if (mode === "casual") return 1.5;
  if (mode === "extinct") return 0.7;
  return 1;
}

export function quietModeMul(state: GameState): number {
  const mode = modeOf(state);
  if (mode === "casual") return 0.55 / 0.42;
  if (mode === "extinct") return 0.25 / 0.42;
  return 1;
}

export function meleeFailInfect(mode: PlayMode): number {
  if (mode === "casual") return 0.2;
  if (mode === "extinct") return 0.5;
  return 0.35;
}

export function raidChance(raw: number, state: GameState): number {
  const mode = modeOf(state);
  if (mode === "sandbox") {
    const cap = state.sandbox?.raidCap ?? 0.75;
    return Math.min(cap, Math.max(0, raw));
  }
  if (mode === "casual") return Math.min(0.45, raw * 0.6);
  if (mode === "extinct") return Math.min(0.85, raw * 1.15);
  return Math.min(0.75, raw);
}

export const DEFAULT_SANDBOX: SandboxOpts = {
  companions: 0,
  customStash: false,
  food: 8,
  water: 8,
  materials: 6,
  medicine: 2,
  ammo: 0,
  fuel: 2,
  lootMul: 1,
  zedMul: 1,
  raidCap: 0.75,
  maxAP: 6,
  infectMul: 1,
  permadeath: true,
  chicagoWins: true,
  ignoreBeds: false,
};
