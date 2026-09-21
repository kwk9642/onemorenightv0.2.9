/**
 * R&D animation: ordered frames in time = motion.
 * v0.1 game loop does not import this file.
 */
import { FACINGS, type Facing } from "./facingDoll";

export type ActorId = "doll" | "survivor" | "zombie";
export type ClipId = "idle" | "walk" | "swing";

export interface Clip {
  id: ClipId;
  fps: number;
  loop: boolean;
  length: number;
}

export const CLIPS: Record<ClipId, Clip> = {
  idle: { id: "idle", fps: 1, loop: true, length: 1 },
  walk: { id: "walk", fps: 8, loop: true, length: 4 },
  swing: { id: "swing", fps: 10, loop: true, length: 4 },
};

const DIR: Record<Facing, "down" | "right" | "up" | "left"> = {
  front: "down",
  right: "right",
  back: "up",
  left: "left",
};

export function clipFrame(actor: ActorId, clip: ClipId, facing: Facing, i: number): string {
  const n = Math.max(0, i);
  if (actor === "doll") {
    if (clip === "walk") return `/rd/doll/walk-${facing}-${n % 4}.png`;
    if (clip === "swing") return `/rd/doll/weapon${n % 3}-${facing}.png`;
    return `/rd/doll/walk-${facing}-1.png`;
  }
  const dir = DIR[facing];
  if (actor === "survivor" && clip === "swing") {
    return `/rd/actor/attack-${(n % 4) + 1}.png`;
  }
  const folder = actor === "zombie" ? "zombie" : "actor";
  const frame = clip === "idle" ? 1 : (n % 4) + 1;
  return `/rd/${folder}/${dir}-${frame}.png`;
}

export function clipLength(actor: ActorId, clip: ClipId) {
  if (actor === "doll" && clip === "swing") return 3;
  if (clip === "idle") return 1;
  return 4;
}

const cache = new Map<string, HTMLImageElement>();

export function loadFrame(src: string) {
  const hit = cache.get(src);
  if (hit) return hit;
  const im = new Image();
  im.src = src;
  cache.set(src, im);
  return im;
}

export function preloadClips(actor: ActorId) {
  for (const facing of FACINGS) {
    for (const clip of Object.keys(CLIPS) as ClipId[]) {
      const len = clipLength(actor, clip);
      for (let i = 0; i < len; i++) loadFrame(clipFrame(actor, clip, facing, i));
    }
  }
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  src: string,
  extras: string[] = [],
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#2a2a2e";
  ctx.fillRect(0, 0, width, height);
  const drawOne = (url: string) => {
    const im = loadFrame(url);
    if (!im.complete || !im.naturalWidth) return;
    const scale = Math.min((width * 0.88) / im.naturalWidth, (height * 0.9) / im.naturalHeight);
    const dw = im.naturalWidth * scale;
    const dh = im.naturalHeight * scale;
    ctx.drawImage(im, (width - dw) / 2, height - dh - 18, dw, dh);
  };
  drawOne(src);
  for (const extra of extras) drawOne(extra);
}

export class ClipPlayer {
  actor: ActorId = "survivor";
  clip: ClipId = "walk";
  facing: Facing = "front";
  playing = true;
  frame = 0;
  acc = 0;
  fps = 8;

  tick(dt: number) {
    if (!this.playing) return;
    const clip = CLIPS[this.clip];
    const len = clipLength(this.actor, this.clip);
    this.acc += dt;
    const step = 1 / Math.max(1, this.fps || clip.fps);
    while (this.acc >= step) {
      this.acc -= step;
      const next = this.frame + 1;
      this.frame = clip.loop ? next % len : Math.min(next, len - 1);
    }
  }

  src() {
    if (this.actor === "doll" && this.clip === "swing") {
      return `/rd/doll/walk-${this.facing}-1.png`;
    }
    return clipFrame(this.actor, this.clip, this.facing, this.frame);
  }

  extras() {
    if (this.actor !== "doll" || this.clip !== "swing") return [];
    return [clipFrame(this.actor, this.clip, this.facing, this.frame)];
  }
}
