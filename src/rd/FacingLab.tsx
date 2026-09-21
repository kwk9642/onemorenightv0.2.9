import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CLIPS,
  ClipPlayer,
  clipFrame,
  clipLength,
  drawFrame,
  preloadClips,
  type ActorId,
  type ClipId,
} from "./clip";
import { FACINGS, turn, type Facing } from "./facingDoll";

const ACTORS: { id: ActorId; label: string }[] = [
  { id: "survivor", label: "出征人" },
  { id: "zombie", label: "僵屍" },
  { id: "doll", label: "佔位層" },
];

const CLIP_BTNS: { id: ClipId; label: string }[] = [
  { id: "idle", label: "站" },
  { id: "walk", label: "走" },
  { id: "swing", label: "打" },
];

export function FacingLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const player = useRef(new ClipPlayer());
  const [actor, setActor] = useState<ActorId>("survivor");
  const [clip, setClip] = useState<ClipId>("walk");
  const [facing, setFacing] = useState<Facing>("front");
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState(0);
  const [fps, setFps] = useState(CLIPS.walk.fps);

  useEffect(() => {
    preloadClips(actor);
  }, [actor]);

  useEffect(() => {
    const p = player.current;
    p.actor = actor;
    p.clip = clip;
    p.facing = facing;
    p.fps = fps;
    p.frame = 0;
    p.acc = 0;
    setFrame(0);
  }, [actor, clip, facing, fps]);

  useEffect(() => {
    player.current.playing = playing;
  }, [playing]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = player.current;
      p.tick(dt);
      const c = canvasRef.current?.getContext("2d");
      if (c) drawFrame(c, p.src(), p.extras());
      setFrame(p.frame);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const len = clipLength(actor, clip);
  const pickFrame = (i: number) => {
    player.current.playing = false;
    player.current.frame = i;
    setPlaying(false);
    setFrame(i);
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg text-fg">
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="text-[11px] tracking-[0.18em] text-muted uppercase">R&D · 不進 v0.1</div>
        <h1 className="font-display text-xl tracking-wide">影格串成動作</h1>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          一張圖是姿勢。按 1→2→3→4 的順序、固定間隔播，就是走或打。換面向是換另一排貼圖，不是 3D。
        </p>
      </header>

      <div className="grid grid-cols-3 gap-1 px-4">
        {ACTORS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActor(a.id)}
            className={`h-11 rounded-md text-xs ${actor === a.id ? "bg-accent text-accent-fg" : "bg-surface text-muted"}`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="relative mx-4 mt-3 overflow-hidden rounded-md border border-border bg-[#2a2a2e]">
        <canvas ref={canvasRef} width={360} height={420} className="mx-auto block h-[22rem] w-full" />
        <button
          type="button"
          className="absolute bottom-3 left-3 flex size-11 items-center justify-center rounded-md bg-bg/70 text-lg"
          onClick={() => setFacing((f) => turn(f, -1))}
          aria-label="prev-facing"
        >
          ‹
        </button>
        <button
          type="button"
          className="absolute bottom-3 right-3 flex size-11 items-center justify-center rounded-md bg-bg/70 text-lg"
          onClick={() => setFacing((f) => turn(f, 1))}
          aria-label="next-facing"
        >
          ›
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.16em] text-fg/80 uppercase">
          {facing} · {clip} {frame + 1}/{len}
        </div>
      </div>

      <div className="mt-2 flex gap-1 overflow-x-auto px-4 py-1">
        {Array.from({ length: len }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => pickFrame(i)}
            className={`relative h-20 w-14 shrink-0 overflow-hidden rounded-md border ${
              i === frame ? "border-accent" : "border-border"
            } bg-[#2a2a2e]`}
          >
            <img src={clipFrame(actor, clip, facing, i)} alt="" className="h-full w-full object-contain" />
            <span className="absolute bottom-0.5 right-1 text-[10px] text-fg/80">{i + 1}</span>
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1 px-4">
        {CLIP_BTNS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setClip(c.id);
              setFps(CLIPS[c.id].fps);
            }}
            className={`h-11 rounded-md text-xs ${clip === c.id ? "bg-accent text-accent-fg" : "bg-surface text-muted"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1 px-4">
        {FACINGS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFacing(f)}
            className={`h-11 rounded-md text-xs ${facing === f ? "bg-accent text-accent-fg" : "bg-surface text-muted"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2 px-4">
        <Button className="flex-1" variant={playing ? "default" : "secondary"} onClick={() => setPlaying((v) => !v)}>
          {playing ? "播放中" : "暫停"}
        </Button>
      </div>
      <label className="mt-2 flex items-center gap-3 px-4 text-xs text-muted">
        <span className="w-16">FPS {fps}</span>
        <input
          type="range"
          min={2}
          max={16}
          value={fps}
          onChange={(e) => setFps(Number(e.target.value))}
          className="h-11 flex-1"
        />
      </label>
      <p className="px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 text-[11px] leading-relaxed text-faint">
        下面那一排就是「一系列動的貼圖」。播放器只做一件事：按序、按 FPS 換下一張。打架之後是：走的那一串 + 打的那一串，面向轉了就換另一串。
      </p>
    </div>
  );
}
