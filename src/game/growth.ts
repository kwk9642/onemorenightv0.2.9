import { t } from "./i18n";
import type { GameState, Relation, SkillId, Skills, Survivor } from "./types";
import {
  SKILL_KEYS,
  addSkillXp,
  clamp,
  emptySkills,
  skillBoostLine,
  skillUps,
} from "./skills";

export {
  SKILL_CAP,
  SKILL_KEYS,
  addSkillXp,
  applySkillXp,
  clamp,
  emptySkills,
  learnerRate,
  skillBoostBits,
  skillBoostLine,
  skillFx,
  skillLearnMul,
  skillProgress,
  skillUps,
  startXpMul,
  xpGainLine,
  xpToNext,
} from "./skills";

export const SKILL_NAMES: Record<SkillId, string> = {
  combat: "戰鬥",
  stealth: "潛行",
  scavenge: "搜刮",
  medical: "醫療",
  build: "建造",
  farm: "農耕",
  cook: "烹飪",
};

export function allocTotal(alloc: Partial<Skills>): number {
  let n = 0;
  for (const k of SKILL_KEYS) n += alloc[k] ?? 0;
  return n;
}

export type TraitMod = Partial<Skills> & { points: number; morale?: number };

export function traitPool(basePool: number, traits: TraitMod[]): number {
  return traits.reduce((sum, t) => sum + t.points, basePool);
}

export function composeSkills(innate: Skills, traits: TraitMod[], alloc: Partial<Skills> = {}): Skills {
  const s = emptySkills();
  for (const k of SKILL_KEYS) {
    let v = innate[k] + (alloc[k] ?? 0);
    for (const tr of traits) v += tr[k] ?? 0;
    s[k] = clamp(v, 0, 10);
  }
  return s;
}

export function grantSquadXp(state: GameState, ids: string[], skill: SkillId, amount: number): GameState {
  return {
    ...state,
    survivors: state.survivors.map((s) => (ids.includes(s.id) ? addSkillXp(s, skill, amount) : s)),
  };
}

export function grantSquadXpNoted(state: GameState, ids: string[], skill: SkillId, amount: number): GameState {
  let next = state;
  for (const id of ids) {
    const prev = next.survivors.find((s) => s.id === id);
    if (!prev) continue;
    next = {
      ...next,
      survivors: next.survivors.map((s) => (s.id === id ? addSkillXp(s, skill, amount) : s)),
    };
    const now = next.survivors.find((s) => s.id === id);
    if (now) next = noteSkillUps(next, prev, now);
  }
  return next;
}

export function noteSkillUps(state: GameState, prev: Survivor, now: Survivor): GameState {
  const ups = skillUps(prev, now);
  if (!ups.length) return state;
  let next = state;
  const notices = [...(next.notices ?? [])];
  for (const u of ups) {
    for (let lv = u.from + 1; lv <= u.to; lv++) {
      next = pushSkillLog(next, now.name, u.skill, lv);
      notices.push({ kind: "skill", name: now.name, skill: u.skill, level: lv });
    }
    next = {
      ...next,
      survivors: next.survivors.map((s) =>
        s.id === now.id ? { ...s, lastSkillUp: { skill: u.skill, level: u.to, day: next.day } } : s,
      ),
    };
  }
  return { ...next, notices };
}

function pushSkillLog(state: GameState, name: string, skill: SkillId, level: number): GameState {
  const text = t("log.skillLevel", {
    name,
    skill: t(`skill.${skill}`),
    n: level,
    rank: t(`skill.rank.${level}`),
    boost: `${t(`skill.${skill}.lv.${level}`)} ${skillBoostLine(skill, level)}`,
  });
  return {
    ...state,
    log: [...state.log, { day: state.day, text }],
  };
}

export const MOOD_MISSION = 30;
export const MOOD_WORK = 22;

export function moodLabel(n: number): { name: string; canMission: boolean; canWork: boolean } {
  if (n < 16) return { name: t("mood.broken"), canMission: false, canWork: false };
  if (n < MOOD_WORK) return { name: t("mood.despair"), canMission: false, canWork: false };
  if (n < MOOD_MISSION) return { name: t("mood.low"), canMission: false, canWork: true };
  if (n < 46) return { name: t("mood.anxious"), canMission: true, canWork: true };
  if (n < 66) return { name: t("mood.steady"), canMission: true, canWork: true };
  if (n < 82) return { name: t("mood.stable"), canMission: true, canWork: true };
  return { name: t("mood.high"), canMission: true, canWork: true };
}

export function canMission(s: Survivor): boolean {
  const sick = (s.ailments ?? []).some((a) => a.id === "poison");
  return s.alive && !sick && s.morale >= MOOD_MISSION && s.hp > 12 && s.fatigue < 92;
}

export function canWork(s: Survivor): boolean {
  return s.alive && s.morale >= MOOD_WORK;
}

export function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function bondOf(state: GameState, a: string, b: string): number {
  if (a === b) return 0;
  return state.bonds?.[pairKey(a, b)] ?? 0;
}

export function relationOf(n: number): { id: Relation; name: string } {
  if (n >= 75) return { id: "lover", name: t("rel.lover") };
  if (n >= 50) return { id: "friend", name: t("rel.friend") };
  if (n >= 25) return { id: "known", name: t("rel.known") };
  return { id: "stranger", name: t("rel.stranger") };
}

export function setBond(state: GameState, a: string, b: string, value: number): GameState {
  if (a === b) return state;
  const key = pairKey(a, b);
  return { ...state, bonds: { ...state.bonds, [key]: clamp(value, 0, 100) } };
}

export function addBond(state: GameState, a: string, b: string, delta: number): GameState {
  return setBond(state, a, b, bondOf(state, a, b) + delta);
}

export function squadRelationBonus(state: GameState, s: Survivor, squadIds: string[]): Skills {
  const extra = emptySkills();
  const others = squadIds.filter((id) => id !== s.id);
  let friend = false;
  let lover = false;
  for (const id of others) {
    const rel = relationOf(bondOf(state, s.id, id)).id;
    if (rel === "lover") lover = true;
    if (rel === "friend" || rel === "lover") friend = true;
  }
  if (lover) {
    extra.combat += 2;
    extra.stealth += 1;
    extra.scavenge += 1;
  } else if (friend) {
    extra.combat += 1;
  }
  return extra;
}

export function effectiveSkills(state: GameState, s: Survivor, squadIds?: string[]): Skills {
  const ids = squadIds ?? state.mission?.squadIds ?? [];
  const bonus = squadRelationBonus(state, s, ids);
  const out = emptySkills();
  for (const k of SKILL_KEYS) out[k] = clamp(s.skills[k] + bonus[k], 0, 10);
  return out;
}

export function startingMorale(traits: { morale?: number }[]): number {
  let m = 62;
  for (const tr of traits) m += tr.morale ?? 0;
  return clamp(m, 8, 100);
}
