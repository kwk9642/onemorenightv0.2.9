import type { ReactNode } from "react";
import {
  BookOpen,
  Hammer,
  Home,
  Map as MapIcon,
  Users,
} from "lucide-react";
import { asset } from "@/game/asset";
import { locById, occById, faceById, RESOURCES } from "@/game/data";
import { daysOfFood, living } from "@/game/engine";
import { LOCALES, getLocale, setLocale, t, useT } from "@/game/i18n";
import { useShop } from "@/game/shop";
import { useGame } from "@/game/store";
import { apOf } from "@/game/v03";
import type { GameState, ResourceId, Screen, Survivor } from "@/game/types";
import { cn } from "@/lib/utils";

export function Portrait({
  survivor,
  portrait,
  faceData,
  name,
  tone,
  className,
}: {
  survivor?: Survivor;
  portrait?: string;
  faceData?: string;
  name?: string;
  tone?: string;
  className?: string;
}) {
  const key = survivor?.portrait ?? portrait ?? "";
  const face = faceById(key);
  const frame = useShop((s) => s.frame);
  const label = (survivor?.name ?? name ?? "?").slice(0, 1);
  const img = survivor?.faceData || faceData || (key === "upload" ? "" : face.src);
  const bg = tone ?? face.tone ?? (survivor ? occById(survivor.occupation).tone : "#3a3a3c");
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm bg-surface-2 outline outline-1 -outline-offset-1 outline-fg/10",
        frame === "tape" && "portrait-tape",
        frame === "rust" && "portrait-rust",
        frame === "brass" && "portrait-brass",
        className,
      )}
      style={img ? undefined : { background: bg }}
    >
      {img ? (
        <img src={img.startsWith("data:") || img.startsWith("blob:") ? img : asset(img)} alt="" className="h-full w-full object-cover" />
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
  label,
}: {
  value: number;
  max?: number;
  tone?: "hp" | "hunger" | "thirst" | "stamina" | "accent";
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = {
    hp: "bg-hp",
    hunger: "bg-hunger",
    thirst: "bg-thirst",
    stamina: "bg-stamina",
    accent: "bg-accent",
  }[tone];
  const bar = (
    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
    </div>
  );
  if (!label) {
    return (
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-[10px] tracking-wide text-muted">{label}</span>
      {bar}
    </div>
  );
}

export function ResourceBar({ state }: { state: GameState }) {
  const tt = useT();
  const days = daysOfFood(state);
  return (
    <div className="grid grid-cols-6 gap-1">
      {RESOURCES.map((r) => (
        <div
          key={r.id}
          title={tt(`res.${r.id}.blurb`)}
          className="rounded-sm bg-surface-2 px-1 py-1.5 text-center"
        >
          <div className="text-[10px] tracking-wide text-muted">{tt(`res.${r.id}`)}</div>
          <div className="font-display tabular-nums text-sm text-fg">{state.resources[r.id as ResourceId]}</div>
        </div>
      ))}
      <div className="sr-only">{tt("hub.foodLow", { n: days })}</div>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const paper = useShop((s) => s.paper);
  const founder = useShop((s) => s.founder);
  return (
    <div
      data-paper={paper}
      data-founder={founder ? "1" : "0"}
      className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg text-fg"
    >
      {children}
    </div>
  );
}

export function LangSwitch({ className }: { className?: string }) {
  useT();
  const cur = getLocale();
  return (
    <div className={cn("flex gap-0.5", className)}>
      {LOCALES.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => setLocale(l.id)}
          className={cn(
            "h-8 min-w-8 rounded-md px-1.5 text-[11px] tracking-wide",
            cur === l.id ? "bg-fg text-bg" : "bg-bg/40 text-fg/80",
          )}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

export function TabBar({ screen, onTab }: { screen: Screen; onTab: (s: Screen) => void }) {
  const tt = useT();
  const tabs = [
    { id: "shelter" as const, label: tt("tab.shelter"), icon: Home },
    { id: "roster" as const, label: tt("tab.roster"), icon: Users },
    { id: "build" as const, label: tt("tab.build"), icon: Hammer },
    { id: "map" as const, label: tt("tab.map"), icon: MapIcon },
  ];
  return (
    <nav className="grid grid-cols-4 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => {
        const on = screen === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTab(tab.id)}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] tracking-wide transition-colors duration-[var(--motion-quick)]",
              on ? "text-fg" : "text-muted",
            )}
          >
            <Icon className="size-4" strokeWidth={on ? 2.2 : 1.8} />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

export function TopStatus({ state }: { state: GameState }) {
  const tt = useT();
  const openHelp = useGame((s) => s.openHelp);
  const loc = locById(state.shelter.locationId);
  const n = living(state).length;
  const ap = apOf(state);
  const max = state.maxAP ?? 6;
  return (
    <header className="flex items-end justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
      <div>
        <div className="text-[11px] tracking-[0.18em] text-muted uppercase">{tt("ui.day", { n: state.day })}</div>
        <div className="font-display text-lg leading-tight tracking-wide">{tt(`loc.${loc.id}`)}</div>
        <div className="text-xs text-muted">
          {tt(`state.${loc.region}`)} · {tt("ui.people", { n, cap: state.shelter.capacity })}
        </div>
        <div className={ap < 1 ? "mt-1 text-[11px] tabular-nums text-hunger" : "mt-1 text-[11px] tabular-nums text-muted"}>
          {tt("ap.label")} {ap} / {max}
        </div>
      </div>
      <div className="text-right">
        <div className="mb-1 flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={openHelp}
            className="flex size-11 items-center justify-center rounded-md text-muted"
            aria-label={tt("bible.openBtn")}
          >
            <BookOpen className="size-4" />
          </button>
          <LangSwitch className="justify-end" />
        </div>
        <div className="text-[11px] text-muted">{tt("ui.wall")}</div>
        <div className="font-display tabular-nums text-lg">{state.shelter.barricade}</div>
        <div className="max-w-[9rem] text-[10px] leading-snug text-faint">{tt("hub.wallShort")}</div>
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
