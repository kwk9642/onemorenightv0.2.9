import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { asset } from "./asset";
import { TILE, roomAt, type FloorKind } from "./layouts";
import type { Actor, MissionRuntime } from "./missionSim";

const S = 1.4;
const WALL_H = 2.35;
const WALL_T = 0.2;
const OUTDOOR = new Set(["後院", "停車場", "街道", "後巷", "巷弄", "屋頂口"]);
const ISO = 7.2;

function tex(loader: THREE.TextureLoader, src: string, repeat = 1) {
  const t = loader.load(asset(src));
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  return t;
}

function to3(px: number, py: number) {
  return new THREE.Vector3((px / TILE) * S, 0, (py / TILE) * S);
}

export class World3D {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  rt: MissionRuntime;
  canvas: HTMLCanvasElement;
  raf = 0;
  last = 0;
  actors = new Map<string, THREE.Object3D>();
  loot = new Map<number, THREE.Object3D>();
  playerLight: THREE.PointLight;
  sun: THREE.DirectionalLight | null = null;
  look = new THREE.Vector3(0, 0, 1);
  tmp = new THREE.Vector3();
  camTarget = new THREE.Vector3();
  camPos = new THREE.Vector3();
  spriteMats: { player: THREE.SpriteMaterial; zombie: THREE.SpriteMaterial; npc: THREE.SpriteMaterial };
  disposed = false;

