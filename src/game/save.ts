import { SAVE_KEY, SAVE_VERSION } from "./data";
import type { GameState } from "./types";

export function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GameState;
    if (!data || data.version !== SAVE_VERSION) return null;
    if (!Array.isArray(data.survivors)) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeSave(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    localStorage.setItem(SAVE_KEY + ":bak", JSON.stringify(state));
  } catch {
    /* private mode / quota */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasSave(): boolean {
  try {
    return !!localStorage.getItem(SAVE_KEY);
  } catch {
    return false;
  }
}
