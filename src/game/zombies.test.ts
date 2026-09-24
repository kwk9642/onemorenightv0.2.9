import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createNewGame, restNight } from "./engine.ts";
import { pressFoodCost } from "./mode.ts";
import { pressureBand, rollKind } from "./zombies.ts";

describe("v0.2.2 world and still", () => {
  it("normal still level 2 costs 2 food", () => {
    assert.equal(pressFoodCost(2, "normal"), 2);
    assert.equal(pressFoodCost(1, "normal"), 3);
    assert.equal(pressFoodCost(2, "extinct"), 3);
  });

  it("day 1 does not roll a mutant", () => {
    const s = createNewGame({
      name: "Mara",
      occupation: "farmer",
      portrait: "farm",
      traits: [],
      alloc: {},
      shelterId: "farmhouse",
    });
    const early = { ...s, day: 1 };
    for (let i = 0; i < 30; i++) {
      const rolled = rollKind({ ...early, rng: i * 17 + 3 }, "chicago", false);
      assert.equal(rolled.kind, "walker");
    }
    assert.equal(pressureBand(1), 1);
    assert.equal(pressureBand(22), 5);
  });

  it("a cleared neighbor does not refill on a normal night", () => {
    let s = createNewGame({
      name: "Mara",
      occupation: "farmer",
      portrait: "farm",
      traits: [],
      alloc: {},
      shelterId: "farmhouse",
    });
    const id = "rosewood_pd";
    s = {
      ...s,
      day: 14,
      locations: {
        ...s.locations,
        [id]: { ...s.locations[id], zombies: 0, cleared: true, discovered: true },
      },
    };
    s = restNight(s, true);
    assert.equal(s.locations[id].zombies, 0);
  });
});
