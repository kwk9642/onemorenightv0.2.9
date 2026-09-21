import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createNewGame, discardItem, isDiscovered, missionChoice, restNight, startMission, upgradeFacility, repairWall } from "./engine.ts";
import { LOCATIONS, locById } from "./data.ts";

import { padV03, lootLeft, MAX_AP, AP_COST } from "./v03.ts";
import type { GameState } from "./types.ts";

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

function fuelUp(s: GameState): GameState {
  return { ...s, resources: { ...s.resources, fuel: 20, materials: 20 } };
}

function clearSite(s: GameState, id: string): GameState {
  const ls = s.locations[id];
  return {
    ...s,
    locations: {
      ...s.locations,
      [id]: { ...ls, zombies: 0, survivorOpen: false, cleared: true },
    },
  };
}

describe("v0.3 phase 1 — Test A farming", () => {
  it("starts the day with 6 AP and seeded finite loot", () => {
    const s = farm();
    assert.equal(s.day, 1);
    assert.equal(s.dayAP, MAX_AP);
    assert.equal(s.maxAP, MAX_AP);
    assert.ok(lootLeft(s.locations.riverside_mart.lootRemaining) > 0);
  });

  it("travel + search spend AP; extract does not sleep", () => {
    let s = fuelUp(clearSite(farm(), "riverside_mart"));
    const stock0 = lootLeft(s.locations.riverside_mart.lootRemaining);
    s = startMission(s, "riverside_mart", [s.survivors[0].id]);
    assert.equal(s.day, 1);
    assert.equal(s.dayAP, MAX_AP - AP_COST.travel);
    assert.equal(s.screen, "mission");

    const afterTravel = s.dayAP;
    s = missionChoice(s, "search_quiet");
    assert.equal(s.dayAP, afterTravel - AP_COST.search);
    assert.ok(lootLeft(s.locations.riverside_mart.lootRemaining) <= stock0);

    s = missionChoice(s, "extract");
    assert.equal(s.day, 1, "extract must not advance the day");
    assert.ok(s.screen === "shelter" || s.screen === "occupy");
    assert.ok(s.mission === null);
    assert.ok(lootLeft(s.locations.riverside_mart.lootRemaining) < stock0);
  });

  it("AP=0 blocks productive mission actions; extract still works", () => {
    let s = fuelUp(clearSite(farm(), "riverside_mart"));
    s = startMission(s, "riverside_mart", [s.survivors[0].id]);
    s = { ...s, dayAP: 0, mission: s.mission ? { ...s.mission, choices: s.mission.choices } : s.mission };
    const frozen = s.dayAP;
    const stock = lootLeft(s.locations.riverside_mart.lootRemaining);
    s = missionChoice(s, "search_loud");
    assert.equal(s.dayAP, frozen);
    assert.equal(lootLeft(s.locations.riverside_mart.lootRemaining), stock);
    s = missionChoice(s, "extract");
    assert.equal(s.day, 1);
    assert.ok(s.screen === "shelter" || s.screen === "occupy");
  });

  it("second visit the same day (after sleep) finds a poorer site", () => {
    let s = fuelUp(clearSite(farm(), "riverside_mart"));
    const stock0 = lootLeft(s.locations.riverside_mart.lootRemaining);
    s = startMission(s, "riverside_mart", [s.survivors[0].id]);
    s = missionChoice(s, "search_loud");
    s = missionChoice(s, "extract");
    const stock1 = lootLeft(s.locations.riverside_mart.lootRemaining);
    assert.ok(stock1 < stock0);

    s = restNight(s, true);
    assert.equal(s.day, 2);
    assert.equal(s.dayAP, MAX_AP);
    assert.equal(s.locations.riverside_mart.noiseToday, 0);

    s = startMission(s, "riverside_mart", [s.survivors[0].id]);
    s = missionChoice(s, "search_loud");
    const stock2 = lootLeft(s.locations.riverside_mart.lootRemaining);
    assert.ok(stock2 <= stock1);
    s = missionChoice(s, "extract");
    assert.equal(s.day, 2);
  });

  it("empty location yields nothing even if you keep searching", () => {
    let s = fuelUp(clearSite(farm(), "riverside_mart"));
    s = {
      ...s,
      locations: {
        ...s.locations,
        riverside_mart: {
          ...s.locations.riverside_mart,
          lootRemaining: { food: 0, water: 0, materials: 0, medicine: 0, ammo: 0, fuel: 0 },
        },
      },
    };
    s = startMission(s, "riverside_mart", [s.survivors[0].id]);
    s = missionChoice(s, "search_loud");
    const bagN = Object.values(s.mission!.bag).reduce((a, b) => a + b, 0);
    assert.equal(bagN, 0);
  });

  it("build costs 2 AP and repair wall costs 1 AP", () => {
    let s = fuelUp(farm());
    const ap0 = s.dayAP;
    const wall0 = s.shelter.barricade;
    s = repairWall(s);
    assert.equal(s.dayAP, ap0 - AP_COST.repairWall);
    assert.ok(s.shelter.barricade > wall0);

    const ap1 = s.dayAP;
    s = upgradeFacility(s, "workshop");
    assert.equal(s.dayAP, ap1 - AP_COST.build);
    assert.equal(s.shelter.facilities.workshop, 1);

    s = { ...s, dayAP: 1 };
    const blocked = upgradeFacility(s, "beds");
    assert.equal(blocked.dayAP, 1);
    assert.equal(blocked.shelter.facilities.beds, s.shelter.facilities.beds);
  });

  it("padV03 migrates old saves without wiping loot", () => {
    const raw = farm() as GameState & { dayAP?: number };
    const stripped = {
      ...raw,
      version: 4,
      dayAP: undefined as unknown as number,
      maxAP: undefined as unknown as number,
      locations: Object.fromEntries(
        Object.entries(raw.locations).map(([id, ls]) => [
          id,
          {
            zombies: ls.zombies,
            discovered: ls.discovered,
            cleared: ls.cleared,
            occupied: ls.occupied,
            visited: ls.visited,
            survivorOpen: ls.survivorOpen,
          },
        ]),
      ),
    } as unknown as GameState;
    const padded = padV03(stripped);
    assert.equal(padded.dayAP, MAX_AP);
    assert.equal(padded.maxAP, MAX_AP);
    assert.ok(padded.locations.riverside_mart.lootRemaining);
    assert.ok(lootLeft(padded.locations.riverside_mart.lootRemaining) > 0);
  });
});

