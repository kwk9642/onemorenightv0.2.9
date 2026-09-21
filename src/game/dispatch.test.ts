import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createNewGame, restNight, startMission } from "./engine.ts";
import {
  canStartDispatch,
  focusOf,
  isAway,
  startDispatch,
} from "./dispatch.ts";
import { padV03 } from "./v03.ts";
import type { GameState, OccupationId, Survivor } from "./types.ts";

function farm(): GameState {
  return createNewGame({
    name: "Mara",
    occupation: "farmer",
    portrait: "farm",
    traits: ["gardener", "slowlearner"],
    alloc: {},
    shelterId: "farmhouse",
  });
}

function buddy(s: GameState, occ: OccupationId, name: string, skills?: Partial<Survivor["skills"]>): GameState {
  const src = s.survivors[0];
  const extra: Survivor = {
    ...src,
    id: `buddy-${occ}`,
    name,
    occupation: occ,
    stance: "friend",
    job: "rest",
    skills: { ...src.skills, ...(skills ?? {}) },
    skillBase: { ...src.skillBase, ...(skills ?? {}) },
    hp: 90,
    maxHp: 90,
    morale: 70,
    fatigue: 10,
  };
  return {
    ...s,
    survivors: [...s.survivors, extra],
    shelter: { ...s.shelter, capacity: Math.max(s.shelter.capacity, 3) },
  };
}

describe("dispatch — send spare hands", () => {
  it("solo cannot leave the house", () => {
    const s = farm();
    const check = canStartDispatch(s, [s.survivors[0].id]);
    assert.equal(check.ok, false);
  });

  it("must leave one person home", () => {
    let s = buddy(farm(), "doctor", "Jun");
    const ids = s.survivors.map((p) => p.id);
    const check = canStartDispatch(s, ids);
    assert.equal(check.ok, false);
  });

  it("farmer auto-focuses forage, doctor herbs, burglar supplies", () => {
    const s = buddy(buddy(buddy(farm(), "doctor", "Jun", { medical: 8, farm: 1, scavenge: 1 }), "burglar", "Ned", { scavenge: 8, medical: 0, farm: 0 }), "farmer", "Ivy", { farm: 7, medical: 1, scavenge: 1 });
    const jun = s.survivors.find((p) => p.name === "Jun")!;
    const ned = s.survivors.find((p) => p.name === "Ned")!;
    const ivy = s.survivors.find((p) => p.name === "Ivy")!;
    assert.equal(focusOf(jun, "auto"), "herbs");
    assert.equal(focusOf(ned, "auto"), "supplies");
    assert.equal(focusOf(ivy, "auto"), "forage");
    assert.equal(focusOf(jun, "supplies"), "supplies");
  });

  it("sending costs 1 AP and packed rations, marks them away", () => {
    let s = buddy(farm(), "doctor", "Jun", { medical: 7 });
    s = { ...s, resources: { ...s.resources, food: 6, water: 6 } };
    const ap0 = s.dayAP;
    const food0 = s.resources.food;
    const jun = s.survivors.find((p) => p.name === "Jun")!;
    s = startDispatch(s, [jun.id], "herbs");
    assert.equal(s.dayAP, ap0 - 1);
    assert.equal(s.resources.food, food0 - 1);
    assert.equal(s.resources.water, 5);
    assert.equal(s.dispatches.length, 1);
    assert.equal(isAway(s, jun.id), true);
    assert.equal(isAway(s, s.survivors[0].id), false);
  });

  it("overnight brings them back; away people skip garden work", () => {
    let s = buddy(farm(), "doctor", "Jun", { medical: 8, farm: 0 });
    s = {
      ...s,
      resources: { ...s.resources, food: 8, water: 8, medicine: 0 },
      shelter: { ...s.shelter, facilities: { ...s.shelter.facilities, garden: 3 } },
      survivors: s.survivors.map((p) =>
        p.name === "Jun" ? { ...p, job: "farm" as const, skills: { ...p.skills, farm: 8, medical: 0 } } : { ...p, job: "rest" as const },
      ),
    };
    const jun = s.survivors.find((p) => p.name === "Jun")!;
    s = startDispatch(s, [jun.id], "herbs");
    s = restNight(s, true);
    assert.equal(s.dispatches.filter((p) => p.memberIds.includes(jun.id) && !p.delayed).length, 0);
    const stillOut = (s.dispatches ?? []).some((p) => p.memberIds.includes(jun.id));
    if (!stillOut) {
      assert.equal(isAway(s, jun.id), false);
    }
    const harvested = s.log.some((e) => e.text.includes("產出食物") || e.text.includes("made food"));
    assert.equal(harvested, false, "away farmer must not work the garden");
  });

  it("away people cannot join a raid squad", () => {
    let s = buddy(farm(), "doctor", "Jun", { medical: 6 });
    s = { ...s, resources: { ...s.resources, food: 6, water: 6, fuel: 8 } };
    const jun = s.survivors.find((p) => p.name === "Jun")!;
    s = startDispatch(s, [jun.id], "auto");
    const before = s.dayAP;
    s = startMission(s, "riverside_mart", [jun.id]);
    assert.ok(s.screen !== "mission" || !s.mission?.squadIds.includes(jun.id));
    assert.ok(s.dayAP === before || s.screen === "mission");
    if (s.screen === "mission") {
      assert.ok(!s.mission?.squadIds.includes(jun.id));
    }
  });

  it("a doctor on herbs usually brings medicine home across runs", () => {
    let hits = 0;
    for (let i = 0; i < 16; i++) {
      let s = buddy(farm(), "doctor", "Jun", { medical: 9, farm: 2, scavenge: 0 });
      s = { ...s, rng: (i + 1) * 9973 + 13, resources: { ...s.resources, food: 8, water: 8, medicine: 0 } };
      const jun = s.survivors.find((p) => p.name === "Jun")!;
      s = startDispatch(s, [jun.id], "herbs");
      s = restNight(s, true);
      if ((s.dispatches ?? []).length) s = restNight(s, true);
      if (s.resources.medicine > 0) hits += 1;
    }
    assert.ok(hits >= 4, `doctor herbs should often return medicine, got ${hits}/16`);
  });

  it("old saves gain an empty dispatch list", () => {
    const raw = farm();
    const stripped = { ...raw } as GameState;
    delete (stripped as { dispatches?: unknown }).dispatches;
    const padded = padV03(stripped);
    assert.ok(Array.isArray(padded.dispatches));
    assert.equal(padded.dispatches.length, 0);
  });
});
