import { TILE, type FloorKind, type LayoutDef, type RoomDef } from "./layouts";

export const IW = 78;
export const IH = 39;
export const WH = 48;

export type FurnKind =
  | "crate"
  | "shelf"
  | "bed"
  | "table"
  | "sofa"
  | "fridge"
  | "counter"
  | "car"
  | "toilet"
  | "desk"
  | "locker"
  | "plant"
  | "dumpster"
  | "stove"
  | "tub"
  | "cabinet"
  | "pallet";

export interface Furn {
  kind: FurnKind;
  tx: number;
  ty: number;
}

export function worldToIso(wx: number, wy: number) {
  const gx = wx / TILE;
  const gy = wy / TILE;
  return { x: (gx - gy) * (IW / 2), y: (gx + gy) * (IH / 2) };
}

export function tileIso(tx: number, ty: number) {
  return { x: (tx - ty) * (IW / 2), y: (tx + ty) * (IH / 2) };
}

export function isoToWorld(ix: number, iy: number) {
  const gx = ix / IW + iy / IH;
  const gy = iy / IH - ix / IW;
  return { x: gx * TILE, y: gy * TILE };
}

export function screenToWorldDir(sx: number, sy: number) {
  const gx = sx + sy;
  const gy = sy - sx;
  const len = Math.hypot(gx, gy);
  if (len < 1e-6) return { x: 0, y: 0 };
  return { x: gx / len, y: gy / len };
}

