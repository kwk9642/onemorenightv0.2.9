import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createNewGame, restNight, canTravel, startMission } from "./engine.ts";
import { fuelCost, pressFoodCost, waterBill } from "./mode.ts";
import { padV03 } from "./v03.ts";
import type { GameState } from "./types.ts";

function farm(mode?: GameState["mode"]): GameState {
  return createNewGame({
    name: "Mara",
    occupation: "farmer",
    portrait: "farm",
    traits: [],
    alloc: {},
    shelterId: "farmhouse",
    mode,
  });
}

describe("v0.2.1 water, fuel, still, modes", () => {
  it("three people and cistern 3 net zero", () => {
    const bill = waterBill([{ traits: [] }, { traits: [] }, { traits: [] }], 3, 5, "normal");
    assert.equal(bill.drink, 3);
    assert.equal(bill.yield, 3);
  });

  it("a fourth person owes one, and day 16 does not tax a cistern", () => {
    const four = waterBill([{ traits: [] }, { traits: [] }, { traits: [] }, { traits: [] }], 3, 5, "normal");
    assert.equal(four.drink - four.yield, 1);
    const late = waterBill([{ traits: [] }, { traits: [] }, { traits: [] }], 3, 20, "normal");
    assert.equal(late.drink, 3);
    const dry = waterBill([{ traits: [] }], 0, 20, "normal");
    assert.equal(dry.drink, 2);
  });

  it("high thirst counts as two", () => {
    const bill = waterBill([{ traits: ["highthirst"] }, { traits: [] }, { traits: [] }], 3, 3, "normal");
    assert.equal(bill.drink - bill.yield, 1);
  });

  it("neighbors of the farm cost no fuel; a far pin still does", () => {
    const s = farm();
    assert.equal(fuelCost(s, "rosewood_pd"), 0);
    assert.equal(canTravel({ ...s, resources: { ...s.resources, fuel: 0 }, dayAP: 6 }, "rosewood_pd").ok, true);
    const before = s.resources.fuel;
    const went = startMission(s, "rosewood_pd", [s.survivors[0].id]);
    assert.equal(went.resources.fuel, before);
    assert.ok(fuelCost(s, "chicago") > 0);
  });

  it("presses one fuel from spare food and refuses a short stack", () => {
    let s = farm();
    s = {
      ...s,
      resources: { ...s.resources, food: 6 },
      shelter: { ...s.shelter, facilities: { ...s.shelter.facilities, still: 1 } },
      survivors: s.survivors.map((p) => ({ ...p, job: "press" as const })),
    };
    const food0 = s.resources.food;
    s = restNight(s, true);
    assert.equal(pressFoodCost(1, "normal"), 3);
    assert.equal(s.resources.fuel, farm().resources.fuel + 1);
    assert.ok(s.resources.food < food0);
    let short = farm();
    short = {
      ...short,
      resources: { ...short.resources, food: 2 },
      shelter: { ...short.shelter, facilities: { ...short.shelter.facilities, still: 1 } },
      survivors: short.survivors.map((p) => ({ ...p, job: "press" as const })),
    };
    const fuel = short.resources.fuel;
    short = restNight(short, true);
    assert.equal(short.resources.fuel, fuel);
    assert.ok(short.log.some((e) => e.text.includes("不夠") || e.text.includes("Not enough")));
  });

  it("old saves load as normal", () => {
    const s = farm();
    const legacy = { ...s, mode: undefined, stillCooldown: undefined } as unknown as GameState;
    const padded = padV03(legacy);
    assert.equal(padded.mode, "normal");
    assert.equal(padded.stillCooldown, 0);
    assert.equal(padded.shelter.facilities.still, 0);
  });

  it("casual starts with extra food and water", () => {
    const n = farm("normal");
    const c = farm("casual");
    assert.ok(c.resources.food >= n.resources.food + 4);
    assert.ok(c.resources.water >= n.resources.water + 4);
    assert.ok(c.resources.fuel >= n.resources.fuel + 2);
  });
});
