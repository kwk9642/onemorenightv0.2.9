import { Button } from "@/components/ui/button";
import { asset } from "@/game/asset";
import { LOCATIONS, locById, sizeLabel } from "@/game/data";
import { canTravel, isDiscovered, living } from "@/game/engine";
import { fuelCost } from "@/game/mode";
import { infectionWord } from "@/game/zombies";
import { isAway } from "@/game/dispatch";
import { bondOf, canMission, moodLabel, relationOf, squadRelationBonus } from "@/game/growth";
import { EDITION } from "@/game/edition";
import { tLoc, useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import type { GameState } from "@/game/types";
import { apOf } from "@/game/v03";
import { cn } from "@/lib/utils";
import { Meter, Portrait, ResourceBar, Shell, TabBar, TopStatus } from "./chrome";
import { UsMap } from "./UsMap";

export function MapScreen({ state }: { state: GameState }) {
  const tt = useT();
  const setScreen = useGame((s) => s.setScreen);
  const setMapTarget = useGame((s) => s.setMapTarget);
  const selected = state.mapTarget;
  const locs = LOCATIONS.filter((l) => isDiscovered(state, l.id));
  const blocked = !living(state).filter((s) => !isAway(state, s.id)).some(canMission);
  const dry = apOf(state) < 1;

  return (
    <Shell>
      <TopStatus state={state} />
      <div className="px-4 pb-2">
        <ResourceBar state={state} />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-3">
        <p className="mb-2 text-xs leading-relaxed text-muted">{tt(`edition.${EDITION}Note`)}</p>
        <p className="mb-2 text-xs leading-relaxed text-muted">{tt("dist.rule")}</p>
        {blocked ? (
          <p className="mb-2 rounded-md border border-hp/40 bg-surface px-3 py-2 text-xs text-hp">{tt("map.block")}</p>
        ) : null}
        {dry ? (
          <p className="mb-2 rounded-md border border-hunger/40 bg-surface px-3 py-2 text-xs text-hunger">{tt("hub.apGone")}</p>
        ) : null}
        <UsMap state={state} visible={locs} selected={selected} onSelect={(id) => {
          if (canTravel(state, id).ok) setMapTarget(id);
        }} />
        <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pb-2">
          {locs.map((loc) => {
            const ls = state.locations[loc.id];
            const home = loc.id === state.shelter.locationId;
            const travel = canTravel(state, loc.id);
            return (
              <button
                key={`list-${loc.id}`}
                type="button"
                disabled={home || !travel.ok}
                onClick={() => setMapTarget(loc.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm disabled:opacity-50",
                  selected === loc.id ? "border-accent bg-surface-2" : "border-border bg-surface",
                )}
              >
                <span>
                  {tLoc(loc.id)}
                  <span className="ml-2 text-[11px] text-muted">
                    {sizeLabel(loc.size)} · {tt(`state.${loc.region}`)} · {tt("long.miles", { n: ls.miles ?? 0 })}
                  </span>
                </span>
                <span className="text-[11px] tabular-nums text-muted">
                  {home
                    ? tt("map.home")
                    : fuelCost(state, loc.id) === 0
                      ? tt("travel.near")
                      : tt("travel.cost", { n: fuelCost(state, loc.id) })}
                  {" · "}
                  {!home && !travel.ok
                    ? travel.reason
                    : home
                      ? ""
                      : ls.zombies > 0
                        ? `${tt("map.zombies", { n: ls.zombies })} · ${tt(`inf.${infectionWord(ls.infection ?? 0)}`)}`
                        : tt("map.cleared")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <TabBar screen={state.screen} onTab={setScreen} />
    </Shell>
  );
}

export function SquadScreen({ state }: { state: GameState }) {
  const tt = useT();
  const setScreen = useGame((s) => s.setScreen);
  const setSquad = useGame((s) => s.setSquad);
  const goMission = useGame((s) => s.goMission);
  const target = state.mapTarget ? locById(state.mapTarget) : null;
  const people = living(state);
  const pick = state.squadPick;
  if (!target) return null;
  const ls = state.locations[target.id];
  const toggle = (id: string) => {
    const s = people.find((p) => p.id === id);
    if (!s) return;
    if (!canMission(s) && !pick.includes(id)) return;
    if (isAway(state, id) && !pick.includes(id)) return;
    if (pick.includes(id)) {
      const next = pick.filter((x) => x !== id);
      if (next.length) setSquad(next);
      return;
    }
    if (pick.length >= 3) return;
    setSquad([...pick, id]);
  };

  const ablePick = pick.filter((id) => {
    const s = people.find((p) => p.id === id);
    return s && canMission(s);
  });

  return (
    <Shell>
      <header className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <button type="button" className="h-11 text-sm text-muted" onClick={() => setScreen("map")}>
          {tt("ui.back")}
        </button>
        <div className="text-[11px] tracking-[0.16em] text-muted uppercase">{tt("squad.title", { n: pick.length })}</div>
        <span className="w-10" />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <img src={asset(target.image)} alt="" className="h-36 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="font-display text-xl tracking-wide">{tLoc(target.id)}</div>
            <p className="text-xs text-muted">
              {tt(`state.${target.region}`)} · {sizeLabel(target.size)} · {tt("map.zombies", { n: ls.zombies })} ·{" "}
              {target.fuel ? tt("squad.fuel", { n: target.fuel }) : tt("squad.walk")}
            </p>
          </div>
        </div>
        <p className="mb-3 text-sm leading-relaxed text-muted">{tt(`loc.${target.id}.desc`)}</p>
        <p className="mb-3 text-xs text-faint">{tt("squad.hint")}</p>
        <ul className="space-y-2">
          {people.map((s) => {
            const on = pick.includes(s.id);
            const mood = moodLabel(s.morale);
            const locked = !canMission(s) || isAway(state, s.id);
            const others = pick.filter((id) => id !== s.id);
            const relBits = others
              .map((id) => {
                const o = people.find((p) => p.id === id);
                if (!o) return null;
                const rel = relationOf(bondOf(state, s.id, o.id));
                return `${o.name}·${rel.name}`;
              })
              .filter(Boolean);
            const bonus = squadRelationBonus(state, s, pick);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  disabled={locked && !on}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border p-2 text-left disabled:opacity-45",
                    on ? "border-accent bg-surface-2" : "border-border bg-surface",
                  )}
                >
                  <Portrait survivor={s} className={cn("size-12", locked && "grayscale")} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">
                      {s.name}
                      <span className="ml-2 text-[11px] text-faint">{tt(`occ.${s.occupation}`)}</span>
                    </div>
                    <div className="text-[11px] text-muted">
                      {tt("skill.combat")} {s.skills.combat} {tt(`skill.rank.${s.skills.combat}`)}
                      {bonus.combat ? `+${bonus.combat}` : ""} · {tt("skill.stealth")} {s.skills.stealth} {tt(`skill.rank.${s.skills.stealth}`)} · {tt(`wep.${s.weapon}`)} ·{" "}
                      {mood.name} {s.morale}
                    </div>
                    {relBits.length ? <div className="text-[11px] text-faint">{relBits.join("  ")}</div> : null}
                    {locked ? (
                      <div className="text-[11px] text-hp">
                        {isAway(state, s.id) ? tt("dispatch.away") : tt("squad.noGo")}
                      </div>
                    ) : null}
                    <div className="mt-1">
                      <Meter value={s.morale} tone={s.morale < 30 ? "hp" : s.morale < 50 ? "hunger" : "stamina"} />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button className="w-full" size="lg" disabled={ablePick.length === 0 || apOf(state) < 1} onClick={goMission}>
          {apOf(state) < 1 ? tt("ap.noneShort") : tt("squad.enter")}
        </Button>
      </div>
    </Shell>
  );
}
