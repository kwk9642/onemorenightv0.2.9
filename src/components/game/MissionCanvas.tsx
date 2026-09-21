import { useEffect, useRef, useState } from "react";
import { locById, RESOURCES } from "@/game/data";
import { tLoc, tRoom, useT } from "@/game/i18n";
import { living } from "@/game/engine";
import { MissionRuntime } from "@/game/missionSim";
import { hit, pickup, setTension, swing } from "@/game/audio";
import { useGame } from "@/game/store";
import type { GameState, ResourceId } from "@/game/types";
import { Button } from "@/components/ui/button";
import { EncounterScreen } from "./MissionScreens";
import { Meter } from "./chrome";

export function MissionPlay({ state }: { state: GameState }) {
  return (
    <div className="relative mx-auto h-dvh w-full max-w-md overflow-hidden bg-black text-fg">
      <MissionCanvas state={state} paused={!!state.encounter} />
      {state.encounter ? (
        <div className="absolute inset-0 z-30">
          <EncounterScreen state={state} overlay />
        </div>
      ) : null}
    </div>
  );
}

export function MissionCanvas({ state, paused }: { state: GameState; paused: boolean }) {
  const tt = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rtRef = useRef<MissionRuntime | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const simKill = useGame((s) => s.simKill);
  const simHurt = useGame((s) => s.simHurt);
  const simLoot = useGame((s) => s.simLoot);
  const simEncounter = useGame((s) => s.simEncounter);
  const simExtract = useGame((s) => s.simExtract);
  const simFail = useGame((s) => s.simFail);
  const [hud, setHud] = useState({ room: "", z: 0, near: null as string | null, started: false, toast: "" });
  const stickId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !state.mission) return;
    const rt = new MissionRuntime(
      {
        onKill: (id) => {
          swing();
          simKill(id);
        },
        onHurt: (id, dmg, infect) => {
          hit();
          try {
            navigator.vibrate?.(40);
          } catch {
            /* ignore */
          }
          simHurt(id, dmg, infect);
        },
        onDeath: () => {
          hit();
        },
        onLoot: (got, gear, rng) => {
          pickup();
          simLoot(got, gear, rng);
        },
        onEncounter: () => simEncounter(),
        onExtract: () => simExtract(),
        onSquadWipe: () => simFail(),
        onToast: (msg) => setHud((h) => ({ ...h, toast: msg })),
      },
      () => stateRef.current,
    );
    rtRef.current = rt;
    rt.attach(canvas);
    let world: { start: () => void; stop: () => void; resize: () => void } | null = null;
    let dead = false;
    void import("@/game/world3d").then(({ World3D }) => {
      if (dead || !canvasRef.current) return;
      world = new World3D(canvasRef.current, rt);
      world.start();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.type === "keydown") rt.keys.add(e.code);
      else rt.keys.delete(e.code);
    };
    const onResize = () => world?.resize();
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("resize", onResize);
    const iv = window.setInterval(() => {
      const r = rtRef.current;
      if (!r) return;
      setHud({
        room: r.roomName(),
        z: r.zombiesLeft(),
        near: r.near,
        started: r.started,
        toast: r.toastT > 0 ? r.toast : "",
      });
      setTension(r.threat());
    }, 180);
    return () => {
      dead = true;
      window.clearInterval(iv);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("resize", onResize);
      world?.stop();
      rt.detach();
      rtRef.current = null;
      setTension(0);
    };
    // runtime is per mission mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.mission?.locationId, state.mission?.squadIds.join("|")]);

  useEffect(() => {
    const r = rtRef.current;
    if (!r) return;
    r.paused = paused;
  }, [paused]);

  const m = state.mission;
  if (!m) return null;
  const loc = locById(m.locationId);
  const squad = m.squadIds.map((id) => state.survivors.find((s) => s.id === id)).filter(Boolean);
  const bagN = Object.values(m.bag).reduce((a, b) => a + b, 0);

  const onStick = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width * 0.42);
    const dy = (e.clientY - cy) / (rect.height * 0.42);
    rtRef.current?.setStick(dx, dy);
  };

  const interactLabel =
    hud.near === "exit" ? tt("ui.extract") : hud.near === "npc" ? tt("ui.talk") : hud.near === "loot" ? tt("ui.search") : null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        style={{ touchAction: "none" }}
      />
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 px-3 pt-[max(0.4rem,env(safe-area-inset-top))]">
        <div className="pointer-events-none rounded-md bg-black/55 px-2 py-1 backdrop-blur-sm">
          <div className="font-display text-[13px] leading-none tracking-wide">{hud.room ? tRoom(hud.room) : tLoc(loc.id)}</div>
          <div className="mt-0.5 text-[10px] tabular-nums text-white/70">
            {tLoc(loc.id)} · {tt("ui.z")} {hud.z} · {tt("ui.bag")} {bagN}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {squad[0] ? (
            <div className="w-16 rounded-md bg-black/55 px-1.5 py-1 backdrop-blur-sm">
              <Meter value={squad[0].hp} max={squad[0].maxHp} tone="hp" />
            </div>
          ) : null}
          <button
            type="button"
            className="pointer-events-auto h-9 rounded-md bg-black/55 px-2.5 text-xs text-fg backdrop-blur-sm"
            onClick={() => rtRef.current?.extractNow()}
          >
            {tt("ui.extract")}
          </button>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 bottom-28 z-10 flex justify-center px-4">
        {hud.toast ? (
          <div className="rounded-md bg-black/70 px-3 py-1.5 text-center text-xs text-fg">{hud.toast}</div>
        ) : null}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div
          className="relative size-24 touch-none rounded-full border border-white/15 bg-black/35"
          onPointerDown={(e) => {
            stickId.current = e.pointerId;
            e.currentTarget.setPointerCapture(e.pointerId);
            onStick(e);
          }}
          onPointerMove={(e) => {
            if (stickId.current === e.pointerId) onStick(e);
          }}
          onPointerUp={(e) => {
            stickId.current = null;
            rtRef.current?.setStick(0, 0);
            try {
              e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {
              /* ignore */
            }
          }}
        >
          <div className="absolute inset-7 rounded-full bg-white/15" />
        </div>
        <div className="flex flex-col items-end gap-2">
          {interactLabel ? (
            <Button
              className="h-11 min-w-16"
              variant="secondary"
              onPointerDown={() => {
                const r = rtRef.current;
                if (r) {
                  r.interactHeld = true;
                  r.tryInteract();
                }
              }}
            >
              {interactLabel}
            </Button>
          ) : null}
          <button
            type="button"
            className="size-16 rounded-full bg-danger text-xs font-medium text-fg shadow-lg active:scale-95"
            onPointerDown={() => {
              const r = rtRef.current;
              if (r) r.attackHeld = true;
            }}
            onPointerUp={() => {
              if (rtRef.current) rtRef.current.attackHeld = false;
            }}
            onPointerLeave={() => {
              if (rtRef.current) rtRef.current.attackHeld = false;
            }}
          >
            {tt("ui.attack")}
          </button>
        </div>
      </div>

      {!hud.started ? (
        <button
          type="button"
          className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent px-5 pb-32 text-left"
          onClick={() => {
            const r = rtRef.current;
            if (r) r.started = true;
            setHud((h) => ({ ...h, started: true }));
          }}
        >
          <div className="text-[10px] tracking-[0.22em] text-white/60 uppercase">{tt("ui.mission")}</div>
          <h2 className="font-display text-3xl tracking-wide">{tLoc(loc.id)}</h2>
          <p className="mt-1 text-sm text-white/80">{tt("ui.tap")}</p>
        </button>
      ) : null}

      <div className="sr-only">
        {tt("ui.people", { n: living(state).length, cap: state.shelter.capacity })} ·{" "}
        {RESOURCES.map((r) => `${tt(`res.${r.id}`)}${state.resources[r.id as ResourceId]}`).join(" ")}
      </div>
    </>
  );
}
