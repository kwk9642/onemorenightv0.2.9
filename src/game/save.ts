import { SAVE_KEY, SAVE_VERSION, occById, traitById } from "./data";
import { composeSkills, emptySkills } from "./growth";
import type { GameState, Survivor } from "./types";
import { padV03 } from "./v03";

function padSurvivor(s: Survivor): Survivor {
  const occ = occById(s.occupation);
  const traits = (s.traits ?? []).map(traitById);
  const skillBase = s.skillBase ?? composeSkills(occ.skills, traits);
  return {
    ...s,
    skillXp: s.skillXp ?? emptySkills(),
    skillBase,
    lastSkillUp: s.lastSkillUp ?? null,
    kills: s.kills ?? 0,
    traits: s.traits ?? [],
    worn: s.worn ?? {},
  };
}

export function loadSave(): GameState | null {
  try {
    const raw =
      localStorage.getItem(SAVE_KEY) ??
      localStorage.getItem("ash-state-v4") ??
      localStorage.getItem("ash-state-v3") ??
      localStorage.getItem("ash-state-v2");
    if (!raw) return null;
    const data = JSON.parse(raw) as GameState;
    if (!data || !Array.isArray(data.survivors)) return null;
    data.survivors = data.survivors.map(padSurvivor);
    data.bonds = data.bonds ?? {};
    data.stash = Array.isArray(data.stash) ? data.stash : [];
    data.notices = Array.isArray(data.notices) ? data.notices : [];
    data.log = Array.isArray(data.log) ? data.log.slice(-80) : [];
    data.dispatches = Array.isArray(data.dispatches) ? data.dispatches : [];
    if (data.mission) data.mission.finds = data.mission.finds ?? [];
    const padded = padV03(data);
    padded.version = SAVE_VERSION;
    if (!padded.screen || padded.screen === "title" || padded.screen === "create") {
      padded.screen = padded.ended ? "end" : "shelter";
    }
    if (padded.ended) padded.screen = "end";
    return padded;
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
    localStorage.removeItem(SAVE_KEY + ":bak");
    localStorage.removeItem("ash-state-v4");
    localStorage.removeItem("ash-state-v3");
    localStorage.removeItem("ash-state-v2");
  } catch {
    /* ignore */
  }
}

export function hasSave(): boolean {
  try {
    return !!(
      localStorage.getItem(SAVE_KEY) ||
      localStorage.getItem("ash-state-v4") ||
      localStorage.getItem("ash-state-v3") ||
      localStorage.getItem("ash-state-v2")
    );
  } catch {
    return false;
  }
}
