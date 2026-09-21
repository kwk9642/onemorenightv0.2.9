/** Live game bible. Source of truth is data.ts + gear.ts — do not duplicate numbers here. */
import {
  FACILITIES,
  GAME_VERSION,
  JOBS,
  LOCATIONS,
  OCCUPATIONS,
  RESOURCES,
  START_SHELTERS,
  TRAITS,
  WEAPONS,
} from "./data";
import { GEAR } from "./gear";

export const BIBLE_TABS = [
  "overview",
  "shelters",
  "locations",
  "weapons",
  "gear",
  "occupations",
  "traits",
  "facilities",
  "jobs",
  "rules",
] as const;
export type BibleTab = (typeof BIBLE_TABS)[number];

export const RULES = [
  {
    id: "fight-power",
    name: "文字戰鬥火力",
    formula: "power = (戰鬥技能×8 + 武器攻擊×2) × 狀態修正",
    note: "近戰／開槍／側翼再加權。槍：+18+耗彈×6，耗彈=min(庫存, 2+僵屍/8)。側翼：+潛行×4。",
  },
  {
    id: "fight-score",
    name: "勝負",
    formula: "score = power×(0.8~1.2) − (該地僵屍×7 + 噪音)×(0.8~1.2)",
    note: "score>25 多殺2；>0 多殺1。槍保底殺 2+耗彈/2。失敗近戰感染 35%/18%，開槍較低。",
  },
  {
    id: "sim-hit",
    name: "2.5D 揮擊（研發，未進 v0.1）",
    formula: "傷害 = 10 + 戰鬥技能 + 武器攻擊",
    note: "只在出征模擬畫布。v0.1 出征仍走上面文字戰鬥。",
  },
  {
    id: "raid",
    name: "夜襲",
    formula: "機率 = clamp((100−圍牆)/220 − 警戒人數×0.08 − 哨塔等級×0.06, 0, 0.45)",
    note: "中了：隨機在家的人傷 10–28、感染 20%、食物−2、圍牆−8。修繕過夜約+8牆，打造耗1建材約+6牆。",
  },
  {
    id: "upgrade",
    name: "建造花費",
    formula: "建材 = 基價×(現有等級+1)；額外資源同樣乘級",
    note: "醫務室額外要藥；無線電額外要燃油。按鈕會列出全部，不夠寫「缺xx」。",
  },
  {
    id: "weapon-cond",
    name: "武器耐久",
    formula: "實際攻擊 = round(面板攻擊 × 耐久係數)",
    note: "耐久 0 當徒手（攻擊 0）。槍沒子彈在文字戰不能選開槍。",
  },
];

export function bible() {
  const weapons = GEAR.filter((g) => g.slot === "weapon").map((g) => ({
    id: g.id,
    zh: g.names.zh,
    en: g.names.en,
    rarity: g.rarity,
    melee: g.melee ?? 0,
    gun: !!g.gun,
    extra: extraStats(g),
  }));
  const fists = WEAPONS.fists;
  return {
    version: GAME_VERSION,
    counts: {
      startShelters: START_SHELTERS.length,
      locations: LOCATIONS.length,
      occupations: OCCUPATIONS.length,
      traits: TRAITS.length,
      facilities: FACILITIES.length,
      jobs: JOBS.length,
      weapons: weapons.length + 1,
      gear: GEAR.length,
      resources: RESOURCES.length,
    },
    shelters: START_SHELTERS.map((s) => ({
      id: s.id,
      zh: s.name,
      en: s.nameEn,
      locationId: s.locationId,
      capacity: s.capacity,
      wall: s.barricade,
      facilities: s.facilities,
      extras: s.extras,
      blurb: s.blurb,
    })),
    locations: LOCATIONS.map((l) => ({
      id: l.id,
      zh: l.name,
      en: l.nameEn,
      region: l.region,
      size: l.size,
      zombies: l.zombies,
      occupyCapacity: l.occupyCapacity,
      occupyWall: l.occupyBarricade,
      survivorChance: l.survivorChance,
      start: !!l.isStart,
      loot: l.loot,
      neighbors: l.neighbors,
    })),
    weapons: [{ id: "fists", zh: fists.name, en: "Fists", rarity: "—", melee: fists.melee, gun: false, extra: "" }, ...weapons],
    gear: GEAR.map((g) => ({
      id: g.id,
      zh: g.names.zh,
      en: g.names.en,
      slot: g.slot,
      rarity: g.rarity,
      melee: g.melee ?? "",
      gun: g.gun ? "Y" : "",
      armor: g.armor ?? "",
      bite: g.bite ?? "",
      extra: extraStats(g),
    })),
    occupations: OCCUPATIONS.map((o) => ({
      id: o.id,
      zh: o.name,
      en: o.nameEn,
      hp: o.hp,
      pool: o.pool,
      weapon: o.weapon,
      start: o.start,
      granted: o.granted,
      combat: o.skills.combat,
      stealth: o.skills.stealth,
      medical: o.skills.medical,
      build: o.skills.build,
      farm: o.skills.farm,
      cook: o.skills.cook,
      scavenge: o.skills.scavenge,
    })),
    traits: TRAITS.map((t) => ({
      id: t.id,
      zh: t.name,
      kind: t.kind,
      points: t.points,
      blurb: t.blurb,
      combat: t.combat ?? "",
      hp: t.hp ?? "",
    })),
    facilities: FACILITIES.map((f) => ({
      id: f.id,
      zh: f.name,
      max: f.max,
      materials: f.cost.materials,
      extra: f.cost.extra ?? {},
      effect: f.effect,
      blurb: f.blurb,
    })),
    jobs: JOBS.map((j) => ({
      id: j.id,
      zh: j.name,
      need: j.need ?? "—",
      blurb: j.blurb,
    })),
    resources: RESOURCES,
    rules: RULES,
  };
}

function extraStats(g: (typeof GEAR)[number]) {
  const skip = new Set(["id", "slot", "rarity", "tags", "names", "melee", "gun"]);
  return Object.entries(g)
    .filter(([k, v]) => !skip.has(k) && v !== undefined && v !== 0)
    .map(([k, v]) => `${k}:${v}`)
    .join(" ");
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
