import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createNewGame, doseHerb, restNight } from "./engine.ts";
import { herbCount, knowsOnSight, potency } from "./herbs.ts";

const input = {
  name: "Lin",
  occupation: "doctor" as const,
  portrait: "doc",
  traits: [] as [],
  alloc: {},
  shelterId: "farmhouse",
  mode: "normal" as const,
};

describe("v0.2.3 herbs", () => {
  it("scales potency with medical and never treats the bite flag", () => {
    assert.equal(potency(1), 0.6);
    assert.equal(potency(4), 1.0);
    assert.equal(potency(6), 1.2);
    assert.equal(potency(9), 1.4);
    const picker = { skills: { farm: 10, medical: 0, scavenge: 0 } } as never;
    assert.equal(herbCount(picker), 3);
    assert.equal(knowsOnSight(picker), true);
    const blind = { skills: { farm: 0, medical: 0, scavenge: 10 } } as never;
    assert.equal(knowsOnSight(blind), false);
    assert.equal(herbCount(blind), 3);
  });

  it("late scenario starts hurt on night 8 without the bite", () => {
    const s = createNewGame({ ...input, scenario: "late" });
    assert.equal(s.day, 8);
    assert.equal(s.scenario, "late");
    assert.equal(s.survivors[0].infected, false);
    assert.ok(s.survivors[0].ailments?.some((a) => a.id === "wound"));
    assert.ok(s.survivors[0].ailments?.some((a) => a.id === "fever"));
    assert.ok(s.shelter.barricade <= 24);
  });

  it("an untreated wound turns, and a named poultice can close it", () => {
    let s = createNewGame(input);
    s = {
      ...s,
      herbs: [{ id: "plantain", qty: 1, known: true }],
      survivors: s.survivors.map((p, i) =>
        i === 0 ? { ...p, ailments: [{ id: "wound" as const, since: s.day }] } : p,
      ),
    };
    const closed = doseHerb(s, s.survivors[0].id, 0, "poultice");
    assert.equal(closed.herbs?.length ?? 0, 0);
    let open = createNewGame(input);
    open = {
      ...open,
      day: 2,
      survivors: open.survivors.map((p, i) =>
        i === 0 ? { ...p, ailments: [{ id: "wound" as const, since: 1 }] } : p,
      ),
    };
    const night = restNight(open, true);
    const lead = night.survivors[0];
    assert.ok(lead.ailments?.some((a) => a.id === "sepsis"));
  });
});
