/**
 * R&D: unarmed PZ-style 4-dir shove / knockdown / stomp.
 * 360° analog; shove/stomp/bite/stagger must exist for down/right/up/left.
 * v0.1 does not import this file.
 */
import { asset } from "@/game/asset";
import { type PxDir } from "./pixelWalk";

export const DIRS: PxDir[] = ["down", "right", "up", "left"];

export const DIR_VEC: Record<PxDir, { x: number; y: number }> = {
  down: { x: 0, y: 1 },
  up: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const CLIPS = {
  heroShove: { who: "hero", act: "shove", n: 6, fps: 12 },
  heroStomp: { who: "hero", act: "stomp", n: 6, fps: 11 },
  zedWalk: { who: "zed", act: "walk", n: 8, fps: 6 },
  zedShove: { who: "zed", act: "shove", n: 6, fps: 9 },
  zedBite: { who: "zed", act: "bite", n: 6, fps: 10 },
  zedStagger: { who: "zed", act: "stagger", n: 6, fps: 10 },
  zedDown: { who: "zed", act: "down", n: 6, fps: 8 },
} as const;

export type ClipId = keyof typeof CLIPS;

export function fightFrame(id: ClipId, dir: PxDir, i: number) {
  const c = CLIPS[id];
  const n = Math.max(1, Math.min(c.n, (i % c.n) + 1));
  return asset(`/rd/px/${c.who}/${c.act}/${dir}-${n}.png`);
}

export function heroIdle(dir: PxDir) {
  return asset(`/rd/px/walk/${dir}-1.png`);
}

export function heroWalk(dir: PxDir, i: number) {
  return asset(`/rd/px/walk/${dir}-${(i % 8) + 1}.png`);
}

export function preloadFight() {
  (Object.keys(CLIPS) as ClipId[]).forEach((id) => {
    const c = CLIPS[id];
    for (const d of DIRS) {
      for (let i = 1; i <= c.n; i++) {
        const im = new Image();
        im.src = asset(`/rd/px/${c.who}/${c.act}/${d}-${i}.png`);
      }
    }
  });
  for (const d of DIRS) {
    for (let i = 1; i <= 8; i++) {
      const im = new Image();
      im.src = asset(`/rd/px/walk/${d}-${i}.png`);
    }
  }
  const map = new Image();
  map.src = asset("/rd/maps/muldraugh-farm.jpg");
}

export const KNOCKDOWN_CHANCE = 0.42;
export const STOMPS_TO_KILL = 2;
export const PLAYER_HP = 3;
