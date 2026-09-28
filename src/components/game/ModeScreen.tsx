import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import type { PlayMode } from "@/game/types";
import { SCENARIOS } from "@/game/scenarios";
import { Shell } from "./chrome";

const MODES: PlayMode[] = ["casual", "normal", "extinct", "sandbox"];

export function ModeScreen() {
  const tt = useT();
  const mode = useGame((s) => s.draftMode);
  const box = useGame((s) => s.draftSandbox);
  const scenario = useGame((s) => s.draftScenario);
  const setScenario = useGame((s) => s.setDraftScenario);
  const setMode = useGame((s) => s.setDraftMode);
  const patch = useGame((s) => s.setDraftSandbox);
  const openCreate = useGame((s) => s.openCreate);
  const openTitle = useGame((s) => s.openTitle);
  const [page, setPage] = useState<"root" | "scenarios">("root");
  const picked = scenario ? SCENARIOS.indexOf(scenario) : -1;

  return (
    <Shell>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-6">
        <h1 className="font-serif text-3xl">{page === "scenarios" ? tt("mode.scenarios") : tt("mode.title")}</h1>
        {page === "scenarios" ? (
          <div className="grid gap-2">
            {SCENARIOS.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => setScenario(id)}
                className={
                  scenario === id
                    ? "rounded-md border border-hp bg-surface-2 px-3 py-3 text-left"
                    : "rounded-md border border-border bg-surface px-3 py-3 text-left"
                }
              >
                <div className="font-display tracking-wide">
                  {i + 1}. {tt(`mode.${id}`)}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">{tt(`mode.${id}.body`)}</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              {MODES.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={
                    mode === id
                      ? "rounded-md border border-accent bg-surface-2 px-3 py-3 text-left"
                      : "rounded-md border border-border bg-surface px-3 py-3 text-left"
                  }
                >
                  <div className="font-display tracking-wide">{tt(`mode.${id}`)}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{tt(`mode.${id}.body`)}</p>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage("scenarios")}
                className={
                  scenario
                    ? "rounded-md border border-hp bg-surface-2 px-3 py-3 text-left"
                    : "rounded-md border border-border bg-surface px-3 py-3 text-left"
                }
              >
                <div className="font-display tracking-wide">{tt("mode.scenarios")}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {picked >= 0 ? `${picked + 1}. ${tt(`mode.${scenario}`)}` : tt("mode.scenarios.body")}
                </p>
              </button>
            </div>
            {mode === "sandbox" ? (
          <div className="space-y-3 rounded-md border border-border bg-surface p-3 text-sm">
            <label className="flex items-center justify-between gap-3">
              <span>{tt("mode.hands")}</span>
              <input
                type="number"
                min={0}
                max={5}
                value={box.companions}
                onChange={(e) => patch({ companions: clampN(e.target.value, 0, 5) })}
                className="h-10 w-20 rounded-md border border-border bg-surface-2 px-2 text-right"
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>{tt("mode.stash")}</span>
              <input type="checkbox" checked={box.customStash} onChange={(e) => patch({ customStash: e.target.checked })} />
            </label>
            {box.customStash
              ? (["food", "water", "materials", "medicine", "ammo", "fuel"] as const).map((k) => (
                  <label key={k} className="flex items-center justify-between gap-3">
                    <span>{tt(`res.${k}`)}</span>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={box[k]}
                      onChange={(e) => patch({ [k]: clampN(e.target.value, 0, 40) })}
                      className="h-10 w-20 rounded-md border border-border bg-surface-2 px-2 text-right"
                    />
                  </label>
                ))
              : null}
            <Slide label={tt("mode.loot")} value={box.lootMul} min={0.5} max={2} step={0.1} onChange={(n) => patch({ lootMul: n })} />
            <Slide label={tt("mode.zed")} value={box.zedMul} min={0.5} max={2} step={0.1} onChange={(n) => patch({ zedMul: n })} />
            <Slide label={tt("mode.raid")} value={box.raidCap} min={0} max={0.8} step={0.05} onChange={(n) => patch({ raidCap: n })} />
            <Slide label={tt("mode.ap")} value={box.maxAP} min={4} max={8} step={1} onChange={(n) => patch({ maxAP: n })} />
            <Slide label={tt("mode.infect")} value={box.infectMul} min={0} max={1.5} step={0.1} onChange={(n) => patch({ infectMul: n })} />
            <label className="flex items-center justify-between gap-3">
              <span>{tt("mode.perm")}</span>
              <input type="checkbox" checked={box.permadeath} onChange={(e) => patch({ permadeath: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>{tt("mode.win")}</span>
              <input type="checkbox" checked={box.chicagoWins} onChange={(e) => patch({ chicagoWins: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>{tt("mode.beds")}</span>
              <input type="checkbox" checked={box.ignoreBeds} onChange={(e) => patch({ ignoreBeds: e.target.checked })} />
            </label>
          </div>
        ) : null}
          </>
        )}
        <p className="text-xs leading-relaxed text-muted">{tt("mode.note")}</p>
        <div className="mt-auto flex gap-2 pt-2">
          <Button variant="secondary" className="flex-1" onClick={page === "scenarios" ? () => setPage("root") : openTitle}>
            {tt("mode.back")}
          </Button>
          <Button className="flex-1" onClick={openCreate}>
            {tt("mode.start")}
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function clampN(raw: string, min: number, max: number) {
  const n = Number(raw);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function Slide({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full"
      />
    </label>
  );
}
