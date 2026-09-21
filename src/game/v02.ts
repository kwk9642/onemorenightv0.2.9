import { locById } from "./data";
import { living } from "./engine";
import type { GameState } from "./types";

export interface PlayerNote {
  id: string;
  from: string;
  q: string;
  status: "open" | "fixed-preview";
}

/** v0.2 先收，再一併改。不要逐條熱修打散版本。 */
export const V02_NOTES: PlayerNote[] = [
  {
    id: "infirmary-hidden-meds",
    from: "WhatsApp 玩家 · 第6天 莫卓農舍",
    q: "建材夠為什麼升不了醫務室？",
    status: "fixed-preview",
  },
  {
    id: "wall-what-for",
    from: "WhatsApp 玩家 · 第6天 莫卓農舍",
    q: "圍牆有什麼用、怎麼補？會有僵屍襲擊嗎？",
    status: "fixed-preview",
  },
  {
    id: "late-no-goal",
    from: "WhatsApp 玩家 · 第30–40天",
    q: "30–40天不知道要做什麼。標題是再撐一晚，但夜襲、水糧、搜索都沒壓力。",
    status: "fixed-preview",
  },
  {
    id: "fight-spawn-leftover",
    from: "WhatsApp 玩家 · 第30–40天",
    q: "肉搏/開槍越打越多，夾擊卡在剩餘2。地圖顯示已清理，回去又是2隻。",
    status: "fixed-preview",
  },
  {
    id: "gear-stats-discard",
    from: "WhatsApp 玩家 · 第30–40天",
    q: "裝備能力值不知道影響什麼。工坊幾乎不壞。用不到的裝備不能丟掉。",
    status: "fixed-preview",
  },
];

const KEY = "omn-v02-inbox";

export function snapshot(run: GameState | null) {
  if (!run) return "沒有進行中的存檔。";
  const loc = locById(run.shelter.locationId);
  const people = living(run);
  const fac = Object.entries(run.shelter.facilities)
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${k}:${n}`)
    .join(" ");
  const r = run.resources;
  return [
    `再活一晚 回報`,
    `日 ${run.day} · ${loc.name} · 圍牆 ${run.shelter.barricade}`,
    `人 ${people.length}/${run.shelter.capacity}（${people.map((s) => s.name).join("、") || "—"}）`,
    `食物${r.food} 水${r.water} 建材${r.materials} 藥${r.medicine} 彈${r.ammo} 油${r.fuel}`,
    fac ? `設施 ${fac}` : "設施 無",
    `畫面 ${run.screen}`,
  ].join("\n");
}

export function loadInbox(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function pushInbox(text: string) {
  const next = [text, ...loadInbox()].slice(0, 20);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
