import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createNewGame, restNight } from "./engine.ts";
import { composeSkills } from "./growth.ts";
import {
  applySkillXp,
  emptySkills,
  skillFx,
  skillLearnMul,
  startXpMul,
  xpToNext,
} from "./skills.ts";
import type { Survivor } from "./types.ts";

function dummy(over: Partial<Survivor> = {}): Survivor {
  const skills = over.skills ?? { combat: 0, stealth: 0, scavenge: 0, medical: 0, build: 0, farm: 4, cook: 0 };
  const base = over.skillBase ?? { ...skills };
  return {
    id: over.id ?? "a",
    name: over.name ?? "Mara",
    occupation: over.occupation ?? "farmer",
    traits: over.traits ?? [],
    portrait: over.portrait ?? "farm",
    skills,
    skillXp: over.skillXp ?? emptySkills(),
    skillBase: base,
    lastSkillUp: over.lastSkillUp ?? null,
    hp: over.hp ?? 100,
    maxHp: over.maxHp ?? 100,
    hunger: over.hunger ?? 80,
    thirst: over.thirst ?? 80,
    morale: over.morale ?? 70,
    fatigue: over.fatigue ?? 10,
    infected: over.infected ?? false,
    weapon: over.weapon ?? "bat",
    worn: over.worn ?? {},
    stance: over.stance ?? "leader",
    job: over.job ?? "farm",
    alive: over.alive ?? true,
    death: over.death ?? "",
    daysIn: over.daysIn ?? 1,
    kills: over.kills ?? 0,
  };
}

describe("skill ranks 0-10", () => {
  it("XP curve rises each level", () => {
    for (let i = 0; i < 9; i++) assert.ok(xpToNext(i + 1) > xpToNext(i));
  });

  it("starting XP mul is PZ-like", () => {
    assert.equal(startXpMul(0), 0.25);
    assert.equal(startXpMul(1), 1);
    assert.equal(startXpMul(2), 1.33);
    assert.equal(startXpMul(3), 1.66);
    assert.equal(startXpMul(10), 1.66);
  });

  it("combat 0 learns at 25%", () => {
    const s = dummy({ skills: emptySkills(), skillBase: emptySkills() });
    assert.equal(skillLearnMul(s, "combat"), 0.25);
    const r = applySkillXp(s, "combat", 100);
    assert.equal(r.gained, 25);
  });

  it("innate 4 combat learns at 166%", () => {
    const skills = { ...emptySkills(), combat: 4 };
    const s = dummy({ skills, skillBase: skills });
    assert.ok(Math.abs(skillLearnMul(s, "combat") - 1.66) < 1e-9);
  });

  it("levels up when XP fills the bar, cap 10", () => {
    const s = dummy({ skills: emptySkills(), skillBase: { ...emptySkills(), combat: 1 } });
    const need = xpToNext(0);
    const r = applySkillXp(s, "combat", need);
    assert.equal(r.from, 0);
    assert.equal(r.to, 1);
    assert.equal(r.survivor.skills.combat, 1);
    let cur = r.survivor;
    for (let i = 0; i < 20; i++) cur = applySkillXp(cur, "combat", 5000).survivor;
    assert.equal(cur.skills.combat, 10);
    assert.equal(cur.skillXp.combat, 0);
  });

  it("each combat level lists a bigger bonus", () => {
    assert.equal(skillFx("combat", 0).atk, 0);
    assert.equal(skillFx("combat", 5).atk, 40);
    assert.equal(skillFx("combat", 5).extraKill, 1);
    assert.equal(skillFx("combat", 10).extraKill, 3);
    assert.ok(skillFx("combat", 10).woundPct > skillFx("combat", 5).woundPct);
  });

  it("stealth 5 lowers the flank gate", () => {
    assert.equal(skillFx("stealth", 4).flankNeed, 6);
    assert.equal(skillFx("stealth", 5).flankNeed, 5);
  });

  it("farm 4 starts with extra crop at 4", () => {
    assert.equal(skillFx("farm", 3).extraCrop, 0);
    assert.equal(skillFx("farm", 4).extraCrop, 1);
    assert.equal(skillFx("farm", 10).extraCrop, 3);
  });
});

describe("using a job raises the matching skill", () => {
  it("overnight farm XP on a farmer", () => {
    let g = createNewGame({
      name: "Mara",
      occupation: "farmer",
      portrait: "farm",
      traits: ["gardener"],
      alloc: {},
      shelterId: "farmhouse",
    });
    g = { ...g, survivors: g.survivors.map((s) => ({ ...s, job: "farm" as const, morale: 70 })) };
    const before = g.survivors[0].skillXp.farm;
    const lv = g.survivors[0].skills.farm;
    g = restNight(g, true);
    const after = g.survivors[0];
    assert.ok(after.skillXp.farm > before || after.skills.farm > lv, "farm XP or level should rise");
  });
});

describe("compose still caps at 10", () => {
  it("alloc cannot exceed 10", () => {
    const s = composeSkills(emptySkills(), [], { combat: 12 });
    assert.equal(s.combat, 10);
  });
});
