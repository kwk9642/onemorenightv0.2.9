import type { ReactNode } from "react";
import {
  Hammer,
  Home,
  Map as MapIcon,
  Users,
} from "lucide-react";
import { locById, occById, RESOURCES } from "@/game/data";
import { daysOfFood, living } from "@/game/engine";
import type { GameState, ResourceId, Screen, Survivor } from "@/game/types";
import { cn } from "@/lib/utils";

const PORTRAIT_IMG: Record<string, string> = {
  fire: "/art/p-fire.jpg",
};

export function Portrait({
  survivor,
  portrait,
  name,
  tone,
  className,
}: {
  survivor?: Survivor;
  portrait?: string;
  name?: string;
  tone?: string;
  className?: string;
}) {
  const key = survivor?.portrait ?? portrait ?? "";
  const label = (survivor?.name ?? name ?? "?").slice(0, 1);
  const img = PORTRAIT_IMG[key];
  const bg = tone ?? (survivor ? occById(survivor.occupation).tone : "#3a3a3c");
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm bg-surface-2 outline outline-1 -outline-offset-1 outline-fg/10",
        className,
      )}
      style={img ? undefined : { background: bg }}
    >
      {img ? (
        <img src={img} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-2xl tracking-wide text-fg/80">{label}</span>
        </div>
      )}
      {survivor && !survivor.alive ? (
        <div className="absolute inset-0 bg-bg/70" />
      ) : null}
    </div>
  );
}

export function Meter({
  value,
  max = 100,
  tone = "hp",
}: {
  value: number;
  max?: number;
  tone?: "hp" | "hunger" | "thirst" | "stamina" | "accent";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = {
    hp: "bg-hp",
    hunger: "bg-hunger",
    thirst: "bg-thirst",
    stamina: "bg-stamina",
    accent: "bg-accent",
  }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ResourceBar({ state }: { state: GameState }) {
  const days = daysOfFood(state);
  return (
    <div className="grid grid-cols-6 gap-1">
      {RESOURCES.map((r) => (
        <div key={r.id} className="rounded-sm bg-surface-2 px-1 py-1.5 text-center">
          <div className="text-[10px] tracking-wide text-muted">{r.name}</div>
          <div className="font-display tabular-nums text-sm text-fg">{state.resources[r.id as ResourceId]}</div>
        </div>
      ))}
      <div className="sr-only">存糧約 {days} 天</div>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg text-fg">
      {children}
    </div>
  );
}

const TABS: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: "shelter", label: "家園", icon: Home },
  { id: "roster", label: "人員", icon: Users },
  { id: "build", label: "建造", icon: Hammer },
  { id: "map", label: "出征", icon: MapIcon },
];

export function TabBar({ screen, onTab }: { screen: Screen; onTab: (s: Screen) => void }) {
  return (
    <nav className="grid grid-cols-4 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      {TABS.map((t) => {
        const on = screen === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTab(t.id)}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] tracking-wide transition-colors duration-[var(--motion-quick)]",
              on ? "text-fg" : "text-muted",
            )}
          >
            <Icon className="size-4" strokeWidth={on ? 2.2 : 1.8} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

export function TopStatus({ state }: { state: GameState }) {
  const loc = locById(state.shelter.locationId);
  const n = living(state).length;
  return (
    <header className="flex items-end justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
      <div>
        <div className="text-[11px] tracking-[0.18em] text-muted uppercase">第 {state.day} 天</div>
        <div className="font-display text-lg leading-tight tracking-wide">{loc.name}</div>
        <div className="text-xs text-muted">
          {loc.state} · {n}/{state.shelter.capacity} 人
        </div>
      </div>
      <div className="text-right">
        <div className="text-[11px] text-muted">圍牆</div>
        <div className="font-display tabular-nums text-lg">{state.shelter.barricade}</div>
      </div>
    </header>
  );
}

export function LogList({ state }: { state: GameState }) {
  if (state.log.length === 0) return null;
  return (
    <ol className="space-y-2">
      {state.log.slice(0, 8).map((e, i) => (
        <li key={`${e.day}-${i}`} className="text-xs leading-relaxed text-muted">
          <span className="mr-2 tabular-nums text-faint">{e.day}d</span>
          {e.text}
        </li>
      ))}
    </ol>
  );
}
