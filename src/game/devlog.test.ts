import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEVLOG, itchPageText } from "./devlog.ts";

describe("devlog", () => {
  it("lists newest first so future patches prepend", () => {
    assert.equal(DEVLOG[0]?.id, "0.2.9");
    assert.equal(DEVLOG[1]?.id, "0.2.8");
    assert.equal(DEVLOG[2]?.id, "0.2.7");
    assert.equal(DEVLOG[3]?.id, "0.2.4");
    assert.equal(DEVLOG[4]?.id, "0.2.3");
    assert.equal(DEVLOG[5]?.id, "0.2.2");
    assert.equal(DEVLOG[6]?.id, "0.2.1");
    assert.equal(DEVLOG[7]?.id, "0.2");
    assert.equal(DEVLOG[8]?.id, "0.1");
    assert.ok(DEVLOG.every((e) => e.sections.length >= 3));
  });

  it("itch paste is the same four-locale document as the in-game log", () => {
    for (const loc of ["zh", "en", "ja", "ko"] as const) {
      const body = itchPageText(loc);
      assert.match(body, /v0\.2\.2/);
      assert.match(body, /v0\.2/);
      assert.match(body, /v0\.1/);
      assert.match(body, /2026-09-23/);
      assert.match(body, /2026-09-13/);
    }
    const zh = itchPageText("zh");
    assert.match(zh, /一天只有六格/);
    assert.match(zh, /技能 0 到 10/);
    assert.match(zh, /八個職業/);
    assert.match(zh, /開發日誌寫在遊戲標題/);
    assert.match(itchPageText("en"), /Six actions a day/);
  });
});
