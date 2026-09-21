import type { LayoutId } from "./types";

export const TILE = 40;

export type FloorKind = "wood" | "carpet" | "linoleum" | "concrete" | "bath" | "grass";

export interface RoomDef {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  floor: FloorKind;
}

export interface LayoutDef {
  tw: number;
  th: number;
  rooms: RoomDef[];
  doors: { x: number; y: number }[];
  entry: { x: number; y: number };
}

/** Adjacent rooms share a 1-tile wall. Doors sit on that shared wall. */
export function doorsBetween(rooms: RoomDef[]): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  const add = (x: number, y: number) => {
    if (!out.some((d) => d.x === x && d.y === y)) out.push({ x, y });
  };
  const vert = (left: RoomDef, right: RoomDef) => {
    if (left.x + left.w - 1 !== right.x) return;
    const y0 = Math.max(left.y, right.y) + 1;
    const y1 = Math.min(left.y + left.h, right.y + right.h) - 2;
    if (y1 < y0) return;
    const mid = Math.floor((y0 + y1) / 2);
    add(right.x, mid);
    if (mid + 1 <= y1) add(right.x, mid + 1);
    if (mid - 1 >= y0) add(right.x, mid - 1);
  };
  const horz = (top: RoomDef, bot: RoomDef) => {
    if (top.y + top.h - 1 !== bot.y) return;
    const x0 = Math.max(top.x, bot.x) + 1;
    const x1 = Math.min(top.x + top.w, bot.x + bot.w) - 2;
    if (x1 < x0) return;
    const mid = Math.floor((x0 + x1) / 2);
    add(mid, bot.y);
    if (mid + 1 <= x1) add(mid + 1, bot.y);
    if (mid - 1 >= x0) add(mid - 1, bot.y);
  };
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      vert(rooms[i], rooms[j]);
      vert(rooms[j], rooms[i]);
      horz(rooms[i], rooms[j]);
      horz(rooms[j], rooms[i]);
    }
  }
  return out;
}

function pack(tw: number, th: number, rooms: RoomDef[], entry: { x: number; y: number }): LayoutDef {
  return { tw, th, rooms, doors: doorsBetween(rooms), entry };
}

const HOUSE = pack(
  38,
  30,
  [
    { name: "客廳", x: 1, y: 1, w: 13, h: 11, floor: "carpet" },
    { name: "廚房", x: 13, y: 1, w: 13, h: 11, floor: "linoleum" },
    { name: "臥室", x: 25, y: 1, w: 13, h: 11, floor: "wood" },
    { name: "浴室", x: 1, y: 11, w: 13, h: 10, floor: "bath" },
    { name: "走廊", x: 13, y: 11, w: 13, h: 10, floor: "wood" },
    { name: "儲藏", x: 25, y: 11, w: 13, h: 10, floor: "concrete" },
    { name: "車庫", x: 1, y: 20, w: 13, h: 10, floor: "concrete" },
    { name: "後院", x: 13, y: 20, w: 25, h: 10, floor: "grass" },
  ],
  { x: 26, y: 29 },
);

const SHOP = pack(
  38,
  30,
  [
    { name: "店面", x: 1, y: 1, w: 19, h: 11, floor: "linoleum" },
    { name: "倉庫", x: 19, y: 1, w: 19, h: 11, floor: "concrete" },
    { name: "後巷", x: 1, y: 11, w: 13, h: 10, floor: "concrete" },
    { name: "辦公室", x: 13, y: 11, w: 13, h: 10, floor: "carpet" },
    { name: "廁所", x: 25, y: 11, w: 13, h: 10, floor: "bath" },
    { name: "卸貨", x: 1, y: 20, w: 13, h: 10, floor: "concrete" },
    { name: "工具間", x: 13, y: 20, w: 13, h: 10, floor: "wood" },
    { name: "停車場", x: 25, y: 20, w: 13, h: 10, floor: "grass" },
  ],
  { x: 10, y: 1 },
);

const WARD = pack(
  40,
  30,
  [
    { name: "大廳", x: 1, y: 1, w: 15, h: 11, floor: "linoleum" },
    { name: "病房", x: 15, y: 1, w: 13, h: 11, floor: "linoleum" },
    { name: "藥局", x: 27, y: 1, w: 13, h: 11, floor: "linoleum" },
    { name: "走廊", x: 1, y: 11, w: 39, h: 9, floor: "concrete" },
    { name: "手術室", x: 1, y: 19, w: 13, h: 11, floor: "bath" },
    { name: "停屍間", x: 13, y: 19, w: 14, h: 11, floor: "concrete" },
    { name: "樓梯", x: 26, y: 19, w: 7, h: 11, floor: "wood" },
    { name: "屋頂口", x: 32, y: 19, w: 8, h: 11, floor: "concrete" },
  ],
  { x: 8, y: 1 },
);

const CITY = pack(
  40,
  32,
  [
    { name: "街道", x: 1, y: 1, w: 39, h: 8, floor: "concrete" },
    { name: "便利店", x: 1, y: 8, w: 13, h: 11, floor: "linoleum" },
    { name: "公寓廳", x: 13, y: 8, w: 14, h: 11, floor: "carpet" },
    { name: "藥房", x: 26, y: 8, w: 14, h: 11, floor: "linoleum" },
    { name: "巷弄", x: 1, y: 18, w: 11, h: 14, floor: "concrete" },
    { name: "車庫", x: 11, y: 18, w: 13, h: 14, floor: "concrete" },
    { name: "地下室", x: 23, y: 18, w: 9, h: 14, floor: "wood" },
    { name: "電台", x: 31, y: 18, w: 9, h: 14, floor: "carpet" },
  ],
  { x: 20, y: 1 },
);

const ALL: Record<LayoutId, LayoutDef> = { house: HOUSE, shop: SHOP, ward: WARD, city: CITY };

export function layoutById(id: LayoutId): LayoutDef {
  return ALL[id];
}

export function roomAt(layout: LayoutDef, tx: number, ty: number): RoomDef | null {
  for (const r of layout.rooms) {
    if (tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h) return r;
  }
  return null;
}

export function inwardSpawn(layout: LayoutDef): { x: number; y: number } {
  const e = layout.entry;
  const r =
    roomAt(layout, e.x, e.y) ||
    roomAt(layout, e.x, e.y + 1) ||
    roomAt(layout, e.x, e.y - 1) ||
    roomAt(layout, e.x + 1, e.y) ||
    roomAt(layout, e.x - 1, e.y) ||
    layout.rooms[0];
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const dx = Math.sign(cx - e.x) || 0;
  const dy = Math.sign(cy - e.y) || 1;
  return { x: e.x + dx * 2, y: e.y + dy * 2 };
}
