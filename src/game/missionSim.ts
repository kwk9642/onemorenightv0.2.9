import { asset } from "./asset";
import { locById } from "./data";
import { carryOf, labelItem, liveWeapon, luckMult, rollSearchGear } from "./gear";
import { t, tResBits } from "./i18n";
import { LAYOUT_OF } from "./mapPos";
import { inwardSpawn, layoutById, roomAt, TILE, type FloorKind, type LayoutDef, type RoomDef } from "./layouts";
import {
  clutterOnTile,
  dirToScreen,
  drawDoorway,
  drawFloorTile,
  drawFurn,
  drawGroundGrass,
  drawRoofTile,
  drawShadow,
  drawSky,
  drawWallBlock,
  drawWindowGlow,
  isoToWorld,
  placeFurniture,
  screenToWorldDir,
  tileIso,
  wallPalette,
  worldToIso,
  type Furn,
} from "./iso";
import { range } from "./rng";
import { effectiveSkills } from "./growth";
import type { GameState, GearItem, Resources, Survivor, WeaponId } from "./types";

export type Dir = 0 | 1 | 2 | 3;

export interface Actor {
  id: string;
  kind: "player" | "ally" | "zombie" | "npc";
  x: number;
  y: number;
  dir: Dir;
  frame: number;
  anim: number;
  hp: number;
  maxHp: number;
  speed: number;
  attackCd: number;
  attacking: number;
  hurt: number;
  alive: boolean;
  survivorId?: string;
  weapon?: WeaponId;
}

export interface LootSpot {
  x: number;
  y: number;
  taken: boolean;
  search: number;
}

export interface MissionHooks {
  onKill: (survivorId?: string) => void;
  onHurt: (survivorId: string, dmg: number, infect: boolean) => void;
  onDeath: (survivorId: string) => void;
  onLoot: (got: Partial<Resources>, gear?: GearItem[], rng?: number) => void;
  onEncounter: () => void;
  onExtract: () => void;
  onSquadWipe: () => void;
  onToast: (msg: string) => void;
}

const FLOOR_SRC: Record<FloorKind, string> = {
  wood: "/game/tiles/floor-wood.jpg",
  carpet: "/game/tiles/floor-carpet.jpg",
  linoleum: "/game/tiles/floor-linoleum.jpg",
  concrete: "/game/tiles/floor-concrete.jpg",
  bath: "/game/tiles/floor-bath.jpg",
  grass: "/game/tiles/floor-grass.jpg",
};

function loadImg(src: string): HTMLImageElement {
  const im = new Image();
  im.crossOrigin = "anonymous";
  im.src = asset(src);
  return im;
}

function dirFrom(dx: number, dy: number): Dir {
  if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? 1 : 2;
  return dy < 0 ? 3 : 0;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  max: number;
  color: string;
  size: number;
}
interface Decal {
  x: number;
  y: number;
  r: number;
  a: number;
}
interface Floater {
  x: number;
  y: number;
  text: string;
  life: number;
}
interface Corpse {
  x: number;
  y: number;
  dir: Dir;
}

export class MissionRuntime {
  layout: LayoutDef;
  tiles: Uint8Array;
  rooms: RoomDef[];
  visited: boolean[];
  player!: Actor;
  allies: Actor[] = [];
  zombies: Actor[] = [];
  loots: LootSpot[] = [];
  npc: Actor | null = null;
  furn: Furn[] = [];
  corpses: Corpse[] = [];
  particles: Particle[] = [];
  decals: Decal[] = [];
  floaters: Floater[] = [];
  camX = 0;
  camY = 0;
  trauma = 0;
  freeze = 0;
  keys = new Set<string>();
  stickX = 0;
  stickY = 0;
  lastSx = 0;
  lastSy = -1;
  attackHeld = false;
  interactHeld = false;
  paused = false;
  started = false;
  near: "loot" | "npc" | "exit" | null = null;
  toast = "";
  toastT = 0;
  rng: number;
  hooks: MissionHooks;
  stateRef: () => GameState;
  floors: Record<FloorKind, HTMLImageElement>;
  brick: HTMLImageElement;
  drywall: HTMLImageElement;
  playerWalk: HTMLImageElement;
  playerAtk: HTMLImageElement;
  zombieWalk: HTMLImageElement;
  zombieAtk: HTMLImageElement;
  crateImg: HTMLImageElement;
  shelfImg: HTMLImageElement;
  w = 0;
  h = 0;
  dpr = 1;
  last = 0;
  raf = 0;
  canvas: HTMLCanvasElement | null = null;
  killedHere = 0;
  searching: LootSpot | null = null;
  t = 0;
  camLookX = 0;
  camLookZ = 1;

