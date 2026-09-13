import { Button } from "@/components/ui/button";
import { locById, occById } from "@/game/data";
import { living } from "@/game/engine";
import { useGame } from "@/game/store";
import type { GameState } from "@/game/types";
import { cn } from "@/lib/utils";
import { Meter, Portrait, Shell } from "./chrome";

export function MissionScreen({ state }: { state: GameState }) {
  const choose = useGame((s) => s.choose);
  const m = state.mission;
  if (!m) return null;
  const loc = locById(m.locationId);
  const ls = state.locations[m.locationId];
  const squad = m.squadIds.map((id) => state.survivors.find((s) => s.id === id)!).filter(Boolean);
  const bagN = Object.values(m.bag).reduce((a, b) => a + b, 0);

  return (
    <Shell>
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-muted uppercase">
              {loc.state} · {m.zoneIndex + 1}/{m.zoneCount}
            </div>
            <div className="font-display text-lg tracking-wide">{m.promptTitle}</div>
          </div>
          <div className="text-right text-[11px] tabular-nums text-muted">
            <div>僵屍 {ls.zombies}</div>
            <div>噪音 {m.noise}</div>
            <div>袋 {bagN}</div>
          </div>
        </div>
      </header>
      <div className="relative mx-4 h-36 overflow-hidden rounded-md">
        <img src={m.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <p className="text-pretty text-sm leading-relaxed">{m.promptBody}</p>
      </div>
      <div className="space-y-2 px-4">
        {m.choices.map((c) => (
          <Button
            key={c.id}
            variant={c.danger ? "danger" : "secondary"}
            className={cn("h-auto min-h-12 w-full justify-between py-3 whitespace-normal")}
            disabled={c.disabled}
            onClick={() => choose(c.id)}
          >
            <span>{c.label}</span>
            {c.hint ? <span className="text-[11px] font-normal opacity-70">{c.hint}</span> : null}
          </Button>
        ))}
      </div>
      <ul className="flex gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {squad.map((s) => (
          <li key={s.id} className="flex min-w-0 flex-1 items-center gap-2">
            <Portrait survivor={s} className="size-9 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px]">{s.name}</div>
              <Meter value={s.hp} max={s.maxHp} tone="hp" />
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

export function EncounterScreen({ state }: { state: GameState }) {
  const encounter = useGame((s) => s.encounter);
  const enc = state.encounter;
  if (!enc) return null;
  const occ = occById(enc.occupation);
  const full = living(state).length >= state.shelter.capacity;

  return (
    <Shell>
      <div className="relative min-h-0 flex-1">
        <img src={state.mission?.image ?? "/art/title.jpg"} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-bg/80" />
        <div className="relative flex h-full flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="text-[11px] tracking-[0.2em] text-muted uppercase">倖存者</div>
          <div className="mt-4 flex items-end gap-4">
            <Portrait portrait={enc.portrait} name={enc.name} tone={occ.tone} className="size-28 shrink-0" />
            <div>
              <div className="font-display text-2xl tracking-wide">{enc.name}</div>
              <div className="text-sm text-muted">{occ.name}</div>
              <div className="mt-1 text-[11px] text-faint">
                {enc.mood === "grateful"
                  ? "態度：求生"
                  : enc.mood === "wary"
                    ? "態度：戒備"
                    : enc.mood === "hurt"
                      ? "態度：受傷"
                      : "態度：敵對"}
              </div>
            </div>
          </div>
          <p className="mt-5 text-pretty text-sm leading-relaxed">{enc.body}</p>
          {full ? <p className="mt-3 text-xs text-hunger">庇護所已滿。要帶人走，先升級寢室或請離某人。</p> : null}
          <div className="mt-auto flex flex-col gap-2">
            <Button size="lg" className="w-full" onClick={() => encounter("invite")} disabled={full}>
              帶回去
            </Button>
            {enc.mood === "wary" ? (
              <Button size="lg" variant="secondary" className="w-full" onClick={() => encounter("trade")}>
                交易
              </Button>
            ) : null}
            <Button size="lg" variant="secondary" className="w-full" onClick={() => encounter("turn")}>
              讓開
            </Button>
            <Button size="lg" variant="danger" className="w-full" onClick={() => encounter("fight")}>
              先下手
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export function OccupyScreen({ state }: { state: GameState }) {
  const occupy = useGame((s) => s.occupy);
  const skipOccupy = useGame((s) => s.skipOccupy);
  const id = state.mapTarget;
  if (!id) return null;
  const loc = locById(id);
  const old = locById(state.shelter.locationId);

  return (
    <Shell>
      <div className="relative min-h-0 flex-1">
        <img src={loc.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
        <div className="relative flex h-full flex-col justify-end gap-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16">
          <div className="text-[11px] tracking-[0.22em] text-muted uppercase">可佔領</div>
          <h2 className="font-display text-3xl leading-none tracking-wide">{loc.name}</h2>
          <p className="text-pretty text-sm leading-relaxed text-muted">
            {loc.nameEn}，{loc.state}。僵屍暫時清光。搬離{old.name}，這裡能住 {loc.occupyCapacity} 人。
            {loc.size === "metro" ? " 佔領一座大都會，灰州就有首都了。" : ""}
          </p>
          <Button size="lg" className="w-full" onClick={occupy}>
            搬到這裡
          </Button>
          <Button size="lg" variant="secondary" className="w-full" onClick={skipOccupy}>
            先回舊家
          </Button>
        </div>
      </div>
    </Shell>
  );
}

export function EndScreen({ state }: { state: GameState }) {
  const abandon = useGame((s) => s.abandon);
  const openCreate = useGame((s) => s.openCreate);
  const openTitle = useGame((s) => s.openTitle);
  const end = state.ended;
  if (!end) return null;
  const dead = state.survivors.filter((s) => !s.alive);
  const win = end.kind === "win";

  return (
    <Shell>
      <div className="relative min-h-0 flex-1">
        <img
          src={win ? "/art/loc-city.jpg" : "/art/title.jpg"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-bg/80" />
        <div className="relative flex h-full flex-col px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="text-[11px] tracking-[0.24em] text-muted uppercase">{win ? "一座城" : "全滅"}</div>
          <h2 className="mt-2 font-display text-4xl tracking-wide">{win ? "ASH STATE" : "沒有人了"}</h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed">{end.reason}</p>
          <p className="mt-3 text-xs text-muted">
            存活 {state.day} 天 · 佔領 {state.occupiedCount} 處 · 失去 {dead.length} 人
          </p>
          {dead.length ? (
            <ul className="mt-4 space-y-1">
              {dead.map((s) => (
                <li key={s.id} className="text-xs text-faint">
                  {s.name} · {s.death}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-auto flex flex-col gap-2">
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                abandon();
                openCreate();
              }}
            >
              再活一次
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => {
                abandon();
                openTitle();
              }}
            >
              標題
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
