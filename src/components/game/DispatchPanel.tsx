import { useState } from "react";
import { Apple, Compass, Leaf, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DISPATCH_MAX,
  canDispatchPerson,
  canStartDispatch,
  dispatchBlock,
  focusOf,
  focusScore,
} from "@/game/dispatch";
import { living } from "@/game/engine";
import { t, useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import type { DispatchTask, GameState, SkillId, Survivor } from "@/game/types";
import { AP_COST, apOf } from "@/game/v03";
import { cn } from "@/lib/utils";
import { Portrait } from "./chrome";

const TASKS: { id: DispatchTask; icon: typeof Leaf }[] = [
  { id: "herbs", icon: Leaf },
  { id: "supplies", icon: Package },
  { id: "forage", icon: Apple },
  { id: "auto", icon: Compass },
];

const FOCUS_SKILL: Record<string, SkillId> = {
  herbs: "medical",
  supplies: "scavenge",
  forage: "farm",
};

function hintFor(s: Survivor, task: DispatchTask) {
  const focus = focusOf(s, task);
  const skill = FOCUS_SKILL[focus];
  return t("dispatch.hint.fit", {
    name: s.name,
    skill: t(`skill.${skill}`),
    n: s.skills[skill],
    focus: t(`dispatch.focus.${focus}`),
  });
}

export function DispatchPanel({ state }: { state: GameState }) {
  const tt = useT();
  const close = useGame((s) => s.closeDispatch);
  const send = useGame((s) => s.sendDispatch);
  const people = living(state);
  const [task, setTask] = useState<DispatchTask>("auto");
  const [pick, setPick] = useState<string[]>([]);

  const toggle = (id: string) => {
    setPick((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= DISPATCH_MAX) return cur;
      if (cur.length + 1 >= people.length) return cur;
      return [...cur, id];
    });
  };

  const check = canStartDispatch(state, pick);
  const n = pick.length;
  const takeF = Math.min(state.resources.food, n);
  const takeW = Math.min(state.resources.water, n);
  const hungry = n > 0 && (takeF < n || takeW < n);
  const ap = apOf(state);
  const solo = people.length < 2;
  const busy = (state.dispatches ?? []).length > 0;

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-bg text-fg">
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{tt("dispatch.kicker")}</p>
          <button type="button" className="h-11 px-3 text-sm" onClick={close}>
            {tt("dispatch.close")}
          </button>
        </div>
        <h1 className="font-display text-xl tracking-wide">{tt("dispatch.title")}</h1>
        <p className="mt-1 text-xs leading-relaxed text-muted">{tt("dispatch.body")}</p>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {solo ? (
          <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">{tt("dispatch.solo")}</p>
        ) : busy ? (
          <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">{tt("dispatch.busy")}</p>
        ) : (
          <>
            <h2 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("dispatch.pickTask")}</h2>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {TASKS.map((item) => {
                const Icon = item.icon;
                const on = task === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTask(item.id)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors duration-[var(--motion-quick)]",
                      on ? "border-accent bg-surface-2" : "border-border bg-surface",
                    )}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Icon className="size-4 text-muted" strokeWidth={1.8} />
                      <span className="font-display text-sm tracking-wide">{tt(`dispatch.task.${item.id}`)}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted">{tt(`dispatch.task.${item.id}.blurb`)}</p>
                  </button>
                );
              })}
            </div>
            <h2 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("dispatch.pickWho")}</h2>
            <ul className="space-y-2">
              {people.map((s) => {
                const on = pick.includes(s.id);
                const locked = !canDispatchPerson(state, s);
                const score = Math.round(focusScore(s, focusOf(s, task)));
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
                        <div className="text-[11px] leading-snug text-muted">{hintFor(s, task)}</div>
                        {locked ? (
                          <div className="text-[11px] text-hp">{tt(`block.${dispatchBlock(state, s)}`)}</div>
                        ) : score < 3 ? (
                          <div className="text-[11px] text-faint">{tt("dispatch.hint.poor")}</div>
                        ) : null}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      <div className="border-t border-border px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        {n > 0 ? (
          <p className="mb-2 text-[11px] leading-relaxed text-muted">
            {tt("dispatch.pack", { food: takeF, water: takeW })}
            {hungry ? ` · ${tt("dispatch.packShort")}` : ""}
            {ap < AP_COST.dispatch ? ` · ${tt("dispatch.needAp")}` : ""}
          </p>
        ) : (
          <p className="mb-2 text-[11px] text-faint">{tt("dispatch.none")}</p>
        )}
        <Button
          size="lg"
          className="w-full"
          disabled={!check.ok}
          onClick={() => send(pick, task)}
        >
          {tt("dispatch.confirm", { n: Math.max(1, n) })}
        </Button>
      </div>
    </div>
  );
}
