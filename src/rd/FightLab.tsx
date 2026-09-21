import { useEffect, useRef, useState } from "react";
import { asset } from "@/game/asset";
import { facingFrom, type PxDir } from "./pixelWalk";
import {
  CLIPS,
  DIR_VEC,
  KNOCKDOWN_CHANCE,
  PLAYER_HP,
  STOMPS_TO_KILL,
  fightFrame,
  heroIdle,
  heroWalk,
  preloadFight,
  type ClipId,
} from "./pixelFight";

type Phase = "hunt" | "zedPush" | "windup" | "shove" | "stagger" | "down" | "stomp" | "hurt" | "lose" | "win";

const SPEED = 0.2;
const ZED_SPEED = 0.08;
const SHOVE_RANGE = 0.16;
const BITE_RANGE = 0.12;

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function towardDir(fromX: number, fromY: number, toX: number, toY: number, fallback: PxDir): PxDir {
  return facingFrom(toX - fromX, toY - fromY, fallback);
}

function inFront(dir: PxDir, px: number, py: number, zx: number, zy: number) {
  const v = DIR_VEC[dir];
  const dx = zx - px;
  const dy = zy - py;
  const m = Math.hypot(dx, dy) || 1;
  return (v.x * dx + v.y * dy) / m > 0.15;
}

