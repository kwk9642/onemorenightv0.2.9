import { Button } from "@/components/ui/button";
import { LOCATIONS, locById, occById, sizeLabel, WEAPONS } from "@/game/data";
import { canTravel, isDiscovered, living } from "@/game/engine";
import { useGame } from "@/game/store";
import type { GameState } from "@/game/types";
import { cn } from "@/lib/utils";
import { Portrait, ResourceBar, Shell, TabBar, TopStatus } from "./chrome";

const STATES = ["肯塔基", "俄亥俄", "印第安納", "田納西", "密蘇里", "伊利諾"];

export function MapScreen({ state }: { state: GameState }) {
  const setScreen = useGame((s) => s.setScreen);
  const setMapTarget = useGame((s) => s.setMapTarget);

  return (
    <Shell>
      <TopStatus state={state} />
      <div className="px-4 pb-3">
        <ResourceBar state={state} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <p className="mb-4 text-sm leading-relaxed text-muted">
          美國中西部還在地圖上。清光一個地點的僵屍，就能搬進去，換成更大的家。
        </p>
        {STATES.map((st) => {
          const list = LOCATIONS.filter((l) => l.state === st && isDiscovered(state, l.id));
          if (list.length === 0) return null;
          return (
            <section key={st} className="mb-5">
              <h3 className="mb-2 text-[11px] tracking-[0.2em] text-muted uppercase">{st}</h3>
              <div className="space-y-2">
                {list.map((loc) => {
                  const ls = state.locations[loc.id];
                  const home = loc.id === state.shelter.locationId;
                  const travel = canTravel(state, loc.id);
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      disabled={home || !travel.ok}
                      onClick={() => setMapTarget(loc.id)}
                      className={cn(
                        "w-full overflow-hidden rounded-lg border text-left disabled:opacity-50",
                        ls.cleared ? "border-stamina/40" : "border-border",
                      )}
                    >
                      <div className="relative h-24">
                        <img src={loc.image} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg to-bg/20" />
                        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
                          <div>
                            <div className="font-display tracking-wide">{loc.name}</div>
                            <div className="text-[11px] text-muted">
                              {sizeLabel(loc.size)} · {loc.nameEn}
                            </div>
                          </div>
                          <div className="text-right text-[11px] tabular-nums text-muted">
                            {home ? "目前的家" : ls.cleared ? "已清場" : `僵屍 ${ls.zombies}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted">
                        <span>{loc.blurb}</span>
                        <span>{home ? "" : loc.fuel > 0 ? `燃油 ${loc.fuel}` : "步行"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        <p className="text-xs text-faint">未探明的州與城市，需要無線電，或先佔領鄰近據點。</p>
      </div>
      <TabBar screen={state.screen} onTab={setScreen} />
    </Shell>
  );
}

export function SquadScreen({ state }: { state: GameState }) {
  const setScreen = useGame((s) => s.setScreen);
  const setSquad = useGame((s) => s.setSquad);
  const goMission = useGame((s) => s.goMission);
  const target = state.mapTarget ? locById(state.mapTarget) : null;
  const people = living(state);
  const pick = state.squadPick;
  if (!target) return null;
  const ls = state.locations[target.id];
  const toggle = (id: string) => {
    if (pick.includes(id)) {
      const next = pick.filter((x) => x !== id);
      if (next.length) setSquad(next);
      return;
    }
    if (pick.length >= 3) return;
    setSquad([...pick, id]);
  };

  return (
    <Shell>
      <header className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <button type="button" className="h-11 text-sm text-muted" onClick={() => setScreen("map")}>
          返回
        </button>
        <div className="text-[11px] tracking-[0.16em] text-muted uppercase">編隊 · {pick.length}/3</div>
        <span className="w-10" />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <img src={target.image} alt="" className="h-36 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="font-display text-xl tracking-wide">{target.name}</div>
            <p className="text-xs text-muted">
              {target.state} · {sizeLabel(target.size)} · 僵屍 {ls.zombies} · {target.fuel ? `燃油 ${target.fuel}` : "步行可到"}
            </p>
          </div>
        </div>
        <p className="mb-3 text-sm leading-relaxed text-muted">{target.desc}</p>
        <p className="mb-3 text-xs text-faint">最多帶三人。留下的人過夜時會按班表做事。</p>
        <ul className="space-y-2">
          {people.map((s) => {
            const on = pick.includes(s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border p-2 text-left",
                    on ? "border-accent bg-surface-2" : "border-border bg-surface",
                  )}
                >
                  <Portrait survivor={s} className="size-12" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">
                      {s.name}
                      <span className="ml-2 text-[11px] text-faint">{occById(s.occupation).name}</span>
                    </div>
                    <div className="text-[11px] text-muted">
                      戰鬥 {s.skills.combat} · 潛行 {s.skills.stealth} · 搜刮 {s.skills.scavenge} · {WEAPONS[s.weapon].name}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button className="w-full" size="lg" disabled={pick.length === 0} onClick={goMission}>
          出發
        </Button>
      </div>
    </Shell>
  );
}
