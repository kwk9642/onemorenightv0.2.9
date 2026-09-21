/**
 * R&D: orthographic layered doll.
 * Fight look = swap texture stacks per facing (front / right / back / left),
 * not a 3D mesh and not one mannequin with gear glued on.
 *
 * v0.1 game loop does not import this file.
 */

export const FACINGS = ["front", "right", "back", "left"] as const;
export type Facing = (typeof FACINGS)[number];

export const LAYERS = ["skin", "socks", "shoes", "pants", "shirt", "hair", "weapon"] as const;
export type LayerId = (typeof LAYERS)[number];

export interface Loadout {
  shirt: "tee" | "tank" | "none";
  pants: "camo" | "jeans" | "none";
  socks: boolean;
  shoes: boolean;
  hair: boolean;
  weapon: boolean;
}

export const DEFAULT_LOADOUT: Loadout = {
  shirt: "tee",
  pants: "camo",
  socks: true,
  shoes: true,
  hair: true,
  weapon: true,
};

const Z: Record<Facing, Record<LayerId, number>> = {
  front: { skin: 1, socks: 2, shoes: 3, pants: 4, shirt: 5, hair: 6, weapon: 7 },
  right: { skin: 1, socks: 2, shoes: 3, pants: 4, shirt: 5, hair: 6, weapon: 7 },
  left: { skin: 1, socks: 2, shoes: 3, pants: 4, shirt: 5, hair: 6, weapon: 7 },
  back: { weapon: 1, skin: 2, socks: 3, shoes: 4, pants: 5, shirt: 6, hair: 7 },
};

export function turn(facing: Facing, dir: -1 | 1): Facing {
  const i = FACINGS.indexOf(facing);
  return FACINGS[(i + dir + FACINGS.length) % FACINGS.length];
}

function fileFor(layer: LayerId, facing: Facing, loadout: Loadout, swing: 0 | 1 | 2): string | null {
  const base = `/rd/doll`;
  switch (layer) {
    case "skin":
      return `${base}/skin-${facing}.png`;
    case "socks":
      return loadout.socks ? `${base}/socks-${facing}.png` : null;
    case "shoes":
      return loadout.shoes ? `${base}/shoes-${facing}.png` : null;
    case "pants":
      return loadout.pants === "none" ? null : `${base}/${loadout.pants}-${facing}.png`;
    case "shirt":
      return loadout.shirt === "none" ? null : `${base}/${loadout.shirt}-${facing}.png`;
    case "hair":
      return loadout.hair ? `${base}/hair-${facing}.png` : null;
    case "weapon":
      return loadout.weapon ? `${base}/weapon${swing}-${facing}.png` : null;
  }
}

export function stack(facing: Facing, loadout: Loadout, swing: 0 | 1 | 2) {
  return LAYERS.map((layer) => ({
    layer,
    z: Z[facing][layer],
    src: fileFor(layer, facing, loadout, swing),
  }))
    .filter((x) => x.src)
    .sort((a, b) => a.z - b.z);
}

const cache = new Map<string, HTMLImageElement>();

export function loadImg(src: string) {
  const hit = cache.get(src);
  if (hit) return hit;
  const im = new Image();
  im.src = src;
  cache.set(src, im);
  return im;
}

export function drawDoll(
  ctx: CanvasRenderingContext2D,
  facing: Facing,
  loadout: Loadout,
  swing: 0 | 1 | 2,
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#2a2a2e";
  ctx.fillRect(0, 0, width, height);
  const layers = stack(facing, loadout, swing);
  for (const L of layers) {
    const im = loadImg(L.src!);
    if (!im.complete || !im.naturalWidth) continue;
    const scale = Math.min(width / im.naturalWidth, height / im.naturalHeight);
    const dw = im.naturalWidth * scale;
    const dh = im.naturalHeight * scale;
    ctx.drawImage(im, (width - dw) / 2, (height - dh) / 2, dw, dh);
  }
}

export function preload(loadout: Loadout) {
  for (const facing of FACINGS) {
    for (const swing of [0, 1, 2] as const) {
      for (const L of stack(facing, loadout, swing)) loadImg(L.src!);
    }
  }
}