  constructor(canvas: HTMLCanvasElement, rt: MissionRuntime) {
    this.canvas = canvas;
    this.rt = rt;
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    this.camera = new THREE.PerspectiveCamera(44, w / h, 0.25, 80);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
    this.renderer.setSize(w, h, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.scene.background = new THREE.Color("#161310");
    this.scene.fog = new THREE.Fog("#241e18", 10, 36);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    this.spriteMats = this.makeSprites(loader);
    this.playerLight = new THREE.PointLight("#ffd8a8", 3.2, 9, 1.8);
    this.scene.add(this.playerLight);
    this.build(loader);
    const spawn = to3(rt.player.x, rt.player.y);
    this.camera.position.set(spawn.x + ISO, ISO * 1.12, spawn.z + ISO);
    this.camera.lookAt(spawn.x, 0.35, spawn.z);
    this.resize();
  }

  private makeSprites(loader: THREE.TextureLoader) {
    const mk = (src: string, hue = 0) => {
      const map = loader.load(asset(src));
      map.colorSpace = THREE.SRGBColorSpace;
      map.repeat.set(0.25, 0.25);
      const mat = new THREE.SpriteMaterial({
        map,
        transparent: true,
        depthWrite: true,
        alphaTest: 0.28,
      });
      if (hue) mat.color.setHSL(hue, 0.25, 0.7);
      return mat;
    };
    return {
      player: mk("/game/sprites/iso-player-walk.png"),
      zombie: mk("/game/sprites/iso-zombie-walk.png"),
      npc: mk("/game/sprites/iso-player-walk.png", 0.55),
    };
  }

  private build(loader: THREE.TextureLoader) {
    const rt = this.rt;
    const L = rt.layout;
    const floors: Record<FloorKind, THREE.Texture> = {
      wood: tex(loader, "/game/tiles/floor-wood.jpg", 2),
      carpet: tex(loader, "/game/tiles/floor-carpet.jpg", 2),
      linoleum: tex(loader, "/game/tiles/floor-linoleum.jpg", 2),
      concrete: tex(loader, "/game/tiles/floor-concrete.jpg", 2),
      bath: tex(loader, "/game/tiles/floor-bath.jpg", 2),
      grass: tex(loader, "/game/tiles/floor-grass.jpg", 2),
    };
    const asphalt = tex(loader, "/game/tiles/floor-asphalt.jpg", 8);
    const brick = tex(loader, "/game/tiles/wall-brick.jpg", 1);
    const dry = tex(loader, "/game/tiles/wall-drywall.jpg", 1);
    const facade = tex(loader, "/game/tiles/wall-facade.jpg", 2);
    const skyMap = loader.load(asset("/game/tiles/sky-dusk.jpg"));
    skyMap.colorSpace = THREE.SRGBColorSpace;

    const hemi = new THREE.HemisphereLight("#ffe6c0", "#2c241c", 0.85);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight("#ffc07a", 2.35);
    sun.position.set(16, 22, 10);
    sun.castShadow = true;
    const mobile = this.canvas.clientWidth < 500;
    sun.shadow.mapSize.set(mobile ? 768 : 1536, mobile ? 768 : 1536);
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 55;
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.bias = -0.0007;
    this.scene.add(sun);
    this.scene.add(sun.target);
    this.sun = sun;

    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(70, 32, 20),
      new THREE.MeshBasicMaterial({ map: skyMap, side: THREE.BackSide, fog: false, depthWrite: false }),
    );
    sky.position.y = 8;
    this.scene.add(sky);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      new THREE.MeshStandardMaterial({
        map: asphalt,
        roughness: 0.32,
        metalness: 0.18,
        color: "#8a8680",
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const cx = (L.tw * S) / 2;
    const cz = (L.th * S) / 2;
    const stone = new THREE.MeshStandardMaterial({
      map: facade,
      roughness: 0.62,
      metalness: 0.04,
      color: "#b0a494",
    });
    const blocks = [
      [-18, -10, 8, 7, 6],
      [L.tw * S + 12, -8, 9, 6, 8],
      [-16, L.th * S + 12, 10, 8, 5],
      [L.tw * S + 11, L.th * S + 10, 8, 7, 9],
    ];
    for (const [x, z, w, d, h] of blocks) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stone);
      m.position.set(x, h / 2, z);
      m.castShadow = true;
      m.receiveShadow = true;
      this.scene.add(m);
    }

    const brickMat = new THREE.MeshStandardMaterial({
      map: brick,
      roughness: 0.72,
      metalness: 0.05,
      color: "#c4b0a0",
    });
    const dryMat = new THREE.MeshStandardMaterial({
      map: dry,
      roughness: 0.78,
      metalness: 0.02,
      color: "#d2c8b8",
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: "#6a6864",
      roughness: 0.45,
      metalness: 0.55,
    });

    const brickGeos: THREE.BufferGeometry[] = [];
    const dryGeos: THREE.BufferGeometry[] = [];
    const metalGeos: THREE.BufferGeometry[] = [];
    const windowGroup = new THREE.Group();

    const at = (x: number, y: number) => {
      if (x < 0 || y < 0 || x >= L.tw || y >= L.th) return 1;
      return rt.tiles[y * L.tw + x];
    };
    const pushSlab = (geos: THREE.BufferGeometry[], geo: THREE.BufferGeometry, tx: number, ty: number) => {
      const room = roomAt(L, tx, ty) ?? roomAt(L, tx, ty + 1) ?? roomAt(L, tx + 1, ty);
      const outer = !room || this.isOuter(tx, ty);
      if (outer) brickGeos.push(geo);
      else if (room?.floor === "concrete") metalGeos.push(geo);
      else dryGeos.push(geo);
    };
    for (let ty = 0; ty < L.th; ty++) {
      for (let tx = 0; tx < L.tw; tx++) {
        if (at(tx, ty) !== 1) continue;
        const floorS = at(tx, ty + 1) === 0;
        const floorE = at(tx + 1, ty) === 0;
        // Far walls only (N/W of rooms) so the camera can see in.
        if (floorS) {
          const geo = new THREE.BoxGeometry(S * 0.98, WALL_H, WALL_T);
          geo.translate(tx * S + S / 2, WALL_H / 2, (ty + 1) * S - WALL_T / 2);
          pushSlab(brickGeos, geo, tx, ty);
        }
        if (floorE) {
          const geo = new THREE.BoxGeometry(WALL_T, WALL_H, S * 0.98);
          geo.translate((tx + 1) * S - WALL_T / 2, WALL_H / 2, ty * S + S / 2);
          pushSlab(brickGeos, geo, tx, ty);
        }
        if (floorS && ((tx + ty) & 3) === 0) {
          const pane = new THREE.Mesh(
            new THREE.PlaneGeometry(S * 0.4, 0.85),
            new THREE.MeshStandardMaterial({
              color: "#f0d090",
              emissive: "#f0c060",
              emissiveIntensity: 1.35,
              roughness: 0.2,
            }),
          );
          pane.position.set(tx * S + S / 2, 1.2, (ty + 1) * S - WALL_T - 0.01);
          windowGroup.add(pane);
        }
      }
    }
    const addMerged = (geos: THREE.BufferGeometry[], mat: THREE.Material) => {
      if (!geos.length) return;
      const g = mergeGeometries(geos);
      geos.forEach((x) => x.dispose());
      if (!g) return;
      const mesh = new THREE.Mesh(g, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    };
    addMerged(brickGeos, brickMat);
    addMerged(dryGeos, dryMat);
    addMerged(metalGeos, metalMat);
    this.scene.add(windowGroup);

    const floorMats = new Map<FloorKind, THREE.MeshStandardMaterial>();
    (Object.keys(floors) as FloorKind[]).forEach((k) => {
      const wet = k === "concrete" || k === "linoleum" || k === "grass";
      floorMats.set(
        k,
        new THREE.MeshStandardMaterial({
          map: k === "grass" || k === "concrete" ? (k === "grass" ? floors.grass : asphalt) : floors[k],
          roughness: wet ? 0.28 : 0.7,
          metalness: wet ? 0.16 : 0.04,
          color: "#c8c0b4",
        }),
      );
    });
    for (const r of L.rooms) {
      const w = (r.w - 0.12) * S;
      const d = (r.h - 0.12) * S;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorMats.get(r.floor));
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set((r.x + r.w / 2) * S, 0.02, (r.y + r.h / 2) * S);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      if (OUTDOOR.has(r.name) && (r.name === "街道" || r.name === "停車場" || r.name === "巷弄")) {
        this.addRoad((r.x + r.w / 2) * S, (r.y + r.h / 2) * S, w, d);
      }
    }
    this.scatterBlood();

    const frameMat = new THREE.MeshStandardMaterial({ color: "#4a3224", roughness: 0.7 });
    for (const door of L.doors.concat([L.entry])) {
      const x = door.x * S + S / 2;
      const z = door.y * S + S / 2;
      const strip = new THREE.Mesh(
        new THREE.PlaneGeometry(1.15, 0.42),
        new THREE.MeshBasicMaterial({
          color: "#e8c070",
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        }),
      );
      strip.rotation.x = -Math.PI / 2;
      strip.position.set(x, 0.04, z);
      this.scene.add(strip);
      const post = new THREE.BoxGeometry(0.12, 1.35, 0.12);
      const p1 = new THREE.Mesh(post, frameMat);
      const p2 = new THREE.Mesh(post, frameMat);
      p1.position.set(x - 0.5, 0.68, z);
      p2.position.set(x + 0.5, 0.68, z);
      this.scene.add(p1, p2);
    }

    this.buildFurn();
    this.buildCivic();
    sun.target.position.set(cx, 0, cz);
  }

