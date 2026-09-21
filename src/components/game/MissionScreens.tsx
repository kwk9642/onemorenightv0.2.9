import { Button } from "@/components/ui/button";
import { asset } from "@/game/asset";
import { locById } from "@/game/data";
import { living } from "@/game/engine";
import { tLoc, useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import type { GameState } from "@/game/types";
import { AP_COST, apOf, threatBand } from "@/game/v03";
import { cn } from "@/lib/utils";
import { Meter, Portrait, Shell } from "./chrome";
import { FindsHint } from "./GearPanel";

export function MissionScreen({ state }: { state: GameState }) {
  const tt = useT();
  const choose = useGame((s) => s.choose);
  const m = state.mission;
  if (!m) return null;
  const loc = locById(m.locationId);
  const ls = state.locations[m.locationId];
  const squad = m.squadIds.map((id) => state.survivors.find((s) => s.id === id)!).filter(Boolean);
  const bagN = Object.values(m.bag).reduce((a, b) => a + b, 0);
  const ap = apOf(state);
  const max = state.maxAP ?? 6;
  const band = threatBand(ls.noiseToday ?? m.noise);

  return (
    <Shell>
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-muted uppercase">
              {tt(`state.${loc.region}`)} · {m.zoneIndex + 1}/{m.zoneCount}
            </div>
            <div className="font-display text-lg tracking-wide">{m.promptTitle}</div>
          </div>
          <div className="text-right text-[11px] tabular-nums text-muted">
            <div className={ap < 1 ? "text-hunger" : undefined}>
              {tt("ap.label")} {ap}/{max}
            </div>
            <div>
              {tt("ui.noise")} {ls.noiseToday ?? m.noise}
            </div>
            <div>
              {tt("threat.label")} {tt(`threat.${band}`)}
            </div>
            <div>
              {tt("ui.z")} {ls.zombies} · {tt("ui.bag")} {bagN}
            </div>
          </div>
        </div>
        {m.finds?.length ? (
          <div className="mt-2">
            <FindsHint finds={m.finds} />
          </div>
        ) : null}
      </header>
      <div className="relative mx-4 h-40 overflow-hidden rounded-md">
        <img src={asset(m.image)} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <p key={m.promptBody} className="ash-prose font-serif text-[1.05rem] leading-[1.65] text-fg">
          {m.promptBody}
        </p>
      </div>
      <div className="space-y-2 px-4">
        {m.choices.map((c) => (
          <Button
            key={c.id}
            variant={c.danger ? "danger" : "secondary"}
            className={cn("h-auto min-h-12 w-full justify-between gap-3 py-3 whitespace-normal")}
            disabled={c.disabled}
            onClick={() => choose(c.id)}
          >
            <span className="text-left">{c.label}</span>
            {c.hint ? <span className="shrink-0 text-right text-[11px] font-normal opacity-70">{c.hint}</span> : null}
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

export function EncounterScreen({ state, overlay }: { state: GameState; overlay?: boolean }) {
  const tt = useT();
  const encounter = useGame((s) => s.encounter);
  const enc = state.encounter;
  if (!enc) return null;
  const full = living(state).length >= state.shelter.capacity;
  const dry = apOf(state) < AP_COST.encounter;
  const moodKey =
    enc.mood === "grateful" ? "enc.grateful" : enc.mood === "wary" ? "enc.wary" : enc.mood === "hurt" ? "enc.hurt" : "enc.hostile";

  const body = (
    <div className="relative min-h-0 flex-1">
      <img src={asset(state.mission?.image ?? "/art/title.jpg")} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-bg/80" />
      <div className="relative flex h-full flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="text-[11px] tracking-[0.2em] text-muted uppercase">{tt("enc.survivor")}</div>
        <div className="mt-4 flex items-end gap-4">
          <Portrait portrait={enc.portrait} name={enc.name} className="size-28 shrink-0" />
          <div>
            <div className="font-display text-2xl tracking-wide">{enc.name}</div>
            <div className="text-sm text-muted">{tt(`occ.${enc.occupation}`)}</div>
            <div className="mt-1 text-[11px] text-faint">{tt("enc.mood", { m: tt(moodKey) })}</div>
          </div>
        </div>
        <p className="mt-5 text-pretty text-sm leading-relaxed">
          {tt(`enc.body.${enc.mood}`, { name: enc.name, occ: tt(`occ.${enc.occupation}`) })}
        </p>
        {full ? <p className="mt-3 text-xs text-hunger">{tt("enc.full")}</p> : null}
        <div className="mt-auto flex flex-col gap-2">
          <Button size="lg" className="w-full" onClick={() => encounter("invite")} disabled={full || dry}>
            {dry ? tt("ap.need", { n: AP_COST.encounter }) : tt("enc.invite")}
          </Button>
          {enc.mood === "wary" ? (
            <Button size="lg" variant="secondary" className="w-full" onClick={() => encounter("trade")} disabled={dry}>
              {dry ? tt("ap.need", { n: AP_COST.encounter }) : tt("enc.trade")}
            </Button>
          ) : null}
          <Button size="lg" variant="secondary" className="w-full" onClick={() => encounter("turn")}>
            {tt("enc.turn")}
          </Button>
          <Button size="lg" variant="danger" className="w-full" onClick={() => encounter("fight")} disabled={dry}>
            {dry ? tt("ap.need", { n: AP_COST.encounter }) : tt("enc.fight")}
          </Button>
        </div>
      </div>
    </div>
  );
  if (overlay) return <div className="flex h-full flex-col">{body}</div>;
  return <Shell>{body}</Shell>;
}

export function OccupyScreen({ state }: { state: GameState }) {
  const tt = useT();
  const occupy = useGame((s) => s.occupy);
  const skipOccupy = useGame((s) => s.skipOccupy);
  const id = state.mapTarget;
  if (!id) return null;
  const loc = locById(id);
  const old = locById(state.shelter.locationId);

  return (
    <Shell>
      <div className="relative min-h-0 flex-1">
        <img src={asset(loc.image)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
        <div className="relative flex h-full flex-col justify-end gap-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16">
          <div className="text-[11px] tracking-[0.22em] text-muted uppercase">{tt("occ.can")}</div>
          <h2 className="font-display text-3xl leading-none tracking-wide">{tLoc(loc.id)}</h2>
          <p className="text-pretty text-sm leading-relaxed text-muted">
            {tt("occ.body", { en: loc.nameEn, state: tt(`state.${loc.region}`), old: tLoc(old.id), n: loc.occupyCapacity })}
            {loc.size === "metro" ? tt("occ.metro") : ""}
          </p>
          <Button size="lg" className="w-full" onClick={occupy}>
            {tt("occ.move")}
          </Button>
          <Button size="lg" variant="secondary" className="w-full" onClick={skipOccupy}>
            {tt("occ.stay")}
          </Button>
        </div>
      </div>
    </Shell>
  );
}

export function EndScreen({ state }: { state: GameState }) {
  const tt = useT();
  const abandon = useGame((s) => s.abandon);
  const openCreate = useGame((s) => s.openCreate);
  const openTitle = useGame((s) => s.openTitle);
  const end = state.ended;
  if (!end) return null;
  const dead = state.survivors.filter((s) => !s.alive);
  const win = end.kind === "win";

  return (
    <Shell>
      <div className="relative min-h-0 flex-1 bg-bg">
        <img
          src={asset(win ? "/art/loc-city.jpg" : "/art/title.jpg")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/70" />
        <div className="relative flex h-full flex-col px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="text-[11px] tracking-[0.24em] text-hp uppercase">{win ? tt("end.city") : tt("end.wipe")}</div>
          <h2 className="mt-2 font-serif text-4xl leading-none">{win ? tt("ui.title") : tt("end.nobody")}</h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed">{end.reason}</p>
          <p className="mt-3 text-xs text-muted">{tt("end.stats", { day: state.day, n: state.occupiedCount, dead: dead.length })}</p>
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
              {tt("end.again")}
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
              {tt("end.title")}
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