  constructor(hooks: MissionHooks, stateRef: () => GameState) {
    this.hooks = hooks;
    this.stateRef = stateRef;
    const st = stateRef();
    const loc = locById(st.mission!.locationId);
    const layoutId = LAYOUT_OF[loc.id] ?? "house";
    this.layout = layoutById(layoutId);
    this.rooms = this.layout.rooms;
    this.visited = this.rooms.map(() => false);
    this.rng = st.rng || st.seed || 1;
    this.tiles = new Uint8Array(this.layout.tw * this.layout.th);
    this.tiles.fill(1);
    this.carve();
    this.floors = {
      wood: loadImg(FLOOR_SRC.wood),
      carpet: loadImg(FLOOR_SRC.carpet),
      linoleum: loadImg(FLOOR_SRC.linoleum),
      concrete: loadImg(FLOOR_SRC.concrete),
      bath: loadImg(FLOOR_SRC.bath),
      grass: loadImg(FLOOR_SRC.grass),
    };
    this.brick = loadImg("/game/tiles/wall-brick.jpg");
    this.drywall = loadImg("/game/tiles/wall-drywall.jpg");
    this.playerWalk = loadImg("/game/sprites/iso-player-walk.png");
    this.playerAtk = loadImg("/game/sprites/player-attack.png");
    this.zombieWalk = loadImg("/game/sprites/iso-zombie-walk.png");
    this.zombieAtk = loadImg("/game/sprites/zombie-attack.png");
    this.crateImg = loadImg("/game/props/crate.png");
    this.shelfImg = loadImg("/game/props/shelf.png");
    this.spawn(st);
  }

  private idx(x: number, y: number) {
    return y * this.layout.tw + x;
  }

  private inMap(x: number, y: number) {
    return x >= 0 && y >= 0 && x < this.layout.tw && y < this.layout.th;
  }

