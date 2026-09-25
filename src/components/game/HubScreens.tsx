import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { asset } from "@/game/asset";
import { FACILITIES, JOBS, locById } from "@/game/data";
import { isAway } from "@/game/dispatch";
import { daysOfFood, living } from "@/game/engine";
import {
  bondOf,
  canMission,
  canWork,
  moodLabel,
  relationOf,
} from "@/game/growth";
import { t, tLoc, useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import type { FacilityId, GameState, JobId, ResourceId, Survivor } from "@/game/types";
import { herbsOf, ailmentsOf } from "@/game/herbs";
import { AP_COST, WALL_REPAIR_MATS, apOf } from "@/game/v03";
import { cn } from "@/lib/utils";
import { LogList, Meter, Portrait, ResourceBar, Shell, TabBar, TopStatus } from "./chrome";
import { GearDoll, StashPanel } from "./GearPanel";
import { SkillList, SkillNotices } from "./SkillPanel";

function Hub({ state, children }: { state: GameState; children: ReactNode }) {
  const setScreen = useGame((s) => s.setScreen);
  const tt = useT();
  return (
    <Shell>
      <TopStatus state={state} />
      <div className="px-4 pb-3">
        <ResourceBar state={state} />
        <p className="mt-2 text-[11px] leading-relaxed text-faint">{tt("hub.resHint")}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
      <TabBar screen={state.screen} onTab={setScreen} />
    </Shell>
  );
}

function HerbRow({ state }: { state: GameState }) {
  const tt = useT();
  const dose = useGame((s) => s.dose);
  const people = living(state);
  const herbs = herbsOf(state);
  const sick = people.filter((s) => ailmentsOf(s).length);
  if (!sick.length && !herbs.length) return null;
  return (
    <div className="mb-4 space-y-2 rounded-md border border-border bg-surface px-3 py-2">
      {sick.map((s) => (
        <p key={s.id} className="text-xs text-hp">
          {s.name} · {ailmentsOf(s).map((a) => tt(`herb.ail.${a.id}`)).join(" · ")}
        </p>
      ))}
      {herbs.map((h, i) => (
        <div key={`${h.id}-${h.known}-${i}`} className="flex flex-wrap items-center gap-2 text-xs">
          <span>{h.known ? tt(`herb.id.${h.id}`) : tt("herb.unknown")} ×{h.qty}</span>
          {people.map((s) => (
            <span key={s.id} className="flex gap-1">
              <button type="button" className="h-8 rounded border border-border px-2" onClick={() => dose(s.id, i, "poultice")}>
                {tt("herb.poultice")}
              </button>
              <button type="button" className="h-8 rounded border border-border px-2" onClick={() => dose(s.id, i, "brew")}>
                {tt("herb.brew")}
              </button>
            </span>
          ))}
        </div>
      ))}
      <p className="text-[11px] text-muted">{tt("herb.bite")}</p>
    </div>
  );
}

export function ShelterScreen({ state }: { state: GameState }) {
  const tt = useT();
  const sleep = useGame((s) => s.sleep);
  const setScreen = useGame((s) => s.setScreen);
  const clearNotices = useGame((s) => s.clearNotices);
  const parkTitle = useGame((s) => s.parkTitle);
  const openHelp = useGame((s) => s.openHelp);
  const openLog = useGame((s) => s.openLog);
  const openDispatch = useGame((s) => s.openDispatch);
  const loc = locById(state.shelter.locationId);
  const people = living(state);
  const days = daysOfFood(state);
  const infected = people.filter((s) => s.infected).length;
  const crushed = people.filter((s) => !canMission(s));
  const ap = apOf(state);
  const briefing =
    ap < 1
      ? tt("hub.apGone")
      : crushed.length === people.length
        ? tt("hub.noGo")
        : infected
          ? tt("hub.bitten", { n: infected, med: state.resources.medicine })
          : days <= 2
            ? tt("hub.foodLow", { n: days })
            : people.length === 1
              ? tt("hub.alone")
              : tt("hub.alive", { n: people.length, wall: state.shelter.barricade });

  return (
    <Hub state={state}>
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img src={asset(loc.image)} alt="" className="h-40 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-[11px] tracking-[0.16em] text-muted uppercase">{loc.nameEn}</div>
          <p className="text-sm leading-relaxed">{briefing}</p>
        </div>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-muted">
        {state.day >= 20 ? tt("hub.aimLate", { loc: tLoc("chicago") }) : tt("hub.aim")}
      </p>
      <SkillNotices notices={state.notices ?? []} onDismiss={clearNotices} />
      {crushed.length ? (
        <p className="mb-3 rounded-md border border-hp/40 bg-surface px-3 py-2 text-xs text-hp">
          {crushed.map((s) => s.name).join("、")} {tt("hub.moodLow")}
          {crushed.length === people.length ? tt("hub.moodNoMission") : tt("hub.moodNoSquad")}
        </p>
      ) : null}
      <HerbRow state={state} />
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button size="lg" className="w-full" onClick={() => setScreen("map")} disabled={ap < 1 || crushed.length === people.length}>
          {ap < 1 ? tt("ap.noneShort") : tt("ui.goMission")}
        </Button>
        <Button size="lg" variant="secondary" className="w-full" onClick={sleep}>
          {tt("ui.overnight")}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="col-span-2 w-full"
          onClick={openDispatch}
        >
          {tt("dispatch.open")}
        </Button>
      </div>
      {(state.dispatches ?? []).length ? (
        <ul className="mb-4 space-y-2">
          {state.dispatches.map((p) => {
            const names = p.memberIds
              .map((id) => state.survivors.find((s) => s.id === id)?.name)
              .filter(Boolean)
              .join(tt("ui.comma"));
            return (
              <li key={p.id} className="rounded-md border border-border bg-surface px-3 py-2">
                <div className="text-sm">{tt("dispatch.out", { names, task: tt(`dispatch.task.${p.task}`) })}</div>
                <div className="text-[11px] text-muted">
                  {p.delayed || p.returnDay > state.day ? tt("dispatch.stillOut") : tt("dispatch.backTonight")}
                </div>
              </li>
            );
          })}
        </ul>
      ) : people.length < 2 ? (
        <p className="mb-4 text-[11px] leading-relaxed text-faint">{tt("dispatch.solo")}</p>
      ) : (
        <p className="mb-4 text-[11px] leading-relaxed text-faint">{tt("dispatch.openHint")}</p>
      )}
      <div className="mb-4 flex gap-4">
        <button
          type="button"
          onClick={openHelp}
          className="text-left text-[11px] tracking-[0.16em] text-muted uppercase"
        >
          {tt("bible.openBtn")}
        </button>
        <button
          type="button"
          onClick={openLog}
          className="text-left text-[11px] tracking-[0.16em] text-muted uppercase"
        >
          {tt("log.openBtn")}
        </button>
        <button
          type="button"
          onClick={parkTitle}
          className="text-left text-[11px] tracking-[0.16em] text-muted uppercase"
        >
          {tt("ui.title")}
        </button>
      </div>
      <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("hub.plan")}</h3>
      <ShelterPlan state={state} />
      <h3 className="mb-2 mt-4 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("hub.jobs")}</h3>
      <ul className="mb-5 space-y-2">
        {people.map((s) => {
          const mood = moodLabel(s.morale);
          const out = isAway(state, s.id);
          return (
            <li key={s.id} className="flex items-center gap-3 rounded-md bg-surface px-2 py-2">
              <Portrait survivor={s} className={cn("size-10", (!canWork(s) || out) && "grayscale")} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">
                  {s.name}
                  <span className="ml-2 text-[11px] text-faint">{tt(`occ.${s.occupation}`)}</span>
                </div>
                <div className="text-[11px] text-muted">
                  {out ? tt("dispatch.away") : tt(`job.${s.job}`)} · {mood.name} {s.morale}
                </div>
              </div>
              {s.infected ? <span className="text-[11px] text-hp">{tt("ui.infected")}</span> : null}
            </li>
          );
        })}
      </ul>
      <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("hub.log")}</h3>
      <LogList state={state} />
    </Hub>
  );
}