export function FightLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef(new Set<string>());
  const stick = useRef({ x: 0, y: 0, active: false });
  const queued = useRef<"shove" | "stomp" | null>(null);
  const sim = useRef({
    phase: "hunt" as Phase,
    px: 0.5,
    py: 0.68,
    pdir: "down" as PxDir,
    pframe: 0,
    pacc: 0,
    moving: false,
    heroClip: null as ClipId | null,
    heroFrame: 0,
    zx: 0.5,
    zy: 0.28,
    zdir: "down" as PxDir,
    zedClip: "zedWalk" as ClipId,
    zedFrame: 0,
    zacc: 0,
    shoveDir: "down" as PxDir,
    hp: PLAYER_HP,
    stomps: 0,
    log: "轉圈對準牠，前後左右都能推。",
  });
  const [ui, setUi] = useState({
    phase: "hunt" as Phase,
    hp: PLAYER_HP,
    log: sim.current.log,
    stomps: 0,
    dir: "down" as PxDir,
  });

  const reset = () => {
    queued.current = null;
    const side = Math.floor(Math.random() * 4);
    const spawn = [
      { zx: 0.5, zy: 0.22 },
      { zx: 0.82, zy: 0.5 },
      { zx: 0.5, zy: 0.86 },
      { zx: 0.18, zy: 0.5 },
    ][side];
    Object.assign(sim.current, {
      phase: "hunt",
      px: 0.5,
      py: 0.62,
      pdir: "down",
      pframe: 0,
      heroClip: null,
      heroFrame: 0,
      ...spawn,
      zdir: "down",
      zedClip: "zedWalk",
      zedFrame: 0,
      hp: PLAYER_HP,
      stomps: 0,
      log: "僵屍從另一邊來。轉過去推。",
    });
  };

  useEffect(() => {
    preloadFight();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        const p = sim.current.phase;
        if (p === "down") queued.current = "stomp";
        else if (p === "win" || p === "lose") reset();
        else queued.current = "shove";
      }
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
    mapIm.src = asset("/rd/maps/muldraugh-farm.jpg");
    const cache = new Map<string, HTMLImageElement>();
    const load = (src: string) => {
      const hit = cache.get(src);
      if (hit) return hit;
      const im = new Image();
      im.src = src;
      cache.set(src, im);
      return im;
    };
    let raf = 0;
    let last = performance.now();

    const clamp = (s: typeof sim.current) => {
      s.px = Math.min(0.9, Math.max(0.1, s.px));
      s.py = Math.min(0.9, Math.max(0.22, s.py));
      s.zx = Math.min(0.92, Math.max(0.08, s.zx));
      s.zy = Math.min(0.92, Math.max(0.2, s.zy));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = sim.current;
      const busy = s.phase === "shove" || s.phase === "stomp" || s.phase === "hurt" || s.phase === "zedPush" || s.phase === "win" || s.phase === "lose";

      let vx = 0;
      let vy = 0;
      if (!busy) {
        if (keys.current.has("a") || keys.current.has("arrowleft")) vx -= 1;
        if (keys.current.has("d") || keys.current.has("arrowright")) vx += 1;
        if (keys.current.has("w") || keys.current.has("arrowup")) vy -= 1;
        if (keys.current.has("s") || keys.current.has("arrowdown")) vy += 1;
        if (stick.current.active) {
          vx += stick.current.x;
          vy += stick.current.y;
        }
      }
      const mag = Math.hypot(vx, vy);
      if (mag > 1) {
        vx /= mag;
        vy /= mag;
      }
      s.moving = mag > 0.12 && !busy;
      if (s.moving) {
        s.pdir = facingFrom(vx, vy, s.pdir);
        s.px += vx * SPEED * dt;
        s.py += vy * SPEED * dt;
        s.pacc += dt;
        if (s.pacc >= 0.1) {
          s.pacc = 0;
          s.pframe = (s.pframe + 1) % 8;
        }
      } else if (!busy) {
        s.pframe = 0;
      }

      const d = dist(s.px, s.py, s.zx, s.zy);
      s.zdir = towardDir(s.zx, s.zy, s.px, s.py, s.zdir);

      if (s.phase === "hunt") {
        if (d > BITE_RANGE) {
          const ang = Math.atan2(s.py - s.zy, s.px - s.zx);
          s.zx += Math.cos(ang) * ZED_SPEED * dt;
          s.zy += Math.sin(ang) * ZED_SPEED * dt;
          s.zedClip = "zedWalk";
          s.zacc += dt;
          if (s.zacc >= 1 / CLIPS.zedWalk.fps) {
            s.zacc = 0;
            s.zedFrame = (s.zedFrame + 1) % CLIPS.zedWalk.n;
          }
        } else {
          s.phase = "zedPush";
          s.zedClip = "zedShove";
          s.zedFrame = 0;
          s.zacc = 0;
          s.log = "僵屍雙手推人！面向牠反推。";
        }
      }

      if (queued.current === "shove" && (s.phase === "hunt" || s.phase === "windup" || s.phase === "stagger" || s.phase === "zedPush")) {
        queued.current = null;
        if (d <= SHOVE_RANGE && inFront(s.pdir, s.px, s.py, s.zx, s.zy)) {
          s.phase = "shove";
          s.heroClip = "heroShove";
          s.heroFrame = 0;
          s.shoveDir = s.pdir;
          s.zedClip = "zedStagger";
          s.zedFrame = 0;
          s.zacc = 0;
          s.pacc = 0;
          s.log = `往${s.pdir === "down" ? "下" : s.pdir === "up" ? "上" : s.pdir === "left" ? "左" : "右"}推！`;
        } else {
          s.log = "沒推到。要面向牠、靠近。";
        }
      }

      if (s.phase === "zedPush") {
        s.zedClip = "zedShove";
        s.pdir = towardDir(s.px, s.py, s.zx, s.zy, s.pdir);
        const knock = DIR_VEC[s.zdir];
        s.px += knock.x * 0.42 * dt;
        s.py += knock.y * 0.42 * dt;
        s.zacc += dt;
        if (s.zacc >= 1 / CLIPS.zedShove.fps) {
          s.zacc = 0;
          s.zedFrame += 1;
        }
        if (s.zedFrame >= CLIPS.zedShove.n) {
          const stillClose = dist(s.px, s.py, s.zx, s.zy) < BITE_RANGE;
          if (stillClose) {
            s.phase = "windup";
            s.zedClip = "zedBite";
            s.zedFrame = 0;
            s.log = "被推貼住了，要咬！快反推。";
          } else {
            s.phase = "hunt";
            s.zedClip = "zedWalk";
            s.zedFrame = 0;
            s.log = "被推開了。轉身再推回去。";
          }
        }
      } else if (s.phase === "windup") {
        s.zedClip = "zedBite";
        if (dist(s.px, s.py, s.zx, s.zy) > BITE_RANGE + 0.04) {
          s.phase = "hunt";
          s.zedClip = "zedWalk";
          s.log = "拉開了。";
        } else {
          s.zacc += dt;
          if (s.zacc >= 1 / CLIPS.zedBite.fps) {
            s.zacc = 0;
            s.zedFrame += 1;
            if (s.zedFrame >= 4) {
              s.phase = "hurt";
              s.hp -= 1;
              s.log = "沒反推，被咬。";
              s.zacc = 0;
            }
          }
        }
      } else if (s.phase === "shove") {
        s.heroClip = "heroShove";
        s.zedClip = "zedStagger";
        const knock = DIR_VEC[s.shoveDir];
        s.zx += knock.x * 0.32 * dt;
        s.zy += knock.y * 0.32 * dt;
        s.zdir = towardDir(s.zx, s.zy, s.zx + knock.x, s.zy + knock.y, s.zdir);
        s.pacc += dt;
        if (s.pacc >= 1 / CLIPS.heroShove.fps) {
          s.pacc = 0;
          s.heroFrame += 1;
          s.zedFrame += 1;
        }
        if (s.heroFrame >= CLIPS.heroShove.n) {
          s.heroClip = null;
          if (Math.random() < KNOCKDOWN_CHANCE) {
            s.phase = "down";
            s.zedClip = "zedDown";
            s.zedFrame = 0;
            s.log = "倒地！靠近踩。";
          } else {
            s.phase = "stagger";
            s.zedClip = "zedStagger";
            s.zedFrame = 0;
            s.log = "推開了，沒倒。";
          }
        }
      } else if (s.phase === "stagger") {
        s.zedClip = "zedStagger";
        s.zacc += dt;
        if (s.zacc >= 1 / CLIPS.zedStagger.fps) {
          s.zacc = 0;
          s.zedFrame += 1;
        }
        if (s.zedFrame >= CLIPS.zedStagger.n) {
          s.phase = "hunt";
          s.zedClip = "zedWalk";
          s.zedFrame = 0;
          s.log = "牠又來。轉面對準再推。";
        }
      } else if (s.phase === "down") {
        s.zedClip = "zedDown";
        s.zacc += dt;
        if (s.zacc >= 1 / CLIPS.zedDown.fps && s.zedFrame < CLIPS.zedDown.n - 1) {
          s.zacc = 0;
          s.zedFrame += 1;
        }
        if (queued.current === "stomp") {
          queued.current = null;
          if (d <= SHOVE_RANGE) {
            s.phase = "stomp";
            s.heroClip = "heroStomp";
            s.heroFrame = 0;
            s.pacc = 0;
            s.shoveDir = towardDir(s.px, s.py, s.zx, s.zy, s.pdir);
            s.pdir = s.shoveDir;
            s.log = "踩！";
          } else {
            s.log = "走近再踩。";
          }
        }
      } else if (s.phase === "stomp") {
        s.heroClip = "heroStomp";
        s.pacc += dt;
        if (s.pacc >= 1 / CLIPS.heroStomp.fps) {
          s.pacc = 0;
          s.heroFrame += 1;
        }
        if (s.heroFrame >= CLIPS.heroStomp.n) {
          s.heroClip = null;
          s.stomps += 1;
          if (s.stomps >= STOMPS_TO_KILL) {
            s.phase = "win";
            s.log = "踩死了。四向都能推。";
          } else {
            s.phase = "down";
            s.log = "再踩一次。";
          }
        }
      } else if (s.phase === "hurt") {
        s.zacc += dt;
        if (s.zacc > 0.5) {
          if (s.hp <= 0) {
            s.phase = "lose";
            s.log = "被咬倒。";
          } else {
            const knock = DIR_VEC[s.zdir];
            s.px += knock.x * 0.04;
            s.py += knock.y * 0.04;
            s.phase = "hunt";
            s.zedClip = "zedWalk";
            s.log = "轉面對準再推。";
          }
        }
      }

      queued.current = queued.current === "stomp" || queued.current === "shove" ? queued.current : null;
      clamp(s);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (mapIm.complete && mapIm.naturalWidth) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(mapIm, 0, 0, w, h);
      } else {
        ctx.fillStyle = "#1a1410";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.imageSmoothingEnabled = false;
      const draw = (src: string, x: number, y: number, scale = 0.24) => {
        const im = load(src);
        if (!im.complete || !im.naturalWidth) return;
        const sh = Math.round(h * scale);
        const sw = Math.round((im.naturalWidth / im.naturalHeight) * sh);
        ctx.drawImage(im, Math.round(x * w - sw / 2), Math.round(y * h - sh), sw, sh);
      };
      const zScale = s.phase === "down" || s.phase === "stomp" || s.phase === "win" ? 0.2 : 0.24;
      draw(fightFrame(s.zedClip, s.zdir, s.zedFrame), s.zx, s.zy, zScale);
      let heroSrc = heroIdle(s.pdir);
      if (s.heroClip) heroSrc = fightFrame(s.heroClip, s.shoveDir, s.heroFrame);
      else if (s.moving) heroSrc = heroWalk(s.pdir, s.pframe);
      draw(heroSrc, s.px, s.py, 0.26);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const id = setInterval(() => {
      const s = sim.current;
      setUi({ phase: s.phase, hp: s.hp, log: s.log, stomps: s.stomps, dir: s.pdir });
    }, 120);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
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
    const clampN = Math.min(1, m);
    stick.current = { x: (x / m) * clampN, y: (y / m) * clampN, active: clampN > 0.15 };
  };

  const canShove = ui.phase === "hunt" || ui.phase === "windup" || ui.phase === "stagger" || ui.phase === "zedPush";
  const canStomp = ui.phase === "down";
  const ended = ui.phase === "win" || ui.phase === "lose";

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg text-fg">
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="text-[11px] tracking-[0.18em] text-muted uppercase">R&D · 赤手四向 · 不進 v0.1</div>
        <h1 className="font-display text-xl tracking-wide">360° 推開</h1>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          僵屍靠近會雙手推人（四向）。被推會往後跌，面向牠反推才不會被咬。
        </p>
      </header>

      <div className="relative mx-4 overflow-hidden rounded-md border border-border">
        <canvas ref={canvasRef} width={720} height={405} className="block h-auto w-full" />
        <div className="pointer-events-none absolute left-2 top-2 rounded bg-bg/70 px-2 py-1 text-[10px] uppercase tracking-widest">
          {ui.dir} · HP {ui.hp}/{PLAYER_HP} · 踩 {ui.stomps}/{STOMPS_TO_KILL}
        </div>
      </div>

      <p className="px-4 pt-3 text-sm leading-relaxed text-fg/90">{ui.log}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 px-4">
        <button
          type="button"
          disabled={!canShove}
          onClick={() => {
            if (canShove) queued.current = "shove";
          }}
          className={`h-14 rounded-md text-base ${canShove ? "bg-accent text-accent-fg" : "bg-surface text-muted"}`}
        >
          推開
        </button>
        <button
          type="button"
          disabled={!canStomp}
          onClick={() => {
            if (canStomp) queued.current = "stomp";
          }}
          className={`h-14 rounded-md text-base ${canStomp ? "bg-accent text-accent-fg" : "bg-surface text-muted"}`}
        >
          踩
        </button>
      </div>

      <div className="mt-3 flex justify-center">
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
          onPointerUp={() => {
            stick.current = { x: 0, y: 0, active: false };
          }}
          onPointerCancel={() => {
            stick.current = { x: 0, y: 0, active: false };
          }}
        >
          <div className="pointer-events-none absolute inset-0 m-auto size-10 rounded-full bg-accent/70" />
          <span className="pointer-events-none absolute inset-x-0 top-2 text-center text-[10px] text-muted">轉圈</span>
        </div>
      </div>

      <div className="mt-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {ended ? (
          <button type="button" onClick={reset} className="h-12 w-full rounded-md bg-surface text-sm">
            再來一隻（隨機方向）
          </button>
        ) : (
          <a href="/?rd=map" className="flex h-11 items-center justify-center text-[11px] tracking-widest text-muted uppercase">
            回地圖走動
          </a>
        )}
      </div>
    </div>
  );
}
