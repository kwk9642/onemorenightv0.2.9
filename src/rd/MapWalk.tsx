import { useEffect, useRef, useState } from "react";
import { asset } from "@/game/asset";
import {
  GAITS,
  GAIT_INFO,
  MAPS,
  PX_DIRS,
  facingFrom,
  preloadPx,
  pxFrame,
  type Gait,
  type PxDir,
} from "./pixelWalk";

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys?: (codes: string[]) => void;
    };
  }
}

export function MapWalk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef(new Set<string>());
  const injected = useRef<string[] | null>(null);
  const stick = useRef({ x: 0, y: 0, active: false });
  const state = useRef({
    x: 0.52,
    y: 0.62,
    dir: "down" as PxDir,
    gait: "walk" as Gait,
    frame: 0,
    acc: 0,
    moving: false,
    map: 0,
  });
  const [mapI, setMapI] = useState(0);
  const [gait, setGait] = useState<Gait>("walk");
  const [dirLabel, setDirLabel] = useState("down · walk");

  useEffect(() => {
    preloadPx();
  }, []);

  useEffect(() => {
    state.current.map = mapI;
  }, [mapI]);

  useEffect(() => {
    state.current.gait = gait;
    state.current.frame = 0;
    state.current.acc = 0;
  }, [gait]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const mapIm = new Image();
    const spriteCache = new Map<string, HTMLImageElement>();
    const load = (src: string) => {
      const hit = spriteCache.get(src);
      if (hit) return hit;
      const im = new Image();
      im.src = src;
      spriteCache.set(src, im);
      return im;
    };
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      let vx = 0;
      let vy = 0;
      const held = new Set<string>();
      const src = injected.current ?? [...keys.current];
      for (const raw of src) {
        const x = raw.toLowerCase();
        if (x === "keya" || x === "a" || x === "arrowleft") held.add("a");
        if (x === "keyd" || x === "d" || x === "arrowright") held.add("d");
        if (x === "keyw" || x === "w" || x === "arrowup") held.add("w");
        if (x === "keys" || x === "s" || x === "arrowdown") held.add("s");
        if (x === "shift") held.add("shift");
        if (x === "c" || x === "control") held.add("sneak");
      }
      if (held.has("a")) vx -= 1;
      if (held.has("d")) vx += 1;
      if (held.has("w")) vy -= 1;
      if (held.has("s")) vy += 1;
      if (stick.current.active) {
        vx += stick.current.x;
        vy += stick.current.y;
      }
      const mag = Math.hypot(vx, vy);
      if (mag > 1) {
        vx /= mag;
        vy /= mag;
      }
      let gaitNow = s.gait;
      if (held.has("shift")) gaitNow = "run";
      else if (held.has("sneak")) gaitNow = "sneak";
      const info = GAIT_INFO[gaitNow];
      s.moving = mag > 0.12;
      if (s.moving) {
        s.dir = facingFrom(vx, vy, s.dir);
        s.x = Math.min(0.92, Math.max(0.08, s.x + vx * info.speed * dt));
        s.y = Math.min(0.9, Math.max(0.2, s.y + vy * info.speed * dt));
        s.acc += dt;
        if (s.acc >= 1 / info.fps) {
          s.acc = 0;
          s.frame = (s.frame + 1) % info.frames;
        }
      } else {
        s.acc = 0;
        s.frame = 0;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);
      const mapSrc = asset(MAPS[s.map].src);
      if (mapIm.getAttribute("data-src") !== mapSrc) {
        mapIm.setAttribute("data-src", mapSrc);
        mapIm.src = mapSrc;
      }
      if (mapIm.complete && mapIm.naturalWidth) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(mapIm, 0, 0, w, h);
      } else {
        ctx.fillStyle = "#1a1410";
        ctx.fillRect(0, 0, w, h);
      }
      const spr = load(pxFrame(gaitNow, s.dir, s.moving, s.frame));
      if (spr.complete && spr.naturalWidth) {
        ctx.imageSmoothingEnabled = false;
        const sh = Math.round(h * 0.22);
        const sw = Math.round((spr.naturalWidth / spr.naturalHeight) * sh);
        const dx = Math.round(s.x * w - sw / 2);
        const dy = Math.round(s.y * h - sh);
        ctx.drawImage(spr, dx, dy, sw, sh);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.__controlsTest = {
      getYaw: () => {
        const d = state.current.dir;
        return d === "right" ? 0 : d === "down" ? Math.PI / 2 : d === "left" ? Math.PI : -Math.PI / 2;
      },
      getSpeed: () => (state.current.moving ? GAIT_INFO[state.current.gait].speed : 0),
      setKeys: (codes: string[]) => {
        injected.current = codes.length ? codes : null;
      },
    };
    const label = setInterval(() => {
      setDirLabel(`${state.current.dir} · ${state.current.gait}`);
    }, 200);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(label);
      delete window.__controlsTest;
    };
  }, []);

  const padRef = useRef<HTMLDivElement>(null);
  const setStick = (clientX: number, clientY: number) => {
    const el = padRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (clientX - r.left) / r.width * 2 - 1;
    const y = (clientY - r.top) / r.height * 2 - 1;
    const m = Math.hypot(x, y) || 1;
    const clamp = Math.min(1, m);
    stick.current = { x: (x / m) * clamp, y: (y / m) * clamp, active: clamp > 0.15 };
  };
  const clearStick = () => {
    stick.current = { x: 0, y: 0, active: false };
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg text-fg">
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="text-[11px] tracking-[0.18em] text-muted uppercase">R&D · 不進 v0.1</div>
        <h1 className="font-display text-xl tracking-wide">像素人 · 走／潛／跑</h1>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          每向 8 格。潛行矮步慢，奔跑大步快。Shift 跑、C 潛。
        </p>
      </header>

      <div className="grid grid-cols-4 gap-1 px-4">
        {MAPS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMapI(i)}
            className={`h-11 rounded-md text-[11px] ${mapI === i ? "bg-accent text-accent-fg" : "bg-surface text-muted"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1 px-4">
        {GAITS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGait(g)}
            className={`h-11 rounded-md text-sm ${gait === g ? "bg-accent text-accent-fg" : "bg-surface text-muted"}`}
          >
            {GAIT_INFO[g].label}
          </button>
        ))}
      </div>

      <div className="relative mx-4 mt-3 overflow-hidden rounded-md border border-border">
        <canvas ref={canvasRef} width={720} height={405} className="block h-auto w-full" />
        <div className="pointer-events-none absolute left-2 top-2 rounded bg-bg/70 px-2 py-1 text-[10px] tracking-widest text-fg/80 uppercase">
          {dirLabel}
        </div>
      </div>

      <div className="mt-2 flex gap-1 overflow-x-auto px-4 py-1">
        {Array.from({ length: 8 }, (_, i) => (
          <img
            key={i}
            src={pxFrame(gait, "down", true, i)}
            alt=""
            className="h-16 w-10 shrink-0 rounded-md border border-border bg-surface object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div
          ref={padRef}
          className="relative size-36 rounded-full border border-border bg-surface/80"
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            setStick(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (e.buttons) setStick(e.clientX, e.clientY);
          }}
          onPointerUp={clearStick}
          onPointerCancel={clearStick}
        >
          <div className="pointer-events-none absolute inset-0 m-auto size-10 rounded-full bg-accent/70" />
          <span className="pointer-events-none absolute inset-x-0 top-2 text-center text-[10px] text-muted">360°</span>
        </div>
      </div>
    </div>
  );
}
