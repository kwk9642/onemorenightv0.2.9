#!/usr/bin/env node
/**
 * Writes public/itch-page.md from DEVLOG. Same source as the in-game sheet.
 */
import { spawnSync } from "node:child_process";

const r = spawnSync(
  process.execPath,
  [
    "--experimental-strip-types",
    "--input-type=module",
    "--no-warnings",
    "-e",
    `
import { writeFileSync } from "node:fs";
import { itchPageText } from "./src/game/devlog.ts";
const body = [
  "# One More Night — itch Description",
  "",
  "Paste the block for your language into the itch.io project Description.",
  "The in-game Dev log is this file. Future public updates: add an entry at the top of src/game/devlog.ts, rebuild, paste again. Do not write a second changelog on itch.",
  "",
  "## 中文",
  "",
  itchPageText("zh").trim(),
  "",
  "## English",
  "",
  itchPageText("en").trim(),
  "",
  "## 日本語",
  "",
  itchPageText("ja").trim(),
  "",
  "## 한국어",
  "",
  itchPageText("ko").trim(),
  "",
].join("\\n");
writeFileSync("public/itch-page.md", body);
console.log("wrote public/itch-page.md", body.length);
`,
  ],
  { encoding: "utf8" },
);
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status ?? 1);
