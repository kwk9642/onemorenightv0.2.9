import { t } from "./i18n";
import type { SkillId, Skills, Survivor, TraitId } from "./types";

export const SKILL_KEYS: SkillId[] = [
  "combat",
  "stealth",
  "scavenge",
  "medical",
  "build",
  "farm",
  "cook",
];

export const SKILL_CAP = 10;

export function emptySkills(): Skills {
  return { combat: 0, stealth: 0, scavenge: 0, medical: 0, build: 0, farm: 0, cook: 0 };
}

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function clampSkill(n: number) {
  return clamp(Math.round(n), 0, SKILL_CAP);
}

/** Project Zomboid: XP speed is locked by the level you started with. */
export function startXpMul(baseLevel: number): number {
  const n = clamp(baseLevel, 0, SKILL_CAP);
  if (n <= 0) return 0.25;
  if (n === 1) return 1;
  if (n === 2) return 1.33;
  return 1.66;
}

export function learnerRate(traits: TraitId[]): number {
  let r = 1;
  if (traits.includes("fastlearner")) r += 0.35;
  if (traits.includes("slowlearner")) r -= 0.35;
  return Math.max(0.4, r);
}

export function skillLearnMul(s: Pick<Survivor, "traits" | "skillBase">, skill: SkillId): number {
  const base = s.skillBase?.[skill] ?? 0;
  return startXpMul(base) * learnerRate(s.traits);
}

/** Same curve as before — 36, 51, 73… so old progress still reads. */
export function xpToNext(level: number): number {
  return Math.round(36 * Math.pow(1.42, clamp(level, 0, 9)));
}

export type SkillFx = {
  atk: number;
  woundPct: number;
  extraKill: number;
  noisePct: number;
  flankNeed: number;
  extraFlank: number;
  quietLoot: number;
  loot: number;
  gearP: number;
  extraGear: number;
  heal: number;
  cure: number;
  tendHp: number;
  wall: number;
  wallExtra: number;
  mend: number;
  doubleMend: boolean;
  farmMul: number;
  extraCrop: number;
  cookFood: number;
  cookMorale: number;
};

export function skillFx(skill: SkillId, level: number): SkillFx {
  const lv = clampSkill(level);
  return {
    atk: skill === "combat" ? lv * 8 : 0,
    woundPct: skill === "combat" ? Math.round(lv * 3.5) : 0,
    extraKill:
      skill === "combat" ? (lv >= 5 ? 1 : 0) + (lv >= 8 ? 1 : 0) + (lv >= 10 ? 1 : 0) : 0,
    noisePct: skill === "stealth" ? Math.round(lv * 7) : 0,
    flankNeed: skill === "stealth" ? (lv >= 5 ? 5 : 6) : 6,
    extraFlank: skill === "stealth" ? (lv >= 6 ? 1 : 0) + (lv >= 9 ? 1 : 0) : 0,
    quietLoot: skill === "stealth" ? (lv >= 4 ? 1.12 : 1) + (lv >= 7 ? 0.1 : 0) : 1,
    loot: skill === "scavenge" ? 0.7 + lv / 14 : 1,
    gearP: skill === "scavenge" ? lv * 0.025 : 0,
    extraGear: skill === "scavenge" && lv >= 7 ? 1 : 0,
    heal: skill === "medical" ? 10 + lv : 0,
    cure: skill === "medical" ? 0.4 + lv / 15 : 0,
    tendHp: skill === "medical" ? (lv >= 4 ? 2 : 0) + (lv >= 8 ? 4 : 0) : 0,
    wall: skill === "build" ? 8 + lv : 0,
    wallExtra: skill === "build" ? (lv >= 7 ? 3 : 0) + (lv >= 10 ? 4 : 0) : 0,
    mend: skill === "build" ? 6 + lv : 0,
    doubleMend: skill === "build" && lv >= 8,
    farmMul: skill === "farm" ? 0.45 + lv / 14 : 0,
    extraCrop: skill === "farm" ? (lv >= 4 ? 1 : 0) + (lv >= 8 ? 1 : 0) + (lv >= 10 ? 1 : 0) : 0,
    cookFood: skill === "cook" ? (lv >= 4 ? 1 : 0) + (lv >= 8 ? 1 : 0) + (lv >= 10 ? 1 : 0) : 0,
    cookMorale: skill === "cook" ? (lv >= 2 ? 2 : 0) + (lv >= 6 ? 4 : 0) + (lv >= 10 ? 6 : 0) : 0,
  };
}