const PLAN: { id: FacilityId; name: string; jobs: JobId[] }[] = [
  { id: "beds", name: "寢室", jobs: ["rest"] },
  { id: "kitchen", name: "廚房", jobs: ["cook"] },
  { id: "garden", name: "菜園", jobs: ["farm"] },
  { id: "workshop", name: "工坊", jobs: ["repair", "craft"] },
  { id: "infirmary", name: "醫務", jobs: ["tend"] },
  { id: "radio", name: "電台", jobs: ["radio"] },
  { id: "watch", name: "哨塔", jobs: ["guard"] },
  { id: "water", name: "水塔", jobs: [] },
];

function ShelterPlan({ state }: { state: GameState }) {
  const setScreen = useGame((s) => s.setScreen);
  const people = living(state);
  return (
    <div className="mb-4 grid grid-cols-4 gap-1.5">
      {PLAN.map((room) => {
        const lv = state.shelter.facilities[room.id];
        const here = people.filter(
          (p) =>
            !isAway(state, p.id) &&
            (room.jobs.includes(p.job) || (room.id === "beds" && p.job === "rest")),
        );
        return (
          <button
            key={room.id}
            type="button"
            onClick={() => setScreen(lv ? "roster" : "build")}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border p-1 text-left",
              lv ? "border-border bg-surface-2" : "border-border/60 bg-surface opacity-70",
            )}
          >
            <div className="text-[9px] tracking-wide text-muted">{t(`fac.${room.id}`)}</div>
            <div className="text-[9px] text-faint">{lv ? t("hub.lv", { n: lv }) : t("hub.unbuilt")}</div>
            <div className="absolute bottom-1 left-1 flex -space-x-1">
              {here.slice(0, 3).map((p) => (
                <Portrait key={p.id} survivor={p} className="size-6" />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function RosterScreen({ state }: { state: GameState }) {
  const tt = useT();
  const job = useGame((s) => s.job);
  const kick = useGame((s) => s.kick);
  const openDispatch = useGame((s) => s.openDispatch);
  const people = state.survivors.filter((s) => s.alive);
  const dead = state.survivors.filter((s) => !s.alive);

  return (
    <Hub state={state}>
      <p className="mb-3 text-sm text-muted">{tt("roster.hint")}</p>
      {people.length >= 2 ? (
        <Button variant="secondary" className="mb-3 w-full" onClick={openDispatch}>
          {tt("dispatch.open")}
        </Button>
      ) : (
        <p className="mb-3 text-[11px] text-faint">{tt("dispatch.solo")}</p>
      )}
      <div className="space-y-3">
        {people.map((s) => (
          <SurvivorCard key={s.id} state={state} s={s} onJob={(j) => job(s.id, j)} onKick={() => kick(s.id)} />
        ))}
      </div>
      <h3 className="mb-2 mt-5 text-[11px] tracking-[0.16em] text-muted uppercase">
        {tt("gear.stash")} · {state.stash?.length ?? 0}
      </h3>
      <StashPanel state={state} />
      {dead.length ? (
        <div className="mt-6">
          <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("roster.gone")}</h3>
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
  state,
  s,
  onJob,
  onKick,
}: {
  state: GameState;
  s: Survivor;
  onJob: (j: JobId) => void;
  onKick: () => void;
}) {
  const tt = useT();
  const mood = moodLabel(s.morale);
  const others = living(state).filter((o) => o.id !== s.id);
  const out = isAway(state, s.id);
  return (
    <article className="rounded-lg border border-border bg-surface p-3">
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-display tracking-wide">{s.name}</div>
        <span className="text-[11px] text-muted">
          {mood.name} {s.morale}
        </span>
      </div>
      <div className="text-xs text-muted">
        {tt(`occ.${s.occupation}`)} · {s.traits.map((tr) => tt(`trait.${tr}`)).join(" / ")}
      </div>
      <div className="mt-2 space-y-1">
        <Meter value={s.hp} max={s.maxHp} tone="hp" label={tt("meter.hp")} />
        <Meter value={s.hunger} tone="hunger" label={tt("meter.hunger")} />
        <Meter value={s.thirst} tone="thirst" label={tt("meter.thirst")} />
        <Meter
          value={s.morale}
          tone={s.morale < 30 ? "hp" : s.morale < 50 ? "hunger" : "stamina"}
          label={tt("meter.morale")}
        />
      </div>
      <GearDoll state={state} s={s} />
      {s.infected ? <p className="mt-2 text-xs text-hp">{tt("roster.wound")}</p> : null}
      {!canWork(s) ? <p className="mt-2 text-xs text-hp">{tt("roster.noWork")}</p> : null}
      {out ? <p className="mt-2 text-xs text-hunger">{tt("dispatch.away")}</p> : null}
      <div className="mt-3">
        <SkillList levels={s.skills} xp={s.skillXp} base={s.skillBase} traits={s.traits} last={s.lastSkillUp} />
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-faint">{tt("roster.skills")}</p>
      {others.length ? (
        <ul className="mt-3 space-y-1">
          {others.map((o) => {
            const rel = relationOf(bondOf(state, s.id, o.id));
            const n = bondOf(state, s.id, o.id);
            return (
              <li key={o.id} className="flex items-center justify-between text-[11px] text-muted">
                <span>
                  {o.name}
                  <span className="ml-2 text-faint">{rel.name}</span>
                </span>
                <span className="tabular-nums">{n}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
      <div className="mt-3 flex items-center gap-2">
        <label className="sr-only" htmlFor={`job-${s.id}`}>
          {tt("roster.job")}
        </label>
        <select
          id={`job-${s.id}`}
          value={s.job}
          onChange={(e) => onJob(e.target.value as JobId)}
          disabled={out}
          className="h-11 min-w-0 flex-1 rounded-md border border-border bg-surface-2 px-3 text-sm text-fg disabled:opacity-50"
        >
          {JOBS.map((j) => (
            <option key={j.id} value={j.id} disabled={j.id !== "rest" && !canWork(s)}>
              {tt(`job.${j.id}`)}
              {j.id !== "rest" && !canWork(s) ? tt("roster.moodNeed") : ""}
            </option>
          ))}
        </select>
        {s.stance !== "leader" ? (
          <Button variant="ghost" onClick={onKick}>
            {tt("roster.kick")}
          </Button>
        ) : null}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted">{tt(`job.${s.job}.blurb`)}</p>
    </article>
  );
}

export function BuildScreen({ state }: { state: GameState }) {
  const tt = useT();
  const upgrade = useGame((s) => s.upgrade);
  const repair = useGame((s) => s.repairWall);
  const ap = apOf(state);
  const canRepair = ap >= AP_COST.repairWall && state.resources.materials >= WALL_REPAIR_MATS;
  return (
    <Hub state={state}>
      <p className="mb-3 text-sm text-muted">{tt("build.hint")}</p>
      <p className="mb-3 rounded-md border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-muted">
        {tt("hub.wallNote", { n: state.shelter.barricade })}
      </p>
      <div className="mb-3 rounded-lg border border-border bg-surface p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-display tracking-wide">{tt("build.repairWall")}</div>
            <p className="text-xs text-muted">{tt("build.repairWallHint")}</p>
          </div>
          <Button size="sm" variant={canRepair ? "default" : "secondary"} disabled={!canRepair} onClick={repair}>
            {ap < AP_COST.repairWall
              ? tt("build.apNeed")
              : state.resources.materials < WALL_REPAIR_MATS
                ? tt("build.lack", { res: tt("res.materials"), n: WALL_REPAIR_MATS - state.resources.materials })
                : tt("build.repairWallGo")}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {FACILITIES.map((f) => {
          const lv = state.shelter.facilities[f.id as FacilityId];
          const maxed = lv >= f.max;
          const mul = lv + 1;
          const items: { id: ResourceId; n: number }[] = [{ id: "materials", n: f.cost.materials * mul }];
          for (const [k, v] of Object.entries(f.cost.extra ?? {})) {
            items.push({ id: k as ResourceId, n: (v as number) * mul });
          }
          const lack = items.find((it) => state.resources[it.id] < it.n);
          const apShort = ap < AP_COST.build;
          const can = !maxed && !lack && !apShort;
          const costText = items.map((it) => tt("build.cost", { res: tt(`res.${it.id}`), n: it.n })).join(" · ");
          return (
            <div key={f.id} className="rounded-lg border border-border bg-surface p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display tracking-wide">
                    {tt(`fac.${f.id}`)}
                    <span className="ml-2 text-xs text-muted">
                      {lv}/{f.max}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{tt(`fac.${f.id}.blurb`)}</p>
                  <p className="mt-1 text-[11px] text-faint">{tt(`fac.${f.id}.effect`)}</p>
                  {!maxed ? (
                    <p className="mt-1 text-[11px] text-muted">
                      {tt("build.need")} {costText} · {tt("build.apCost", { n: AP_COST.build })}
                    </p>
                  ) : null}
                </div>
                <Button
                  size="sm"
                  variant={can ? "default" : "secondary"}
                  disabled={!can}
                  onClick={() => upgrade(f.id)}
                >
                  {maxed
                    ? tt("build.max")
                    : apShort
                      ? tt("build.apNeed")
                      : lack
                        ? tt("build.lack", { res: tt(`res.${lack.id}`), n: lack.n - state.resources[lack.id] })
                        : costText}
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