describe("v0.3 new raid maps", () => {
  const NEW_IDS = [
    "echo_creek",
    "doe_valley",
    "irvington_scrap",
    "rosewood_prison",
    "brandenburg",
    "louisville_school",
    "valley_station",
    "lexington",
    "mammoth_cave",
    "columbus",
    "springfield_il",
    "gary",
  ];

  it("new games seed every raid site including prison cave and gary", () => {
    const s = farm();
    for (const id of NEW_IDS) {
      assert.ok(s.locations[id], `missing ${id}`);
      assert.ok(lootLeft(s.locations[id].lootRemaining) >= 0);
      assert.ok(locById(id).zones.length >= 3);
    }
    assert.equal(LOCATIONS.length, 17 + NEW_IDS.length);
  });

  it("echo creek is on the farm's doorstep; prison is not", () => {
    const s = farm();
    assert.equal(isDiscovered(s, "echo_creek"), true);
    assert.equal(isDiscovered(s, "rosewood_prison"), false);
    assert.equal(isDiscovered(s, "gary"), false);
  });

  it("neighbor links are bidirectional", () => {
    for (const loc of LOCATIONS) {
      for (const n of loc.neighbors) {
        const other = locById(n);
        assert.ok(
          other.neighbors.includes(loc.id),
          `${loc.id} -> ${n} has no return road`,
        );
      }
    }
  });

  it("old saves gain the new sites without wiping old loot", () => {
    const raw = farm();
    const stock = lootLeft(raw.locations.riverside_mart.lootRemaining);
    const stripped = {
      ...raw,
      locations: {
        riverside_mart: raw.locations.riverside_mart,
        muldraugh_farm: raw.locations.muldraugh_farm,
      },
    } as GameState;
    const padded = padV03(stripped);
    assert.equal(lootLeft(padded.locations.riverside_mart.lootRemaining), stock);
    assert.ok(padded.locations.rosewood_prison);
    assert.ok(lootLeft(padded.locations.gary.lootRemaining) > 0);
    assert.ok(padded.locations.mammoth_cave.zombies > 0);
  });
});

