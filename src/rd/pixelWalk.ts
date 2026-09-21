/**
 * R&D: 4-facing pixel walker on HD-2D maps.
 * 360° analog move, snap to down/right/up/left. Never add a 1-dir clip.
 * v0.1 does not import this file.
 */
import { asset } from "@/game/asset";

export const PX_DIRS = ["down", "right", "up", "left"] as const;
export type PxDir = (typeof PX_DIRS)[number];

export const GAITS = ["walk", "sneak", "run"] as const;
export type Gait = (typeof GAITS)[number];

export const GAIT_INFO: Record<Gait, { label: string; frames: number; fps: number; speed: number }> = {
  walk: { label: "走", frames: 8, fps: 10, speed: 0.18 },
  sneak: { label: "潛", frames: 8, fps: 6, speed: 0.08 },
  run: { label: "跑", frames: 8, fps: 12, speed: 0.36 },
};

export const MAPS = [
  { id: "farm", label: "莫卓農舍", src: "/rd/maps/muldraugh-farm.jpg" },
  { id: "kitchen", label: "農舍廚房", src: "/rd/maps/farm-kitchen.jpg" },
  { id: "hardware", label: "西點五金", src: "/rd/maps/westpoint-hardware.jpg" },
  { id: "roof", label: "頂樓", src: "/rd/maps/louisville-roof.jpg" },
] as const;

export function pxFrame(gait: Gait, dir: PxDir, moving: boolean, frame: number) {
  const n = moving ? (frame % GAIT_INFO[gait].frames) + 1 : 1;
  return asset(`/rd/px/${gait}/${dir}-${n}.png`);
}

export function preloadPx() {
  for (const gait of GAITS) {
    for (const dir of PX_DIRS) {
      for (let i = 1; i <= GAIT_INFO[gait].frames; i++) {
        const im = new Image();
        im.src = asset(`/rd/px/${gait}/${dir}-${i}.png`);
      }
    }
  }
  for (const m of MAPS) {
    const im = new Image();
    im.src = asset(m.src);
  }
}

/** Analog 360° input → nearest of 4 sprite facings. */
export function facingFrom(vx: number, vy: number, fallback: PxDir): PxDir {
  if (vx === 0 && vy === 0) return fallback;
  if (Math.abs(vx) > Math.abs(vy)) return vx > 0 ? "right" : "left";
  return vy > 0 ? "down" : "up";
}