export function dirToScreen(dir: 0 | 1 | 2 | 3) {
  const world = [
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
  ][dir];
  return { x: world.x - world.y, y: world.x + world.y };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function shade(hex: string, m: number) {
  const [r, g, b] = hexToRgb(hex);
  const k = (v: number) => Math.max(0, Math.min(255, Math.round(v * m)));
  return `rgb(${k(r)},${k(g)},${k(b)})`;
}

export function diamondPath(ctx: CanvasRenderingContext2D, ix: number, iy: number, w = IW, h = IH) {
  ctx.beginPath();
  ctx.moveTo(ix, iy);
  ctx.lineTo(ix + w / 2, iy + h / 2);
  ctx.lineTo(ix, iy + h);
  ctx.lineTo(ix - w / 2, iy + h / 2);
  ctx.closePath();
}

export function drawTexturedDiamond(
  ctx: CanvasRenderingContext2D,
  im: HTMLImageElement | null,
  ix: number,
  iy: number,
  fallback: string,
  w = IW,
  h = IH,
) {
  ctx.save();
  diamondPath(ctx, ix, iy, w, h);
  ctx.clip();
  if (im && im.complete && im.naturalWidth) {
    ctx.translate(ix, iy);
    ctx.transform(w / 2, h / 2, -w / 2, h / 2, 0, 0);
    ctx.drawImage(im, 0, 0, 1, 1);
  } else {
    ctx.fillStyle = fallback;
    ctx.fill();
  }
  ctx.restore();
}

function texQuad(
  ctx: CanvasRenderingContext2D,
  im: HTMLImageElement | null,
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
  color: string,
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineTo(c[0], c[1]);
  ctx.lineTo(d[0], d[1]);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (im && im.complete && im.naturalWidth) {
    ctx.clip();
    ctx.translate(a[0], a[1]);
    ctx.transform(b[0] - a[0], b[1] - a[1], d[0] - a[0], d[1] - a[1], 0, 0);
    ctx.globalAlpha = 0.82;
    ctx.drawImage(im, 0, 0, 1, 1);
  }
  ctx.restore();
}

export function drawIsoBox(
  ctx: CanvasRenderingContext2D,
  ix: number,
  iy: number,
  zh: number,
  left: string,
  right: string,
  top: string,
  w = IW * 0.78,
  d = IH * 0.78,
  texLeft?: HTMLImageElement | null,
  texRight?: HTMLImageElement | null,
) {
  const ox = (IW - w) / 2;
  const oy = (IH - d) / 2;
  const T: [number, number] = [ix, iy + oy - zh];
  const R: [number, number] = [ix + w / 2, iy + oy + d / 2 - zh];
  const B: [number, number] = [ix, iy + oy + d - zh];
  const L: [number, number] = [ix - w / 2, iy + oy + d / 2 - zh];
  const Lg: [number, number] = [L[0], L[1] + zh];
  const Bg: [number, number] = [B[0], B[1] + zh];
  const Rg: [number, number] = [R[0], R[1] + zh];
  texQuad(ctx, texLeft ?? null, L, B, Bg, Lg, left);
  texQuad(ctx, texRight ?? null, R, B, Bg, Rg, right);
  ctx.beginPath();
  ctx.moveTo(T[0], T[1]);
  ctx.lineTo(R[0], R[1]);
  ctx.lineTo(B[0], B[1]);
  ctx.lineTo(L[0], L[1]);
  ctx.closePath();
  ctx.fillStyle = top;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

const FLOOR_FALLBACK: Record<FloorKind, string> = {
  wood: "#6a5340",
  carpet: "#5a3a38",
  linoleum: "#7a7268",
  concrete: "#6a6660",
  bath: "#5a6a70",
  grass: "#4a5a38",
};

export function wallPalette(floor: FloorKind, outer: boolean) {
  if (outer) return { left: "#6a4038", right: "#4a2c28", top: "#8a5a4a", kind: "brick" as const };
  if (floor === "concrete") return { left: "#6a6864", right: "#4e4c48", top: "#8a8882", kind: "metal" as const };
  if (floor === "wood") return { left: "#6a5040", right: "#4a382c", top: "#8a6a52", kind: "wood" as const };
  if (floor === "bath") return { left: "#8a9296", right: "#6a7276", top: "#c4ccd0", kind: "drywall" as const };
  if (floor === "grass") return { left: "#5a4a32", right: "#3e3424", top: "#7a6a48", kind: "wood" as const };
  return { left: "#b8aa96", right: "#8a7e6c", top: "#d4c8b4", kind: "drywall" as const };
}

export function drawFloorTile(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  floor: FloorKind,
  im: HTMLImageElement | null,
  dim = false,
) {
  const p = tileIso(tx, ty);
  drawTexturedDiamond(ctx, im, p.x, p.y, FLOOR_FALLBACK[floor]);
  ctx.save();
  diamondPath(ctx, p.x, p.y);
  ctx.strokeStyle = "rgba(0,0,0,0.16)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  if (dim) {
    ctx.fillStyle = "rgba(8,6,4,0.45)";
    ctx.fill();
  }
  ctx.restore();
}

export function drawGroundGrass(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  im: HTMLImageElement | null,
) {
  const p = tileIso(tx, ty);
  drawTexturedDiamond(ctx, im, p.x, p.y, "#3a4a2c");
}

export function drawWallBlock(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  pal: ReturnType<typeof wallPalette>,
  brick: HTMLImageElement | null,
  dry: HTMLImageElement | null,
  alpha = 1,
  faces: { se: boolean; sw: boolean } = { se: true, sw: true },
) {
  const p = tileIso(tx, ty);
  ctx.save();
  ctx.globalAlpha = alpha;
  const tex = pal.kind === "brick" ? brick : pal.kind === "drywall" ? dry : null;
  const zh = WH;
  const ix = p.x;
  const iy = p.y;
  const w = IW;
  const h = IH;
  const T: [number, number] = [ix, iy - zh];
  const R: [number, number] = [ix + w / 2, iy + h / 2 - zh];
  const B: [number, number] = [ix, iy + h - zh];
  const L: [number, number] = [ix - w / 2, iy + h / 2 - zh];
  const Lg: [number, number] = [L[0], L[1] + zh];
  const Bg: [number, number] = [B[0], B[1] + zh];
  const Rg: [number, number] = [R[0], R[1] + zh];
  if (faces.sw) texQuad(ctx, tex, L, B, Bg, Lg, pal.left);
  if (faces.se) texQuad(ctx, tex, R, B, Bg, Rg, pal.right);
  // thin cap so walls don't read as a cube pyramid
  ctx.beginPath();
  ctx.moveTo(T[0], T[1]);
  ctx.lineTo(R[0], R[1]);
  ctx.lineTo(B[0], B[1]);
  ctx.lineTo(L[0], L[1]);
  ctx.closePath();
  ctx.fillStyle = shade(pal.top, 0.72);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.restore();
}

export function drawDoorway(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  pal: ReturnType<typeof wallPalette>,
  glow: boolean,
) {
  const p = tileIso(tx, ty);
  const zh = WH * 0.92;
  const post = 8;
  ctx.save();
  // posts as thin boxes on left/right of diamond
  drawIsoBox(ctx, p.x - IW * 0.28, p.y + 2, zh, shade(pal.left, 0.7), shade(pal.right, 0.7), shade(pal.top, 0.75), 14, 18);
  drawIsoBox(ctx, p.x + IW * 0.28, p.y + 2, zh, shade(pal.left, 0.7), shade(pal.right, 0.7), shade(pal.top, 0.75), 14, 18);
  // lintel
  drawIsoBox(ctx, p.x, p.y - 2, 10, "#5a4030", "#3a2a20", "#7a5a44", IW * 0.72, IH * 0.4);
  if (glow) {
    ctx.fillStyle = "rgba(232,200,120,0.28)";
    diamondPath(ctx, p.x, p.y + 4, IW * 0.7, IH * 0.7);
    ctx.fill();
  }
  ctx.restore();
}

export function drawRoofTile(ctx: CanvasRenderingContext2D, tx: number, ty: number, dark: boolean) {
  const p = tileIso(tx, ty);
  const y = p.y - WH;
  ctx.save();
  diamondPath(ctx, p.x, y);
  ctx.fillStyle = dark ? "#2a221c" : "#4a3a30";
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.stroke();
  // ridge hint
  ctx.beginPath();
  ctx.moveTo(p.x, y);
  ctx.lineTo(p.x, y + IH);
  ctx.strokeStyle = "rgba(90,70,50,0.4)";
  ctx.stroke();
  ctx.restore();
}

const CATALOG: Record<string, FurnKind[]> = {
  客廳: ["sofa", "table", "plant", "cabinet"],
  廚房: ["fridge", "counter", "stove", "table"],
  臥室: ["bed", "cabinet", "desk"],
  浴室: ["toilet", "tub", "cabinet"],
  走廊: ["plant", "cabinet"],
  儲藏: ["shelf", "crate", "crate"],
  車庫: ["car", "crate", "shelf"],
  後院: ["dumpster", "plant", "crate"],
  店面: ["counter", "shelf", "crate", "cabinet"],
  倉庫: ["shelf", "shelf", "crate", "pallet", "crate"],
  後巷: ["dumpster", "crate", "pallet"],
  辦公室: ["desk", "cabinet", "plant"],
  廁所: ["toilet", "cabinet"],
  卸貨: ["pallet", "crate", "crate", "shelf"],
  工具間: ["shelf", "counter", "crate"],
  停車場: ["car", "car", "dumpster"],
  大廳: ["sofa", "plant", "desk"],
  病房: ["bed", "bed", "cabinet"],
  藥局: ["shelf", "counter", "cabinet"],
  手術室: ["table", "cabinet", "locker"],
  停屍間: ["table", "locker", "cabinet"],
  樓梯: ["crate"],
  屋頂口: ["crate", "pallet"],
  街道: ["car", "dumpster", "plant"],
  便利店: ["shelf", "counter", "crate"],
  公寓廳: ["sofa", "plant", "cabinet"],
  藥房: ["shelf", "counter", "cabinet"],
  巷弄: ["dumpster", "crate"],
  地下室: ["shelf", "crate", "pallet"],
  電台: ["desk", "cabinet", "locker"],
};

function hash(a: number, b: number, c: number) {
  let x = (a * 374761393 + b * 668265263 + c * 1274126177) | 0;
  x = (x ^ (x >>> 13)) * 1274126177;
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

export function placeFurniture(
  layout: LayoutDef,
  tiles: Uint8Array,
  isDoor: (x: number, y: number) => boolean,
): Furn[] {
  const out: Furn[] = [];
  const idx = (x: number, y: number) => y * layout.tw + x;
  const nearDoor = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (isDoor(x + dx, y + dy)) return true;
      }
    }
    return false;
  };
  for (const r of layout.rooms) {
    const kinds = CATALOG[r.name] ?? ["crate"];
    const spots: { x: number; y: number }[] = [
      { x: r.x + 2, y: r.y + 2 },
      { x: r.x + r.w - 3, y: r.y + 2 },
      { x: r.x + 2, y: r.y + r.h - 3 },
      { x: r.x + r.w - 3, y: r.y + r.h - 3 },
      { x: r.x + 2, y: r.y + Math.floor(r.h / 2) },
      { x: r.x + r.w - 3, y: r.y + Math.floor(r.h / 2) },
    ];
    let k = 0;
    for (const s of spots) {
      if (k >= kinds.length) break;
      if (s.x <= r.x || s.y <= r.y || s.x >= r.x + r.w - 1 || s.y >= r.y + r.h - 1) continue;
      if (nearDoor(s.x, s.y)) continue;
      if (tiles[idx(s.x, s.y)] !== 0) continue;
      tiles[idx(s.x, s.y)] = 3;
      out.push({ kind: kinds[k], tx: s.x, ty: s.y });
      k++;
    }
  }
  return out;
}