export function skillBoostBits(skill: SkillId, level: number): string[] {
  const lv = clampSkill(level);
  const fx = skillFx(skill, lv);
  const bits: string[] = [];
  if (skill === "combat") {
    bits.push(t("skill.bit.atk", { n: fx.atk }));
    if (fx.woundPct) bits.push(t("skill.bit.wound", { n: fx.woundPct }));
    if (fx.extraKill) bits.push(t("skill.bit.kill", { n: fx.extraKill }));
    if (lv === 0) bits.push(t("skill.bit.combat0"));
  } else if (skill === "stealth") {
    bits.push(t("skill.bit.noise", { n: fx.noisePct }));
    bits.push(t("skill.bit.flank", { n: fx.flankNeed }));
    if (fx.extraFlank) bits.push(t("skill.bit.flankKill", { n: fx.extraFlank }));
    if (fx.quietLoot > 1) bits.push(t("skill.bit.quietLoot"));
  } else if (skill === "scavenge") {
    bits.push(t("skill.bit.loot", { n: Math.round(fx.loot * 100) }));
    if (fx.gearP) bits.push(t("skill.bit.gear", { n: Math.round(fx.gearP * 100) }));
    if (fx.extraGear) bits.push(t("skill.bit.extraGear"));
  } else if (skill === "medical") {
    bits.push(t("skill.bit.heal", { n: fx.heal }));
    bits.push(t("skill.bit.cure", { n: Math.round(fx.cure * 100) }));
    if (fx.tendHp) bits.push(t("skill.bit.tendHp", { n: fx.tendHp }));
  } else if (skill === "build") {
    bits.push(t("skill.bit.wall", { n: fx.wall + fx.wallExtra }));
    bits.push(t("skill.bit.mend", { n: fx.mend }));
    if (fx.doubleMend) bits.push(t("skill.bit.doubleMend"));
  } else if (skill === "farm") {
    bits.push(t("skill.bit.farm", { n: Math.round(fx.farmMul * 100) }));
    if (fx.extraCrop) bits.push(t("skill.bit.crop", { n: fx.extraCrop }));
  } else if (skill === "cook") {
    bits.push(t("skill.bit.cookFood", { n: 1 + fx.cookFood }));
    bits.push(t("skill.bit.cookMorale", { n: 8 + fx.cookMorale }));
  }
  return bits;
}

export function skillBoostLine(skill: SkillId, level: number): string {
  return skillBoostBits(skill, level).join(t("ui.dot"));
}

export type XpApply = {
  survivor: Survivor;
  gained: number;
  from: number;
  to: number;
  leftover: number;
  need: number;
};

export function applySkillXp(s: Survivor, skill: SkillId, amount: number): XpApply {
  const from = s.skills[skill] ?? 0;
  const need0 = xpToNext(from);
  if (!s.alive || amount <= 0 || from >= SKILL_CAP) {
    return { survivor: s, gained: 0, from, to: from, leftover: s.skillXp?.[skill] ?? 0, need: need0 };
  }
  const gained = amount * skillLearnMul(s, skill);
  let xp = (s.skillXp?.[skill] ?? 0) + gained;
  let level = from;
  const skillXp = { ...emptySkills(), ...s.skillXp };
  while (level < SKILL_CAP) {
    const need = xpToNext(level);
    if (xp < need) break;
    xp -= need;
    level += 1;
  }
  skillXp[skill] = level >= SKILL_CAP ? 0 : xp;
  const survivor: Survivor = {
    ...s,
    skills: { ...s.skills, [skill]: level },
    skillXp,
    lastSkillUp: level > from ? { skill, level, day: s.lastSkillUp?.day ?? 0 } : s.lastSkillUp,
  };
  return { survivor, gained, from, to: level, leftover: skillXp[skill], need: xpToNext(Math.min(level, 9)) };
}

export function addSkillXp(s: Survivor, skill: SkillId, amount: number): Survivor {
  return applySkillXp(s, skill, amount).survivor;
}

export function skillUps(prev: Survivor, next: Survivor): { skill: SkillId; from: number; to: number }[] {
  const out: { skill: SkillId; from: number; to: number }[] = [];
  for (const k of SKILL_KEYS) {
    if ((next.skills[k] ?? 0) > (prev.skills[k] ?? 0)) {
      out.push({ skill: k, from: prev.skills[k] ?? 0, to: next.skills[k] ?? 0 });
    }
  }
  return out;
}

export function skillProgress(s: Pick<Survivor, "skills" | "skillXp" | "skillBase" | "traits">, skill: SkillId) {
  const lv = s.skills[skill] ?? 0;
  const xp = s.skillXp?.[skill] ?? 0;
  const need = xpToNext(lv);
  const maxed = lv >= SKILL_CAP;
  return {
    lv,
    xp,
    need,
    maxed,
    pct: maxed ? 100 : Math.min(100, (xp / need) * 100),
    mul: skillLearnMul({ traits: s.traits, skillBase: s.skillBase ?? emptySkills() }, skill),
    base: s.skillBase?.[skill] ?? 0,
  };
}

export function xpGainLine(skill: SkillId, result: XpApply): string {
  if (result.to > result.from) {
    const parts: string[] = [];
    for (let lv = result.from + 1; lv <= result.to; lv++) {
      parts.push(
        t("skill.leveled", {
          skill: t(`skill.${skill}`),
          n: lv,
          rank: t(`skill.rank.${lv}`),
          boost: t(`skill.${skill}.lv.${lv}`),
        }),
      );
    }
    return parts.join(" ");
  }
  if (result.gained <= 0) return "";
  const left = Math.max(0, Math.ceil(result.need - result.leftover));
  return t("skill.xpGain", {
    skill: t(`skill.${skill}`),
    n: Math.max(1, Math.round(result.gained)),
    left,
  });
}
