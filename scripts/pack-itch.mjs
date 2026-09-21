#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const stage = join(root, "itch-public");
const outDir = join(root, "dist-itch");
const zipName = "one-more-night-v0.1.zip";
const zipPath = join(root, "public", zipName);

rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });

function copy(from, to) {
  const src = join(root, "public", from);
  if (!existsSync(src)) return;
  cpSync(src, join(stage, to), { recursive: true });
}

copy("art", "art");
copy("game", "game");
copy("favicon.svg", "favicon.svg");
copy("itch-cover.jpg", "itch-cover.jpg");
copy("og.jpg", "og.jpg");
rmSync(join(stage, "art/gear/wear"), { recursive: true, force: true });

writeFileSync(
  join(stage, "README.txt"),
  "One More Night v0.1\nUpload this ZIP as-is on itch.io (HTML). Do not unzip and re-zip.\n",
);

const build = spawnSync("npx", ["vite", "build", "--config", "vite.itch.config.ts"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});
if (build.status !== 0) process.exit(build.status ?? 1);

rmSync(join(outDir, "__grok"), { recursive: true, force: true });
rmSync(join(outDir, "rd"), { recursive: true, force: true });
rmSync(join(outDir, "shots"), { recursive: true, force: true });

const py = `
import os, zipfile
root = ${JSON.stringify(outDir)}
dest = ${JSON.stringify(zipPath)}
os.makedirs(os.path.dirname(dest), exist_ok=True)
if os.path.exists(dest):
    os.remove(dest)
skip = {"one-more-night-v0.1.zip"}
n = 0
with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in {"__grok", "rd", "shots"}]
        for name in filenames:
            if name in skip or name.endswith(".zip"):
                continue
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, root).replace("\\\\", "/")
            z.write(full, rel)
            n += 1
print(n, os.path.getsize(dest))
`;

const pack = spawnSync("python3", ["-c", py], { cwd: root, encoding: "utf8" });
process.stdout.write(pack.stdout || "");
process.stderr.write(pack.stderr || "");
if (pack.status !== 0) process.exit(pack.status ?? 1);

mkdirSync(join(root, "artifacts"), { recursive: true });
cpSync(zipPath, join(root, "artifacts", zipName));
const kb = Math.round(statSync(zipPath).size / 1024);
console.log(`packed ${zipName} (${kb} KB)`);