export function drawFurn(
  ctx: CanvasRenderingContext2D,
  f: Furn,
  crate: HTMLImageElement | null,
  shelf: HTMLImageElement | null,
) {
  const p = tileIso(f.tx, f.ty);
  const cx = p.x;
  const cy = p.y + IH * 0.15;
  if (f.kind === "crate" && crate && crate.complete && crate.naturalWidth) {
    ctx.drawImage(crate, cx - 28, cy - 40, 56, 52);
    return;
  }
  if (f.kind === "shelf" && shelf && shelf.complete && shelf.naturalWidth) {
    ctx.drawImage(shelf, cx - 30, cy - 70, 60, 78);
    return;
  }
  switch (f.kind) {
    case "bed":
      drawIsoBox(ctx, cx, cy, 16, "#5a3a38", "#3e2826", "#c4b8a8", IW * 0.9, IH * 0.7);
      drawIsoBox(ctx, cx - 8, cy - 6, 8, "#d4c8b4", "#b8aa96", "#efe6d8", 22, 16);
      break;
    case "table":
      drawIsoBox(ctx, cx, cy, 18, "#4a382c", "#32241c", "#8a6a4a", IW * 0.7, IH * 0.55);
      break;
    case "sofa":
      drawIsoBox(ctx, cx, cy, 20, "#3a4a48", "#2a3634", "#5a6a62", IW * 0.85, IH * 0.55);
      break;
    case "fridge":
      drawIsoBox(ctx, cx, cy, 44, "#8a9296", "#6a7276", "#c4ccd0", IW * 0.45, IH * 0.5);
      break;
    case "counter":
      drawIsoBox(ctx, cx, cy, 22, "#5a5048", "#3e3832", "#8a8074", IW * 0.8, IH * 0.45);
      break;
    case "car":
      drawIsoBox(ctx, cx, cy, 18, "#4a3a32", "#2e2420", "#6a5044", IW * 1.15, IH * 0.7);
      ctx.fillStyle = "rgba(140,180,190,0.45)";
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 8);
      ctx.lineTo(cx + 18, cy - 2);
      ctx.lineTo(cx + 8, cy + 6);
      ctx.lineTo(cx - 18, cy);
      ctx.closePath();
      ctx.fill();
      break;
    case "toilet":
      drawIsoBox(ctx, cx, cy, 14, "#c4ccd0", "#9aa2a6", "#e8eef0", 22, 18);
      break;
    case "desk":
      drawIsoBox(ctx, cx, cy, 20, "#4a382c", "#32241c", "#6a5040", IW * 0.7, IH * 0.5);
      drawIsoBox(ctx, cx, cy - 8, 8, "#2a2420", "#1c1814", "#3a342c", 18, 14);
      break;
    case "locker":
      drawIsoBox(ctx, cx, cy, 42, "#5a6468", "#3e4648", "#7a8488", IW * 0.4, IH * 0.45);
      break;
    case "plant":
      drawIsoBox(ctx, cx, cy + 6, 10, "#6a4a32", "#4a3224", "#8a6a48", 16, 14);
      ctx.fillStyle = "#3a5a32";
      ctx.beginPath();
      ctx.ellipse(cx, cy - 8, 12, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "dumpster":
      drawIsoBox(ctx, cx, cy, 24, "#3a5a3a", "#2a3e2a", "#4a6a42", IW * 0.75, IH * 0.6);
      break;
    case "stove":
      drawIsoBox(ctx, cx, cy, 22, "#3a3a3c", "#2a2a2c", "#5a5a5c", IW * 0.55, IH * 0.5);
      break;
    case "tub":
      drawIsoBox(ctx, cx, cy, 12, "#b8c0c4", "#8a9296", "#dce4e8", IW * 0.85, IH * 0.55);
      break;
    case "cabinet":
      drawIsoBox(ctx, cx, cy, 32, "#5a4030", "#3e2c20", "#7a5a40", IW * 0.5, IH * 0.45);
      break;
    case "pallet":
      drawIsoBox(ctx, cx, cy, 8, "#6a5a40", "#4a3e2c", "#8a7a58", IW * 0.8, IH * 0.6);
      drawIsoBox(ctx, cx, cy - 8, 14, "#6a4e32", "#4a3624", "#8a6a42", IW * 0.5, IH * 0.4);
      break;
    default:
      drawIsoBox(ctx, cx, cy, 16, "#6a4e32", "#4a3624", "#8a6a42", IW * 0.55, IH * 0.5);
  }
}

