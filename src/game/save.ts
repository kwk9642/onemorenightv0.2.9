import { SAVE_KEY, SAVE_VERSION, TRAITS, occById, traitById } from "./data";
import { composeSkills, emptySkills } from "./growth";
import { rollBands } from "./longrun";
import type { GameState, Survivor } from "./types";
import { padV03 } from "./v03";

function padSurvivor(s: Survivor): Survivor {
  const occ = occById(s.occupation);
  const known = (s.traits ?? []).filter((id) => TRAITS.some((t) => t.id === id));
  const traits = known.map(traitById);
  const skillBase = s.skillBase ?? composeSkills(occ.skills, traits);
  return {
    ...s,
    traits: known,
    skillXp: s.skillXp ?? emptySkills(),
    skillBase,
    lastSkillUp: s.lastSkillUp ?? null,
    kills: s.kills ?? 0,
    worn: s.worn ?? {},
    alive: s.alive !== false,
  };
}

export function acceptSave(raw: unknown): GameState | null {
  try {
    if (!raw || typeof raw !== "object") return null;
    const box = raw as { game?: string; state?: unknown };
    const data = (box.game === "one-more-night" && box.state ? box.state : raw) as GameState;
    if (!data || !Array.isArray(data.survivors) || !data.shelter?.locationId) return null;
    data.survivors = data.survivors.map(padSurvivor);
    data.bonds = data.bonds ?? {};
    data.stash = Array.isArray(data.stash) ? data.stash : [];
    data.notices = Array.isArray(data.notices) ? data.notices : [];
    data.log = Array.isArray(data.log) ? data.log.slice(-80) : [];
    data.dispatches = Array.isArray(data.dispatches) ? data.dispatches : [];
    data.resources = data.resources ?? { food: 0, water: 0, materials: 0, medicine: 0, ammo: 0, fuel: 0 };
    data.parts = data.parts ?? 0;
    data.wear = data.wear ?? {};
    data.halted = data.halted ?? {};
    data.herbs = data.herbs ?? [];
    data.mags = data.mags ?? [];
    data.meet = data.meet ?? null;
    if (!Array.isArray(data.bands) || data.bands.length === 0) {
      data.bands = rollBands(
        data.seed || 1,
        data.shelter.locationId,
        data.survivors.map((s) => s.portrait),
      );
    }
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

export function loadSave(): GameState | null {
  try {
    const raw =
      localStorage.getItem(SAVE_KEY) ??
      localStorage.getItem("ash-state-v4") ??
      localStorage.getItem("ash-state-v3") ??
      localStorage.getItem("ash-state-v2");
    if (!raw) return null;
    return acceptSave(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeSave(state: GameState) {
  try {
    const raw = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, raw);
    localStorage.setItem(SAVE_KEY + ":bak", raw);
  } catch {
    /* private mode / quota — the file copy is the one that survives */
  }
}

export function serializeSave(state: GameState): string {
  return JSON.stringify({ game: "one-more-night", save: SAVE_VERSION, state });
}

export function saveFileName(state: GameState): string {
  return `one-more-night-day-${state.day}.json`;
}

export async function downloadSave(state: GameState) {
  const text = serializeSave(state);
  const name = saveFileName(state);
  if (await shareNative(name, text)) return;
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function shareNative(name: string, text: string): Promise<boolean> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return false;
    const { Filesystem, Directory, Encoding } = await import("@capacitor/filesystem");
    const { Share } = await import("@capacitor/share");
    await Filesystem.writeFile({
      path: name,
      data: text,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    const uri = await Filesystem.getUri({ path: name, directory: Directory.Documents });
    await Share.share({ title: name, url: uri.uri, dialogTitle: name });
    return true;
  } catch {
    return false;
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