  private carve() {
    for (const r of this.rooms) {
      for (let y = r.y + 1; y < r.y + r.h - 1; y++) {
        for (let x = r.x + 1; x < r.x + r.w - 1; x++) {
          this.tiles[this.idx(x, y)] = 0;
        }
      }
    }
    const punch = (x: number, y: number) => {
      if (!this.inMap(x, y)) return;
      this.tiles[this.idx(x, y)] = 2;
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (!this.inMap(nx, ny)) continue;
        if (this.tiles[this.idx(nx, ny)] === 1) {
          const beyondX = x + dx * 2;
          const beyondY = y + dy * 2;
          if (this.inMap(beyondX, beyondY) && this.tiles[this.idx(beyondX, beyondY)] !== 1) {
            this.tiles[this.idx(nx, ny)] = 2;
          }
        }
      }
    };
    for (const d of this.layout.doors) punch(d.x, d.y);
    punch(this.layout.entry.x, this.layout.entry.y);
    this.furn = placeFurniture(this.layout, this.tiles, (x, y) => this.inMap(x, y) && this.tiles[this.idx(x, y)] === 2);
  }

  private spawn(st: GameState) {
    const m = st.mission!;
    const loc = locById(m.locationId);
    const e = inwardSpawn(this.layout);
    const squad = m.squadIds
      .map((id) => st.survivors.find((s) => s.id === id && s.alive))
      .filter((s): s is Survivor => !!s);
    const lead = squad[0];
    this.player = this.makeActor(
      "player",
      (e.x + 0.5) * TILE,
      (e.y + 0.5) * TILE,
      lead?.hp ?? 100,
      lead?.maxHp ?? 100,
      108,
      lead?.id,
      lead?.weapon,
    );
    squad.slice(1).forEach((s, i) => {
      this.allies.push(
        this.makeActor("ally", this.player.x + (i + 1) * 18, this.player.y + 10, s.hp, s.maxHp, 96, s.id, s.weapon),
      );
    });
    const zCount = Math.min(22, Math.max(5, st.locations[loc.id].zombies + (loc.size === "city" || loc.size === "metro" ? 6 : 0)));
    const entryRoom = roomAt(this.layout, e.x, e.y);
    for (let i = 0; i < zCount; i++) {
      const room = this.rooms[(i * 3 + 2) % this.rooms.length];
      if (entryRoom && room.name === entryRoom.name && this.rooms.length > 1) continue;
      const p = this.pointInRoom(room);
      this.zombies.push(this.makeActor("zombie", p.x, p.y, 28, 28, 52 + (i % 3) * 8));
    }
    if (this.zombies.length < zCount) {
      const extra = zCount - this.zombies.length;
      for (let i = 0; i < extra; i++) {
        const room = this.rooms[this.rooms.length - 1 - (i % this.rooms.length)];
        const p = this.pointInRoom(room);
        this.zombies.push(this.makeActor("zombie", p.x, p.y, 28, 28, 56));
      }
    }
    for (const r of this.rooms) {
      if (r.name === entryRoom?.name) continue;
      const p = this.pointInRoom(r, 0.35);
      this.loots.push({ x: p.x, y: p.y, taken: false, search: 0 });
    }
    if (st.locations[loc.id].survivorOpen && loc.survivorChance > 0) {
      const hide = this.rooms[this.rooms.length - 2];
      const p = this.pointInRoom(hide);
      this.npc = this.makeActor("npc", p.x, p.y, 80, 80, 0);
    }
    this.markVisited(this.player.x, this.player.y);
  }

  private makeActor(
    kind: Actor["kind"],
    x: number,
    y: number,
    hp: number,
    maxHp: number,
    speed: number,
    survivorId?: string,
    weapon?: WeaponId,
  ): Actor {
    return {
      id: `${kind}-${Math.random().toString(36).slice(2, 7)}`,
      kind,
      x,
      y,
      dir: 0,
      frame: 0,
      anim: 0,
      hp,
      maxHp,
      speed,
      attackCd: 0,
      attacking: 0,
      hurt: 0,
      alive: true,
      survivorId,
      weapon,
    };
  }

  private pointInRoom(r: RoomDef, inset = 0.25): { x: number; y: number } {
    for (let n = 0; n < 10; n++) {
      const a = range(this.rng, 2, Math.max(3, r.w - 3));
      this.rng = a.r;
      const b = range(this.rng, 2, Math.max(3, r.h - 3));
      this.rng = b.r;
      const pad = Math.max(2, Math.floor(Math.min(r.w, r.h) * inset));
      const tx = r.x + clamp(a.n, pad, r.w - pad);
      const ty = r.y + clamp(b.n, pad, r.h - pad);
      if (this.inMap(tx, ty) && this.tiles[this.idx(tx, ty)] === 0) {
        return { x: (tx + 0.5) * TILE, y: (ty + 0.5) * TILE };
      }
    }
    return { x: (r.x + r.w / 2) * TILE, y: (r.y + r.h / 2) * TILE };
  }

  attach(_canvas?: HTMLCanvasElement | null) {
    this.canvas = _canvas ?? null;
    if (typeof window !== "undefined") {
      (window as unknown as { __controlsTest?: unknown }).__controlsTest = {
        getYaw: () => Math.atan2(-this.lastSx, -this.lastSy),
        getSpeed: () => {
          const moving =
            this.keys.has("KeyA") ||
            this.keys.has("KeyD") ||
            this.keys.has("KeyW") ||
            this.keys.has("KeyS") ||
            Math.hypot(this.stickX, this.stickY) > 0.1;
          return moving && this.player.alive ? this.player.speed : 0;
        },
        getX: () => this.player.x,
        getY: () => this.player.y,
        room: () => this.roomName(),
        setKeys: (codes: string[]) => {
          this.keys = new Set(codes);
        },
      };
    }
  }

  detach() {
    cancelAnimationFrame(this.raf);
    if (typeof window !== "undefined") {
      delete (window as unknown as { __controlsTest?: unknown }).__controlsTest;
    }
    this.canvas = null;
  }

  resize() {
    const c = this.canvas;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.dpr = dpr;
    this.w = c.clientWidth;
    this.h = c.clientHeight;
    c.width = Math.max(1, Math.floor(this.w * dpr));
    c.height = Math.max(1, Math.floor(this.h * dpr));
  }

  setStick(x: number, y: number) {
    const len = Math.hypot(x, y);
    if (len < 0.18) {
      this.stickX = 0;
      this.stickY = 0;
      return;
    }
    const s = Math.min(1, len);
    this.stickX = (x / len) * s;
    this.stickY = (y / len) * s;
  }

  private snapCam() {
    const p = worldToIso(this.player.x, this.player.y);
    this.camX = p.x - this.w / 2;
    this.camY = p.y - this.h * 0.52;
  }

  private blocked(x: number, y: number, rad = 10): boolean {
    const pts = [
      [x - rad, y],
      [x + rad, y],
      [x, y - rad * 0.6],
      [x, y + rad],
    ];
    for (const [px, py] of pts) {
      const tx = Math.floor(px / TILE);
      const ty = Math.floor(py / TILE);
      if (!this.inMap(tx, ty)) return true;
      const v = this.tiles[this.idx(tx, ty)];
      if (v === 1 || v === 3) return true;
    }
    return false;
  }

  private move(a: Actor, dx: number, dy: number, dt: number) {
    if (!a.alive) return;
    const sp = a.speed * dt;
    const nx = a.x + dx * sp;
    const ny = a.y + dy * sp;
    if (!this.blocked(nx, a.y)) a.x = nx;
    if (!this.blocked(a.x, ny)) a.y = ny;
    if (dx || dy) {
      a.dir = dirFrom(dx, dy);
      a.anim += dt * 8;
      a.frame = Math.floor(a.anim) % 4;
    }
  }

  private markVisited(x: number, y: number) {
    const r = roomAt(this.layout, x / TILE, y / TILE);
    if (!r) return;
    const i = this.rooms.indexOf(r);
    if (i >= 0) this.visited[i] = true;
  }

  private livingParty(): Actor[] {
    return [this.player, ...this.allies].filter((a) => a.alive);
  }

  tick(dt: number) {
    if (this.paused || !this.started) return;
    this.t += dt;
    if (this.toastT > 0) this.toastT -= dt;
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    if (this.freeze > 0) {
      this.freeze -= dt;
      this.tickFx(dt);
      this.followCam(dt);
      return;
    }
    let sx = this.stickX;
    let sy = this.stickY;
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) sx -= 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) sx += 1;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) sy -= 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) sy += 1;
    const sl = Math.hypot(sx, sy);
    if (sl > 1) {
      sx /= sl;
      sy /= sl;
    }
    if (sl > 0.05) {
      this.lastSx = sx;
      this.lastSy = sy;
    }
    const lx = this.camLookX;
    const lz = this.camLookZ;
    const llen = Math.hypot(lx, lz) || 1;
    const fx = lx / llen;
    const fz = lz / llen;
    const rx = -fz;
    const rz = fx;
    let mx = sl > 0.05 ? fx * -sy + rx * sx : 0;
    let my = sl > 0.05 ? fz * -sy + rz * sx : 0;
    if (this.searching) {
      mx = 0;
      my = 0;
      this.searching.search += dt;
      if (this.searching.search >= 1.15) {
        this.searching.taken = true;
        this.searching = null;
        this.grantLoot();
      }
    }
    this.move(this.player, mx, my, dt);
    this.markVisited(this.player.x, this.player.y);
    this.player.attackCd = Math.max(0, this.player.attackCd - dt);
    this.player.attacking = Math.max(0, this.player.attacking - dt);
    this.player.hurt = Math.max(0, this.player.hurt - dt);
    if (
      (this.attackHeld || this.keys.has("Space") || this.keys.has("KeyJ") || this.keys.has("KeyK")) &&
      this.player.attackCd <= 0 &&
      this.player.alive
    ) {
      this.swing(this.player);
    }
    for (const al of this.allies) {
      if (!al.alive) continue;
      al.attackCd = Math.max(0, al.attackCd - dt);
      al.attacking = Math.max(0, al.attacking - dt);
      al.hurt = Math.max(0, al.hurt - dt);
      const t = this.player.alive ? this.player : this.livingParty()[0];
      if (!t) continue;
      const dx = t.x - al.x;
      const dy = t.y - al.y;
      const d = Math.hypot(dx, dy);
      if (d > 42) this.move(al, dx / d, dy / d, dt);
      const z = this.nearestZombie(al.x, al.y, 70);
      if (z && al.attackCd <= 0) this.swing(al);
    }
    const prey = this.livingParty();
    for (const z of this.zombies) {
      if (!z.alive) continue;
      z.attackCd = Math.max(0, z.attackCd - dt);
      z.attacking = Math.max(0, z.attacking - dt);
      z.hurt = Math.max(0, z.hurt - dt);
      let best: Actor | null = null;
      let bestD = 9999;
      for (const p of prey) {
        const d = Math.hypot(p.x - z.x, p.y - z.y);
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      }
      if (!best) continue;
      const aggro = bestD < 220 || this.sameRoom(z.x, z.y, best.x, best.y);
      if (aggro && bestD > 22) {
        this.move(z, (best.x - z.x) / bestD, (best.y - z.y) / bestD, dt);
      }
      if (bestD < 28 && z.attackCd <= 0) {
        z.attackCd = 1.05;
        z.attacking = 0.28;
        this.hitPerson(best, 9 + Math.floor(bestD % 5), 0.16);
        this.trauma = Math.min(1, this.trauma + 0.35);
      }
    }
    this.near = null;
    const exit = this.layout.entry;
    if (Math.hypot(this.player.x - (exit.x + 0.5) * TILE, this.player.y - (exit.y + 0.5) * TILE) < 46) {
      this.near = "exit";
    }
    if (this.npc && this.npc.alive && Math.hypot(this.player.x - this.npc.x, this.player.y - this.npc.y) < 40) {
      this.near = "npc";
    }
    for (const L of this.loots) {
      if (!L.taken && Math.hypot(this.player.x - L.x, this.player.y - L.y) < 34) {
        this.near = "loot";
        break;
      }
    }
    if (this.interactHeld || this.keys.has("KeyE") || this.keys.has("KeyF")) {
      this.tryInteract();
      this.interactHeld = false;
      this.keys.delete("KeyE");
      this.keys.delete("KeyF");
    }
    const lead = this.livingParty()[0];
    if (lead && lead !== this.player) {
      this.allies = this.allies.filter((a) => a !== lead);
      this.player = lead;
      this.toast = t("toast.lead", { name: this.nameOf(lead) });
      this.toastT = 2.2;
      this.hooks.onToast(this.toast);
    }
    if (this.livingParty().length === 0) {
      this.paused = true;
      this.hooks.onSquadWipe();
    }
    this.tickFx(dt);
    this.followCam(dt);
  }

  private tickFx(dt: number) {
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vz -= 180 * dt;
      if (p.z < 0) {
        p.z = 0;
        p.vz *= -0.2;
        p.vx *= 0.6;
        p.vy *= 0.6;
      }
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    for (const f of this.floaters) f.life -= dt;
    this.floaters = this.floaters.filter((f) => f.life > 0);
  }

  private followCam(dt: number) {
    const follow = this.player.alive ? this.player : this.livingParty()[0];
    if (!follow) return;
    const look = screenToWorldDir(this.lastSx, this.lastSy);
    const p = worldToIso(follow.x + look.x * 28, follow.y + look.y * 28);
    const tx = p.x - this.w / 2;
    const ty = p.y - this.h * 0.52;
    const k = 1 - Math.exp(-6 * dt);
    this.camX += (tx - this.camX) * k;
    this.camY += (ty - this.camY) * k;
  }

  private sameRoom(ax: number, ay: number, bx: number, by: number) {
    const ra = roomAt(this.layout, ax / TILE, ay / TILE);
    const rb = roomAt(this.layout, bx / TILE, by / TILE);
    return !!ra && ra === rb;
  }

  private nearestZombie(x: number, y: number, max: number): Actor | null {
    let best: Actor | null = null;
    let d0 = max;
    for (const z of this.zombies) {
      if (!z.alive) continue;
      const d = Math.hypot(z.x - x, z.y - y);
      if (d < d0) {
        d0 = d;
        best = z;
      }
    }
    return best;
  }

  private burst(x: number, y: number, color: string, n: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 40 + Math.random() * 90;
      this.particles.push({
        x,
        y,
        z: 12 + Math.random() * 16,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        vz: 40 + Math.random() * 80,
        life: 0.35 + Math.random() * 0.4,
        max: 0.7,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  private swing(a: Actor) {
    a.attackCd = a.kind === "player" ? 0.42 : 0.7;
    a.attacking = 0.28;
    const reach = 42;
    const ang = a.dir === 0 ? Math.PI / 2 : a.dir === 3 ? -Math.PI / 2 : a.dir === 1 ? Math.PI : 0;
    const fx = Math.cos(ang);
    const fy = Math.sin(ang);
    const st = this.stateRef();
    const sur = a.survivorId ? st.survivors.find((s) => s.id === a.survivorId) : null;
    const w = sur ? liveWeapon(sur) : { melee: 0, gun: false };
    const dmg = 10 + (sur ? effectiveSkills(st, sur, st.mission?.squadIds).combat : 4) + w.melee;
    let hits = 0;
    for (const z of this.zombies) {
      if (!z.alive) continue;
      const dx = z.x - a.x;
      const dy = z.y - a.y;
      const d = Math.hypot(dx, dy);
      if (d > reach) continue;
      const dot = (dx / (d || 1)) * fx + (dy / (d || 1)) * fy;
      if (dot < 0.15 && d > 20) continue;
      z.hp -= dmg;
      z.hurt = 0.12;
      z.x += (dx / (d || 1)) * 10;
      z.y += (dy / (d || 1)) * 10;
      hits += 1;
      this.burst(z.x, z.y, "#9a3b32", 8);
      this.floaters.push({ x: z.x, y: z.y, text: `-${dmg}`, life: 0.7 });
      if (z.hp <= 0) {
        z.alive = false;
        this.killedHere += 1;
        this.corpses.push({ x: z.x, y: z.y, dir: z.dir });
        this.decals.push({ x: z.x, y: z.y, r: 16 + Math.random() * 10, a: 0.55 });
        this.burst(z.x, z.y, "#6a2420", 14);
        this.freeze = 0.045;
        this.hooks.onKill(a.survivorId);
      }
    }
    if (hits) this.trauma = Math.min(1, this.trauma + 0.28);
  }

  private hitPerson(a: Actor, dmg: number, infectP: number) {
    if (!a.alive || !a.survivorId) return;
    a.hp -= dmg;
    a.hurt = 0.2;
    this.burst(a.x, a.y, "#9a3b32", 6);
    const infect = Math.random() < infectP;
    this.hooks.onHurt(a.survivorId, dmg, infect);
    if (a.hp <= 0) {
      a.alive = false;
      a.hp = 0;
      this.hooks.onDeath(a.survivorId);
    }
  }

  private grantLoot() {
    const st = this.stateRef();
    const loc = locById(st.mission!.locationId);
    const got: Partial<Resources> = {};
    const keys = Object.keys(loc.loot) as (keyof Resources)[];
    const pickK = keys[Math.floor(Math.random() * keys.length)] ?? "food";
    const pair = loc.loot[pickK];
    const n = pair ? pair[0] + Math.floor(Math.random() * (pair[1] - pair[0] + 1)) : 1;
    got[pickK] = Math.max(1, n);
    if (Math.random() < 0.35 && keys.length > 1) {
      const k2 = keys[(keys.indexOf(pickK) + 1) % keys.length];
      got[k2] = 1;
    }
    const squad = (st.mission?.squadIds ?? [])
      .map((id) => st.survivors.find((s) => s.id === id && s.alive))
      .filter((s): s is Survivor => !!s);
    const scout = squad[0];
    const rolled = rollSearchGear(st.rng, loc.id, {
      luck: scout ? luckMult(scout) : 1,
      carry: carryOf(squad),
      loud: false,
      day: st.day,
    });
    this.hooks.onLoot(got, rolled.items, rolled.r);
    const bits = [tResBits(got), ...rolled.items.map(labelItem)].filter(Boolean).join(" · ");
    this.toast = bits ? t("toast.loot", { bits }) : t("toast.empty");
    this.toastT = 2.4;
    this.hooks.onToast(this.toast);
  }

  tryInteract() {
    if (this.near === "exit") {
      this.paused = true;
      this.hooks.onExtract();
      return;
    }
    if (this.near === "npc" && this.npc) {
      this.npc.alive = false;
      this.npc = null;
      this.paused = true;
      this.hooks.onEncounter();
      return;
    }
    if (this.near === "loot") {
      const L = this.loots.find((x) => !x.taken && Math.hypot(this.player.x - x.x, this.player.y - x.y) < 34);
      if (L) this.searching = L;
    }
  }

  extractNow() {
    this.paused = true;
    this.hooks.onExtract();
  }

  private nameOf(a: Actor) {
    const st = this.stateRef();
    return st.survivors.find((s) => s.id === a.survivorId)?.name ?? "無名";
  }

  draw() {
    const c = this.canvas;
    if (!c) return;
    if (c.clientWidth !== this.w || c.clientHeight !== this.h) {
      this.resize();
      this.snapCam();
    }
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    drawSky(ctx, this.w, this.h);
    const shake = this.trauma * this.trauma;
    const shx = shake ? (Math.random() - 0.5) * 14 * shake : 0;
    const shy = shake ? (Math.random() - 0.5) * 10 * shake : 0;
    ctx.save();
    ctx.translate(-this.camX + shx, -this.camY + shy);
    this.drawWorld(ctx);
    ctx.restore();
    this.drawLighting(ctx);
    this.drawMinimap(ctx);
    if (!this.started) {
      ctx.fillStyle = "rgba(13,12,10,0.28)";
      ctx.fillRect(0, 0, this.w, this.h);
    }
  }

  private drawWorld(ctx: CanvasRenderingContext2D) {
    const pad = 6;
    const tl = isoToWorld(this.camX, this.camY);
    const tr = isoToWorld(this.camX + this.w, this.camY);
    const bl = isoToWorld(this.camX, this.camY + this.h);
    const br = isoToWorld(this.camX + this.w, this.camY + this.h);
    const xs = [tl.x, tr.x, bl.x, br.x].map((v) => v / TILE);
    const ys = [tl.y, tr.y, bl.y, br.y].map((v) => v / TILE);
    const t0x = Math.floor(Math.min(...xs)) - pad;
    const t1x = Math.ceil(Math.max(...xs)) + pad;
    const t0y = Math.floor(Math.min(...ys)) - pad;
    const t1y = Math.ceil(Math.max(...ys)) + pad;
    const ptx = Math.floor(this.player.x / TILE);
    const pty = Math.floor(this.player.y / TILE);
    const actors = [
      ...this.zombies.filter((z) => z.alive),
      ...this.allies.filter((a) => a.alive),
      this.player,
      ...(this.npc && this.npc.alive ? [this.npc] : []),
    ].filter((a) => a.alive);

    const minS = t0x + t0y;
    const maxS = t1x + t1y;
    for (let sum = minS; sum <= maxS; sum++) {
      for (let tx = t0x; tx <= t1x; tx++) {
        const ty = sum - tx;
        if (ty < t0y || ty > t1y) continue;
        const inb = this.inMap(tx, ty);
        const v = inb ? this.tiles[this.idx(tx, ty)] : -1;
        const room = inb ? roomAt(this.layout, tx, ty) : null;
        const ri = room ? this.rooms.indexOf(room) : -1;
        const seen = ri >= 0 && this.visited[ri];
        const isWall = v === 1;
        const isDoor = v === 2;

        const inRoom = !!room;
        if (!inb || (isWall && !inRoom)) {
          drawGroundGrass(ctx, tx, ty, this.floors.grass);
        } else if (isWall) {
          drawFloorTile(ctx, tx, ty, room?.floor ?? "wood", this.floors[room?.floor ?? "wood"], !seen);
        } else {
          drawFloorTile(ctx, tx, ty, room?.floor ?? "wood", this.floors[room?.floor ?? "wood"], !seen);
          if (seen) clutterOnTile(ctx, tx, ty, this.rng);
        }

        if (isDoor) {
          const pulse = 0.35 + Math.sin(this.t * 4) * 0.12;
          const p = tileIso(tx, ty);
          ctx.save();
          ctx.fillStyle = `rgba(210,170,80,${pulse})`;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y + 20, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (seen || !room) {
          for (const d of this.decals) {
            if (Math.floor(d.x / TILE) === tx && Math.floor(d.y / TILE) === ty) {
              const p = worldToIso(d.x, d.y);
              ctx.save();
              ctx.fillStyle = `rgba(90,18,16,${d.a})`;
              ctx.beginPath();
              ctx.ellipse(p.x, p.y + 4, d.r, d.r * 0.45, 0.4, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
          for (const body of this.corpses) {
            if (Math.floor(body.x / TILE) === tx && Math.floor(body.y / TILE) === ty) {
              this.drawCorpse(ctx, body);
            }
          }
          for (const f of this.furn) {
            if (f.tx === tx && f.ty === ty) drawFurn(ctx, f, this.crateImg, this.shelfImg);
          }
          for (const L of this.loots) {
            if (L.taken) continue;
            if (Math.floor(L.x / TILE) === tx && Math.floor(L.y / TILE) === ty) {
              this.drawLoot(ctx, L);
            }
          }
          for (const a of actors) {
            if (Math.floor(a.x / TILE) === tx && Math.floor(a.y / TILE) === ty) this.drawActor(ctx, a);
          }
        }

        if (isWall && inRoom) {
          const outer = this.outerAt(tx, ty);
          const pal = wallPalette(room?.floor ?? "wood", outer);
          const inFront = tx + ty > ptx + pty && Math.abs(tx - ptx) + Math.abs(ty - pty) < 5;
          const alpha = inFront ? 0.28 : 1;
          const se = this.wallFaceOpen(tx, ty, 1, 0);
          const sw = this.wallFaceOpen(tx, ty, 0, 1);
          if (se || sw || inFront) {
            drawWallBlock(ctx, tx, ty, pal, this.brick, this.drywall, alpha, { se, sw: sw || (!se && !sw) });
            if (outer && ((tx + ty) & 3) === 0) drawWindowGlow(ctx, tx, ty, se ? "e" : "s");
          }
        } else if (isDoor) {
          const pal = wallPalette(room?.floor ?? "wood", false);
          const glow = tx === this.layout.entry.x && ty === this.layout.entry.y;
          drawDoorway(ctx, tx, ty, pal, glow);
        }

        if (room && !seen && !isWall) {
          drawRoofTile(ctx, tx, ty, true);
        }
      }
    }

    for (const p of this.particles) {
      const iso = worldToIso(p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillRect(iso.x - p.size / 2, iso.y - p.z - p.size / 2, p.size, p.size);
      ctx.globalAlpha = 1;
    }
    for (const f of this.floaters) {
      const iso = worldToIso(f.x, f.y);
      ctx.fillStyle = `rgba(232,200,160,${Math.max(0, f.life)})`;
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(f.text, iso.x, iso.y - 28 - (0.7 - f.life) * 24);
    }
  }

  private wallFaceOpen(tx: number, ty: number, dx: number, dy: number) {
    const x = tx + dx;
    const y = ty + dy;
    if (!this.inMap(x, y)) return true;
    const v = this.tiles[this.idx(x, y)];
    return v !== 1;
  }

  private outerAt(tx: number, ty: number) {
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const x = tx + dx;
      const y = ty + dy;
      if (!this.inMap(x, y)) return true;
      if (!roomAt(this.layout, x, y)) return true;
    }
    return false;
  }

  private drawLoot(ctx: CanvasRenderingContext2D, L: LootSpot) {
    const p = worldToIso(L.x, L.y);
    const glow = L === this.searching;
    if (this.crateImg.complete && this.crateImg.naturalWidth) {
      ctx.save();
      if (glow) ctx.filter = "brightness(1.35)";
      ctx.drawImage(this.crateImg, p.x - 22, p.y - 30, 44, 40);
      ctx.restore();
    } else {
      ctx.fillStyle = glow ? "#c4bdb3" : "#6a4e32";
      ctx.fillRect(p.x - 11, p.y - 14, 22, 16);
    }
    if (glow) {
      ctx.strokeStyle = "#e8d0a0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y - 18, 14, -Math.PI / 2, -Math.PI / 2 + (L.search / 1.15) * Math.PI * 2);
      ctx.stroke();
    }
  }

  private drawCorpse(ctx: CanvasRenderingContext2D, body: Corpse) {
    const p = worldToIso(body.x, body.y);
    const sheet = this.zombieWalk;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(0.6);
    ctx.scale(1, 0.38);
    ctx.filter = "brightness(0.45) saturate(0.6)";
    if (sheet.complete && sheet.naturalWidth) {
      const cell = sheet.naturalWidth / 4;
      ctx.drawImage(sheet, 0, 0, cell, cell, -28, -50, 56, 64);
    } else {
      ctx.fillStyle = "#3a4a32";
      ctx.fillRect(-16, -10, 32, 18);
    }
    ctx.restore();
  }

  private drawActor(ctx: CanvasRenderingContext2D, a: Actor) {
    const p = worldToIso(a.x, a.y);
    drawShadow(ctx, p.x, p.y, a.kind === "zombie" ? 14 : 16, 7);
    const walk = a.kind === "zombie" ? this.zombieWalk : this.playerWalk;
    const atk = a.kind === "zombie" ? this.zombieAtk : this.playerAtk;
    const useAtk = a.attacking > 0 && atk.complete && atk.naturalWidth > 0 && atk !== walk;
    const sheet = useAtk ? atk : walk;
    const dw = a.kind === "zombie" ? 54 : 58;
    const dh = a.kind === "zombie" ? 74 : 82;
    ctx.save();
    if (a.hurt > 0) ctx.filter = "brightness(2.4)";
    if (a.kind === "npc") ctx.filter = "hue-rotate(200deg) saturate(0.7)";
    if (sheet.complete && sheet.naturalWidth) {
      const cell = Math.round(sheet.naturalWidth / 4);
      const cols = Math.max(1, Math.round(sheet.naturalWidth / cell));
      const rows = Math.max(1, Math.round(sheet.naturalHeight / cell));
      const col = a.attacking > 0 ? Math.min(cols - 1, Math.floor((0.28 - a.attacking) / 0.07)) : a.frame % cols;
      const row = Math.min(rows - 1, a.dir);
      ctx.drawImage(sheet, col * cell, row * cell, cell, cell, p.x - dw / 2, p.y - dh + 10, dw, dh);
    } else {
      ctx.fillStyle = a.kind === "zombie" ? "#6a8a5a" : "#c4bdb3";
      ctx.fillRect(p.x - 10, p.y - 36, 20, 36);
    }
    ctx.restore();
    if (a.attacking > 0 && a.kind !== "zombie") {
      const t = 1 - a.attacking / 0.28;
      const scr = dirToScreen(a.dir);
      ctx.save();
      ctx.strokeStyle = `rgba(232,220,190,${0.8 - t})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(p.x + scr.x * 10, p.y - 22 + scr.y * 6, 22, t * 1.2, t * 1.2 + 1.4);
      ctx.stroke();
      ctx.restore();
    }
    if (a.kind !== "zombie") {
      ctx.fillStyle = "#1a1612";
      ctx.fillRect(p.x - 14, p.y + 8, 28, 3);
      ctx.fillStyle = "#9a3b32";
      ctx.fillRect(p.x - 14, p.y + 8, 28 * clamp(a.hp / a.maxHp, 0, 1), 3);
    }
  }

  private drawLighting(ctx: CanvasRenderingContext2D) {
    const p = worldToIso(this.player.x, this.player.y);
    const sx = p.x - this.camX;
    const sy = p.y - this.camY - 10;
    const room = roomAt(this.layout, this.player.x / TILE, this.player.y / TILE);
    const outdoor = room?.floor === "grass";
    const g = ctx.createRadialGradient(sx, sy, 28, sx, sy, Math.max(this.w, this.h) * 0.72);
    if (outdoor) {
      g.addColorStop(0, "rgb(255,248,230)");
      g.addColorStop(0.5, "rgb(230,210,180)");
      g.addColorStop(1, "rgb(110,80,55)");
    } else {
      g.addColorStop(0, "rgb(255,236,200)");
      g.addColorStop(0.34, "rgb(200,175,140)");
      g.addColorStop(1, "rgb(48,36,26)");
    }
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, this.h);
    const scr = dirToScreen(this.player.dir);
    const len = Math.hypot(scr.x, scr.y) || 1;
    const fx = scr.x / len;
    const fy = scr.y / len;
    const cone = ctx.createRadialGradient(sx + fx * 50, sy + fy * 36, 8, sx + fx * 50, sy + fy * 36, 130);
    cone.addColorStop(0, "rgba(255,240,200,0.55)");
    cone.addColorStop(1, "rgba(255,240,200,0)");
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = outdoor ? 0.12 : 0.28;
    ctx.fillStyle = cone;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.restore();
  }

  private drawMinimap(ctx: CanvasRenderingContext2D) {
    const s = 3.1;
    const pad = 10;
    const mw = this.layout.tw * s;
    const mh = this.layout.th * s;
    const x = this.w - mw - pad;
    const y = pad + 4;
    ctx.fillStyle = "rgba(13,12,10,0.72)";
    ctx.fillRect(x - 4, y - 4, mw + 8, mh + 8);
    for (let i = 0; i < this.rooms.length; i++) {
      const r = this.rooms[i];
      ctx.fillStyle = this.visited[i] ? "rgba(196,189,179,0.28)" : "rgba(92,87,79,0.18)";
      ctx.fillRect(x + r.x * s, y + r.y * s, r.w * s, r.h * s);
    }
    ctx.fillStyle = "#c4a050";
    for (const d of this.layout.doors) {
      ctx.fillRect(x + d.x * s, y + d.y * s, s, s);
    }
    ctx.fillStyle = "#9a3b32";
    for (const z of this.zombies) {
      if (z.alive) ctx.fillRect(x + (z.x / TILE) * s - 1, y + (z.y / TILE) * s - 1, 2, 2);
    }
    ctx.fillStyle = "#e8e0d4";
    ctx.fillRect(x + (this.player.x / TILE) * s - 2, y + (this.player.y / TILE) * s - 2, 4, 4);
  }

  zombiesLeft() {
    return this.zombies.filter((z) => z.alive).length;
  }

  threat(): number {
    if (!this.player?.alive) return 0;
    const z = this.nearestZombie(this.player.x, this.player.y, 92);
    const crowd = Math.min(1, this.zombiesLeft() / 10) * 0.22;
    if (!z) return crowd * 0.4;
    const d = Math.hypot(z.x - this.player.x, z.y - this.player.y);
    const prox = Math.max(0, 1 - d / 92);
    const fighting = this.player.attacking > 0 ? 0.18 : 0;
    return Math.min(1, prox * 0.82 + crowd + fighting);
  }

  roomName() {
    const r = roomAt(this.layout, this.player.x / TILE, this.player.y / TILE);
    return r?.name ?? "";
  }
}