export function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#1c1816");
  g.addColorStop(0.45, "#3a2a22");
  g.addColorStop(0.72, "#6a4a32");
  g.addColorStop(1, "#2a2218");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(232,210,160,0.55)";
  ctx.beginPath();
  ctx.arc(w * 0.78, h * 0.16, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(232,210,160,0.08)";
  ctx.beginPath();
  ctx.arc(w * 0.78, h * 0.16, 48, 0, Math.PI * 2);
  ctx.fill();
}

export function drawShadow(ctx: CanvasRenderingContext2D, ix: number, iy: number, rx = 16, ry = 8) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(ix, iy + 6, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawWindowGlow(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  dir: "e" | "s",
) {
  const p = tileIso(tx, ty);
  ctx.save();
  ctx.fillStyle = "rgba(232,190,90,0.22)";
  if (dir === "e") {
    ctx.beginPath();
    ctx.moveTo(p.x + IW * 0.15, p.y + IH * 0.2 - WH * 0.55);
    ctx.lineTo(p.x + IW * 0.42, p.y + IH * 0.42 - WH * 0.55);
    ctx.lineTo(p.x + IW * 0.42, p.y + IH * 0.42 - WH * 0.2);
    ctx.lineTo(p.x + IW * 0.15, p.y + IH * 0.2 - WH * 0.2);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(p.x - IW * 0.15, p.y + IH * 0.2 - WH * 0.55);
    ctx.lineTo(p.x, p.y + IH * 0.45 - WH * 0.55);
    ctx.lineTo(p.x, p.y + IH * 0.45 - WH * 0.2);
    ctx.lineTo(p.x - IW * 0.15, p.y + IH * 0.2 - WH * 0.2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function clutterOnTile(ctx: CanvasRenderingContext2D, tx: number, ty: number, seed: number) {
  const h = hash(tx, ty, seed);
  if (h > 0.18) return;
  const p = tileIso(tx, ty);
  ctx.save();
  ctx.fillStyle = h > 0.1 ? "rgba(40,20,16,0.28)" : "rgba(90,70,40,0.22)";
  ctx.beginPath();
  ctx.ellipse(p.x + (h - 0.09) * 40, p.y + IH * 0.55, 6 + h * 10, 3 + h * 4, h * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function isOuterWall(layout: LayoutDef, tx: number, ty: number) {
  const n = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const [dx, dy] of n) {
    const x = tx + dx;
    const y = ty + dy;
    if (x < 0 || y < 0 || x >= layout.tw || y >= layout.th) return true;
    let inside = false;
    for (const r of layout.rooms) {
      if (x > r.x && x < r.x + r.w - 1 && y > r.y && y < r.y + r.h - 1) {
        inside = true;
        break;
      }
    }
    if (!inside) return true;
  }
  return false;
}

export { hash };
