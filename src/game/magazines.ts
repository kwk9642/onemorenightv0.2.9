import type { GameState } from "./types";
import { t } from "./i18n";

/** Mood paper only. Every occupation finds these. No rarity ladder. */
export const MAG_IDS = [
  "tide",
  "faces",
  "yard",
  "taste",
  "grit",
  "creek",
  "mech",
  "locker",
  "mad",
  "midwest",
  "earth",
  "handyman",
  "prevent",
  "circle",
  "farmj",
  "life",
] as const;

export type MagId = (typeof MAG_IDS)[number];

export type MagStack = { id: MagId; reads: number };

export function magsOf(state: GameState): MagStack[] {
  return state.mags ?? [];
}

export function grantMags(state: GameState, n: number): GameState {
  const have = [...magsOf(state)];
  let r = state.rng;
  for (let i = 0; i < n; i++) {
    r = (r * 1664525 + 1013904223) >>> 0;
    const id = MAG_IDS[r % MAG_IDS.length]!;
    const hit = have.find((m) => m.id === id);
    if (hit) continue;
    have.push({ id, reads: 0 });
  }
  return { ...state, rng: r, mags: have };
}

/** Any job, any pin. About half of searches. Not rare. */
export function maybeFindMag(state: GameState): GameState {
  let r = state.rng;
  r = (r * 1664525 + 1013904223) >>> 0;
  if (r % 100 >= 48) return { ...state, rng: r };
  const id = MAG_IDS[(r >>> 8) % MAG_IDS.length]!;
  const have = magsOf(state);
  if (have.some((m) => m.id === id) || have.length >= 6) return { ...state, rng: r };
  return {
    ...state,
    rng: r,
    mags: [...have, { id, reads: 0 }],
    log: [{ day: state.day, text: t("mag.found", { name: t(`mag.${id}`) }) }, ...state.log].slice(0, 40),
  };
}

export function readOne(state: GameState): { state: GameState; gain: number } {
  const stack = magsOf(state);
  const mag = stack[0];
  if (!mag) return { state, gain: 0 };
  const reads = mag.reads + 1;
  const gain = reads >= 3 ? 1 : reads === 2 ? 4 : 12;
  const nextStack =
    reads >= 3 ? stack.slice(1) : [{ ...mag, reads }, ...stack.slice(1)];
  return { state: { ...state, mags: nextStack }, gain };
}