describe("v0.3 pressure pass — player report", () => {
  function armed(s: GameState): GameState {
    return {
      ...s,
      survivors: s.survivors.map((p, i) =>
        i === 0
          ? { ...p, skills: { ...p.skills, combat: 8, stealth: 8 }, hp: 140, maxHp: 140, morale: 80 }
          : p,
      ),
    };
  }

  function infest(s: GameState, id: string, n: number): GameState {
    const ls = s.locations[id];
    return {
      ...s,
      locations: {
        ...s.locations,
        [id]: { ...ls, zombies: n, cleared: n === 0, survivorOpen: false },
      },
    };
  }

  it("melee reduces zombies and does not spawn more", () => {
    let s = armed(fuelUp(farm()));
    s = infest(s, "riverside_mart", 6);
    s = startMission(s, "riverside_mart", [s.survivors[0].id]);
    const before = s.locations.riverside_mart.zombies;
    s = missionChoice(s, "fight");
    s = missionChoice(s, "melee");
    const after = s.locations.riverside_mart.zombies;
    assert.ok(!s.ended, "fighter should survive a 6-zed melee");
    assert.ok(after < before, `zombies ${before} -> ${after}`);
  });

  it("last two zombies can be finished instead of sticking", () => {
    let s = armed(fuelUp(farm()));
    s = infest(s, "riverside_mart", 2);
    s = startMission(s, "riverside_mart", [s.survivors[0].id]);
    s = missionChoice(s, "fight");
    s = missionChoice(s, "melee");
    if (s.locations.riverside_mart.zombies > 0 && s.mission && !s.ended) {
      s = missionChoice(s, "fight");
      s = missionChoice(s, "melee");
    }
    assert.equal(s.locations.riverside_mart.zombies, 0);
    assert.equal(s.locations.riverside_mart.cleared, true);
  });

  it("map flag is not sticky: leftover zombies are not cleared", () => {
    let s = armed(fuelUp(farm()));
    s = infest(s, "riverside_mart", 8);
    s = startMission(s, "riverside_mart", [s.survivors[0].id]);
    s = missionChoice(s, "fight");
    s = missionChoice(s, "melee");
    const left = s.locations.riverside_mart.zombies;
    if (left > 0) assert.equal(s.locations.riverside_mart.cleared, false);
  });

  it("quiet search yields less than a loud search on the same stock", () => {
    const base = fuelUp(clearSite(farm(), "riverside_mart"));
    const stock = lootLeft(base.locations.riverside_mart.lootRemaining);

    let quiet = startMission(base, "riverside_mart", [base.survivors[0].id]);
    quiet = missionChoice(quiet, "search_quiet");
    const q = Object.values(quiet.mission!.bag).reduce((a, b) => a + b, 0);

    let loud = startMission(base, "riverside_mart", [base.survivors[0].id]);
    loud = missionChoice(loud, "search_loud");
    const l = Object.values(loud.mission!.bag).reduce((a, b) => a + b, 0);

    assert.ok(stock > 0);
    assert.ok(q <= l, `quiet ${q} should be <= loud ${l}`);
  });

  it("discard removes a stash item and can salvage materials", () => {
    const s = farm();
    assert.ok((s.stash ?? []).length > 0);
    const item = s.stash[0];
    const mats0 = s.resources.materials;
    const next = discardItem(s, item.uid);
    assert.equal(next.stash.some((x) => x.uid === item.uid), false);
    if (item.cond >= 40) assert.equal(next.resources.materials, mats0 + 1);
    else assert.equal(next.resources.materials, mats0);
  });
});
