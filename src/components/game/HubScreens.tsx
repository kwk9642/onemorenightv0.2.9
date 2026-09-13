import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FACILITIES, JOBS, locById, occById, stanceLabel, TRAITS, WEAPONS } from "@/game/data";
import { daysOfFood, living } from "@/game/engine";
import { useGame } from "@/game/store";
import type { FacilityId, GameState, JobId, Survivor } from "@/game/types";
import { cn } from "@/lib/utils";
import { LogList, Meter, Portrait, ResourceBar, Shell, TabBar, TopStatus } from "./chrome";

function Hub({ state, children }: { state: GameState; children: ReactNode }) {
  const setScreen = useGame((s) => s.setScreen);
  return (
    <Shell>
      <TopStatus state={state} />
      <div className="px-4 pb-3">
        <ResourceBar state={state} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
      <TabBar screen={state.screen} onTab={setScreen} />
    </Shell>
  );
}

export function ShelterScreen({ state }: { state: GameState }) {
  const sleep = useGame((s) => s.sleep);
  const setScreen = useGame((s) => s.setScreen);
  const loc = locById(state.shelter.locationId);
  const people = living(state);
  const days = daysOfFood(state);
  const infected = people.filter((s) => s.infected).length;
  const briefing = infected
    ? `${infected} 人帶著咬傷。藥還剩 ${state.resources.medicine}。`
    : days <= 2
      ? `存糧只夠 ${days} 天。該出門了。`
      : people.length === 1
        ? "就你一個。外面還有人——不一定是朋友。"
        : `${people.length} 個人還活著。圍牆 ${state.shelter.barricade}。`;

  return (
    <Hub state={state}>
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img src={loc.image} alt="" className="h-44 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-[11px] tracking-[0.16em] text-muted uppercase">{loc.nameEn}</div>
          <p className="text-sm leading-relaxed">{briefing}</p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button size="lg" className="w-full" onClick={() => setScreen("map")}>
          出任務
        </Button>
        <Button size="lg" variant="secondary" className="w-full" onClick={sleep}>
          過夜
        </Button>
      </div>
      <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">今日班表</h3>
      <ul className="mb-5 space-y-2">
        {people.map((s) => (
          <li key={s.id} className="flex items-center gap-3 rounded-md bg-surface px-2 py-2">
            <Portrait survivor={s} className="size-10" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">
                {s.name}
                <span className="ml-2 text-[11px] text-faint">{occById(s.occupation).name}</span>
              </div>
              <div className="text-[11px] text-muted">{JOBS.find((j) => j.id === s.job)?.name}</div>
            </div>
            {s.infected ? <span className="text-[11px] text-hp">感染</span> : null}
          </li>
        ))}
      </ul>
      <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">日誌</h3>
      <LogList state={state} />
    </Hub>
  );
}

export function RosterScreen({ state }: { state: GameState }) {
  const job = useGame((s) => s.job);
  const kick = useGame((s) => s.kick);
  const people = state.survivors.filter((s) => s.alive);
  const dead = state.survivors.filter((s) => !s.alive);

  return (
    <Hub state={state}>
      <p className="mb-3 text-sm text-muted">留守的人經營這棟房子。任務期間他們按班表做事。</p>
      <div className="space-y-3">
        {people.map((s) => (
          <SurvivorCard key={s.id} s={s} onJob={(j) => job(s.id, j)} onKick={() => kick(s.id)} />
        ))}
      </div>
      {dead.length ? (
        <div className="mt-6">
          <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">已不在</h3>
          <ul className="space-y-1">
            {dead.map((s) => (
              <li key={s.id} className="text-xs text-faint">
                {s.name} · {s.death}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Hub>
  );
}

function SurvivorCard({
  s,
  onJob,
  onKick,
}: {
  s: Survivor;
  onJob: (j: JobId) => void;
  onKick: () => void;
}) {
  const occ = occById(s.occupation);
  return (
    <article className="rounded-lg border border-border bg-surface p-3">
      <div className="flex gap-3">
        <Portrait survivor={s} className="size-16 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="font-display tracking-wide">{s.name}</div>
            <span className="text-[11px] text-muted">{stanceLabel(s.stance)}</span>
          </div>
          <div className="text-xs text-muted">
            {occ.name} · {WEAPONS[s.weapon].name} · {s.traits.map((t) => TRAITS.find((x) => x.id === t)?.name).join(" / ")}
          </div>
          <div className="mt-2 space-y-1">
            <Meter value={s.hp} max={s.maxHp} tone="hp" />
            <Meter value={s.hunger} tone="hunger" />
            <Meter value={s.thirst} tone="thirst" />
          </div>
        </div>
      </div>
      {s.infected ? <p className="mt-2 text-xs text-hp">傷口在發熱。需要醫務室與藥。</p> : null}
      <div className="mt-3 flex items-center gap-2">
        <label className="sr-only" htmlFor={`job-${s.id}`}>
          工作
        </label>
        <select
          id={`job-${s.id}`}
          value={s.job}
          onChange={(e) => onJob(e.target.value as JobId)}
          className="h-11 min-w-0 flex-1 rounded-md border border-border bg-surface-2 px-3 text-sm text-fg"
        >
          {JOBS.map((j) => (
            <option key={j.id} value={j.id}>
              {j.name}
            </option>
          ))}
        </select>
        {s.stance !== "leader" ? (
          <Button variant="ghost" onClick={onKick}>
            請離
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export function BuildScreen({ state }: { state: GameState }) {
  const upgrade = useGame((s) => s.upgrade);
  return (
    <Hub state={state}>
      <p className="mb-3 text-sm text-muted">升級這棟房子。建材不夠就出門去拆別人的。</p>
      <div className="space-y-2">
        {FACILITIES.map((f) => {
          const lv = state.shelter.facilities[f.id as FacilityId];
          const maxed = lv >= f.max;
          const cost = f.cost.materials * (lv + 1);
          const extra = f.cost.extra ?? {};
          const extraOk = Object.entries(extra).every(
            ([k, v]) => state.resources[k as keyof typeof state.resources] >= (v as number) * (lv + 1),
          );
          const can = !maxed && state.resources.materials >= cost && extraOk;
          return (
            <div key={f.id} className="rounded-lg border border-border bg-surface p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display tracking-wide">
                    {f.name}
                    <span className="ml-2 text-xs text-muted">
                      {lv}/{f.max}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{f.blurb}</p>
                  <p className="mt-1 text-[11px] text-faint">{f.effect}</p>
                </div>
                <Button
                  size="sm"
                  variant={can ? "default" : "secondary"}
                  disabled={!can}
                  onClick={() => upgrade(f.id)}
                >
                  {maxed ? "滿級" : `建材 ${cost}`}
                </Button>
              </div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: f.max }).map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-1 flex-1 rounded-full", i < lv ? "bg-accent" : "bg-border")}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Hub>
  );
}