  private isOuter(tx: number, ty: number) {
    const L = this.rt.layout;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const x = tx + dx;
      const y = ty + dy;
      if (x < 0 || y < 0 || x >= L.tw || y >= L.th) return true;
      if (!roomAt(L, x, y)) return true;
    }
    return false;
  }

  private makePickup(color: number) {
    const g = new THREE.Group();
    const paint = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.25 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.5, metalness: 0.4 });
    const glass = new THREE.MeshStandardMaterial({
      color: 0x8aa0a8,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.48, 1.05), paint);
    body.position.y = 0.52;
    body.castShadow = true;
    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.22, 1.0), paint);
    bed.position.set(0.52, 0.82, 0);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.98), paint);
    cabin.position.set(-0.55, 1.02, 0);
    const wind = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.9), glass);
    wind.position.set(-0.98, 1.05, 0);
    const wheel = () => {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 10), dark);
      wh.rotation.z = Math.PI / 2;
      return wh;
    };
    const w1 = wheel();
    w1.position.set(-0.7, 0.22, 0.48);
    const w2 = wheel();
    w2.position.set(-0.7, 0.22, -0.48);
    const w3 = wheel();
    w3.position.set(0.7, 0.22, 0.48);
    const w4 = wheel();
    w4.position.set(0.7, 0.22, -0.48);
    g.add(body, bed, cabin, wind, w1, w2, w3, w4);
    return g;
  }

  private addRoad(cx: number, cz: number, w: number, d: number) {
    const line = new THREE.MeshStandardMaterial({ color: "#d8d2c4", roughness: 0.6 });
    const along = w > d;
    const len = along ? w * 0.86 : d * 0.86;
    const dash = new THREE.BoxGeometry(along ? 0.9 : 0.08, 0.02, along ? 0.08 : 0.9);
    const n = Math.floor(len / 1.6);
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(dash, line);
      const t = (i - n / 2) * 1.6;
      m.position.set(cx + (along ? t : 0), 0.035, cz + (along ? 0 : t));
      this.scene.add(m);
    }
  }

  private scatterBlood() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 128, 128);
    const blobs = [
      [64, 64, 38, 0.85],
      [40, 50, 18, 0.7],
      [88, 72, 16, 0.65],
      [52, 90, 12, 0.55],
      [78, 40, 10, 0.5],
    ];
    for (const [x, y, r, a] of blobs) {
      const grd = ctx.createRadialGradient(x, y, 2, x, y, r);
      grd.addColorStop(0, `rgba(110,8,8,${a})`);
      grd.addColorStop(0.5, `rgba(70,6,6,${a * 0.7})`);
      grd.addColorStop(1, "rgba(40,0,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.92 });
    const L = this.rt.layout;
    let n = 0;
    for (const r of L.rooms) {
      const count = OUTDOOR.has(r.name) ? 5 : 3;
      for (let i = 0; i < count; i++) {
        const px = (r.x + 2 + ((n * 3 + i * 5) % Math.max(2, r.w - 4))) * S;
        const pz = (r.y + 2 + ((n * 7 + i * 3) % Math.max(2, r.h - 4))) * S;
        const splat = new THREE.Mesh(new THREE.PlaneGeometry(1.1 + (i % 3) * 0.4, 0.85 + (i % 2) * 0.35), mat);
        splat.rotation.x = -Math.PI / 2;
        splat.rotation.z = (n + i) * 0.7;
        splat.position.set(px, 0.04, pz);
        this.scene.add(splat);
      }
      n++;
    }
  }

  private buildFurn() {
    const wood = new THREE.MeshStandardMaterial({ color: "#6a4e32", roughness: 0.7 });
    const metal = new THREE.MeshStandardMaterial({ color: "#5a5c60", metalness: 0.65, roughness: 0.38 });
    const rust = new THREE.MeshStandardMaterial({ color: "#5a4030", roughness: 0.62, metalness: 0.2 });
    for (const f of this.rt.furn) {
      const g = new THREE.Group();
      const x = f.tx * S + S / 2;
      const z = f.ty * S + S / 2;
      if (f.kind === "shelf") {
        for (let i = 0; i < 3; i++) {
          const plank = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.06, 0.42), metal);
          plank.position.y = 0.35 + i * 0.55;
          plank.castShadow = true;
          g.add(plank);
        }
        const pole = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.7, 0.08), metal);
        const p1 = pole.clone();
        const p2 = pole.clone();
        p1.position.set(-0.46, 0.85, -0.16);
        p2.position.set(0.46, 0.85, 0.16);
        g.add(p1, p2);
      } else if (f.kind === "crate" || f.kind === "pallet") {
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.7), wood);
        box.position.y = 0.28;
        box.castShadow = true;
        g.add(box);
      } else if (f.kind === "car") {
        g.add(this.makePickup(0x3d5a3a));
      } else if (f.kind === "bed") {
        const m = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.28, 1.8), new THREE.MeshStandardMaterial({ color: "#c4b8a8" }));
        m.position.y = 0.35;
        g.add(m);
      } else if (f.kind === "fridge" || f.kind === "locker" || f.kind === "cabinet") {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.55, 0.55), metal);
        m.position.y = 0.78;
        m.castShadow = true;
        g.add(m);
      } else if (f.kind === "dumpster") {
        const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.7), new THREE.MeshStandardMaterial({ color: "#3a5a3a", metalness: 0.4, roughness: 0.5 }));
        m.position.y = 0.45;
        g.add(m);
      } else {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.7, 0.55), wood);
        m.position.y = 0.35;
        g.add(m);
      }
      g.position.set(x, 0, z);
      this.scene.add(g);
    }
    this.rt.loots.forEach((L, i) => {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.55), wood);
      box.position.copy(to3(L.x, L.y));
      box.position.y = 0.22;
      box.castShadow = true;
      this.scene.add(box);
      this.loot.set(i, box);
    });
  }

  private buildCivic() {
    const L = this.rt.layout;
    const plaza =
      L.rooms.find((r) => r.name === "街道" || r.name === "後院" || r.name === "停車場" || r.name === "大廳") ??
      L.rooms[0];
    const cx = (plaza.x + plaza.w / 2) * S;
    const cz = (plaza.y + plaza.h / 2) * S;
    const marble = new THREE.MeshStandardMaterial({
      color: "#e8e2d6",
      roughness: 0.28,
      metalness: 0.08,
    });
    const ped = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 2.2), marble);
    ped.position.set(cx, 0.35, cz);
    ped.castShadow = true;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.6, 0.4), marble);
    body.position.set(cx, 1.5, cz);
    body.castShadow = true;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), marble);
    head.position.set(cx, 2.42, cz);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.15, 0.16), marble);
    arm.position.set(cx + 0.42, 2.1, cz);
    arm.rotation.z = -0.55;
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.5, 0.18),
      new THREE.MeshStandardMaterial({ color: "#c8d0d4", metalness: 0.85, roughness: 0.18 }),
    );
    blade.position.set(cx + 0.85, 2.85, cz);
    this.scene.add(ped, body, head, arm, blade);

    const street = L.rooms.find((r) => r.name === "街道" || r.name === "停車場");
    if (street) {
      const truck = this.makePickup(0x3a5c38);
      truck.position.set((street.x + street.w * 0.4) * S, 0, (street.y + street.h * 0.45) * S);
      truck.rotation.y = 0.18;
      this.scene.add(truck);
      const truck2 = this.makePickup(0x5a3a2a);
      truck2.position.set((street.x + street.w * 0.7) * S, 0, (street.y + street.h * 0.7) * S);
      truck2.rotation.y = 1.7;
      this.scene.add(truck2);
    }

    const poleMat = new THREE.MeshStandardMaterial({ color: "#2a2a28", metalness: 0.6, roughness: 0.4 });
    const spots = [
      [cx - 6, cz - 5],
      [cx + 6, cz - 5],
      [cx - 6, cz + 5],
      [cx + 6, cz + 5],
    ];
    spots.forEach(([x, z], i) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8), poleMat);
      pole.position.set(x, 1.6, z);
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 10, 8),
        new THREE.MeshStandardMaterial({ color: "#ffe6b0", emissive: "#ffcc77", emissiveIntensity: 3 }),
      );
      bulb.position.set(x, 3.25, z);
      this.scene.add(pole, bulb);
      if (i === 0) {
        const light = new THREE.PointLight("#ffd8a0", 5.5, 12, 1.7);
        light.position.set(x, 3.1, z);
        this.scene.add(light);
      }
    });
  }

  private spriteFor(a: Actor) {
    const mat = (a.kind === "zombie" ? this.spriteMats.zombie : a.kind === "npc" ? this.spriteMats.npc : this.spriteMats.player).clone();
    mat.map = mat.map?.clone() ?? mat.map;
    if (mat.map) {
      mat.map.repeat.set(0.25, 0.25);
      mat.map.needsUpdate = true;
    }
    const spr = new THREE.Sprite(mat);
    const h = a.kind === "zombie" ? 1.7 : 1.9;
    spr.scale.set(h * 0.78, h, 1);
    spr.center.set(0.5, 0);
    this.scene.add(spr);
    this.actors.set(a.id, spr);
    return spr;
  }

  private frameSprite(spr: THREE.Sprite, a: Actor) {
    const map = spr.material.map;
    if (!map) return;
    const col = a.attacking > 0 ? Math.min(3, Math.floor((0.28 - a.attacking) / 0.07)) : a.frame % 4;
    const row = a.dir;
    map.offset.set(col * 0.25, 1 - (row + 1) * 0.25);
  }

  private sync() {
    const rt = this.rt;
    const living = [rt.player, ...rt.allies, ...rt.zombies, ...(rt.npc ? [rt.npc] : [])];
    const seen = new Set<string>();
    for (const a of living) {
      seen.add(a.id);
      let obj = this.actors.get(a.id);
      if (!obj) obj = this.spriteFor(a);
      const p = to3(a.x, a.y);
      if (!a.alive) {
        obj.position.set(p.x, 0.04, p.z);
        obj.scale.set(1.4, 0.35, 1);
        obj.rotation.z = 1.15;
      } else {
        obj.position.set(p.x, 0.02, p.z);
        const h = a.kind === "zombie" ? 1.7 : 1.9;
        if (obj instanceof THREE.Sprite) obj.scale.set(h * 0.78, h, 1);
        obj.rotation.z = 0;
        if (obj instanceof THREE.Sprite) this.frameSprite(obj, a);
      }
    }
    for (const [id, obj] of this.actors) {
      if (!seen.has(id)) {
        this.scene.remove(obj);
        this.actors.delete(id);
      }
    }
    rt.loots.forEach((L, i) => {
      const m = this.loot.get(i);
      if (m) m.visible = !L.taken;
    });

    const p = to3(rt.player.x, rt.player.y);
    this.playerLight.position.set(p.x, 2.4, p.z);
    rt.camLookX = -0.707;
    rt.camLookZ = -0.707;

    const room = rt.roomName();
    const outdoor = OUTDOOR.has(room) || !room;
    const dist = outdoor ? 8.8 : 6.4;
    const height = outdoor ? 11.2 : 7.4;
    this.camTarget.set(p.x, 0.4, p.z);
    this.camPos.set(p.x + dist * 0.78, height, p.z + dist * 0.78);
    if (this.sun) this.sun.target.position.copy(this.camTarget);
    this.camera.fov = outdoor ? 40 : 44;
    this.camera.updateProjectionMatrix();
    this.camera.position.lerp(this.camPos, 0.16);
    this.tmp.copy(this.camTarget);
    this.camera.lookAt(this.tmp);
  }

  start() {
    this.last = performance.now();
    const loop = (now: number) => {
      if (this.disposed) return;
      const dt = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      this.rt.tick(dt);
      this.sync();
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  resize() {
    const w = Math.max(1, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
    this.renderer.setSize(w, h, false);
  }

  stop() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.renderer.dispose();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
  }
}
