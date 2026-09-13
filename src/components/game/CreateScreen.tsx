import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OCCUPATIONS, START_SHELTERS, TRAITS } from "@/game/data";
import { randomCreate } from "@/game/engine";
import { useGame } from "@/game/store";
import type { OccupationId, TraitId } from "@/game/types";
import { cn } from "@/lib/utils";
import { Portrait, Shell } from "./chrome";

export function CreateScreen() {
  const newGame = useGame((s) => s.newGame);
  const openTitle = useGame((s) => s.openTitle);
  const hasSave = useGame((s) => s.hasSave);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Dale Hale");
  const [occupation, setOccupation] = useState<OccupationId>("firefighter");
  const [posTrait, setPosTrait] = useState<TraitId>("strong");
  const [negTrait, setNegTrait] = useState<TraitId>("insomnia");
  const [shelterId, setShelterId] = useState("farmhouse");

  const occ = OCCUPATIONS.find((o) => o.id === occupation)!;
  const shelter = START_SHELTERS.find((s) => s.id === shelterId)!;
  const pos = TRAITS.filter((t) => t.kind === "pos");
  const neg = TRAITS.filter((t) => t.kind === "neg");

  const roll = () => {
    const { input } = randomCreate();
    setName(input.name);
    setOccupation(input.occupation);
    setPosTrait(input.posTrait);
    setNegTrait(input.negTrait);
    setShelterId(input.shelterId);
  };

  const start = () => {
    newGame({ name, occupation, posTrait, negTrait, shelterId });
  };

  const titles = ["人設", "性格", "落腳"];
  const canNext = useMemo(() => {
    if (step === 0) return !!occupation;
    if (step === 1) return !!name.trim() && posTrait && negTrait && posTrait !== negTrait;
    return !!shelterId;
  }, [step, occupation, name, posTrait, negTrait, shelterId]);

  return (
    <Shell>
      <header className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <button type="button" className="h-11 text-sm text-muted" onClick={() => (step === 0 ? openTitle() : setStep(step - 1))}>
          返回
        </button>
        <div className="text-[11px] tracking-[0.2em] text-muted uppercase">
          {titles[step]} · {step + 1}/3
        </div>
        <button type="button" className="h-11 text-sm text-fg" onClick={roll}>
          隨機
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {step === 0 ? (
          <div className="space-y-2">
            <p className="mb-3 text-sm text-muted">職業決定你怎麼活、也決定你怎麼死。每局不一樣。</p>
            {OCCUPATIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOccupation(o.id)}
                className={cn(
                  "flex w-full items-stretch gap-3 rounded-lg border p-2 text-left transition-colors duration-[var(--motion-quick)]",
                  occupation === o.id ? "border-accent bg-surface-2" : "border-border bg-surface",
                )}
              >
                <Portrait portrait={o.portrait} name={o.name} tone={o.tone} className="size-16 shrink-0" />
                <div className="min-w-0 py-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display tracking-wide">{o.name}</span>
                    <span className="text-[11px] text-faint">{o.nameEn}</span>
                  </div>
                  <p className="text-xs text-muted">{o.blurb}</p>
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Portrait portrait={occ.portrait} name={name} tone={occ.tone} className="size-20 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-[11px] tracking-wide text-muted">姓名</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">{occ.desc}</p>
            <section>
              <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">長處 · 選一</h3>
              <div className="grid grid-cols-2 gap-2">
                {pos.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPosTrait(t.id)}
                    className={cn(
                      "rounded-md border px-3 py-3 text-left",
                      posTrait === t.id ? "border-accent bg-surface-2" : "border-border bg-surface",
                    )}
                  >
                    <div className="text-sm">{t.name}</div>
                    <div className="text-[11px] text-muted">{t.blurb}</div>
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">缺陷 · 選一</h3>
              <div className="grid grid-cols-2 gap-2">
                {neg.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setNegTrait(t.id)}
                    className={cn(
                      "rounded-md border px-3 py-3 text-left",
                      negTrait === t.id ? "border-accent bg-surface-2" : "border-border bg-surface",
                    )}
                  >
                    <div className="text-sm">{t.name}</div>
                    <div className="text-[11px] text-muted">{t.blurb}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">第一夜要有一扇門能鎖。選錯地方，只是死得比較早。 </p>
            {START_SHELTERS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setShelterId(s.id)}
                className={cn(
                  "w-full overflow-hidden rounded-lg border text-left",
                  shelterId === s.id ? "border-accent" : "border-border",
                )}
              >
                <div className="relative h-28">
                  <img src={s.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3">
                    <div className="font-display tracking-wide">{s.name}</div>
                    <div className="text-[11px] text-muted">
                      {s.nameEn} · 容量 {s.capacity}
                    </div>
                  </div>
                </div>
                <p className="px-3 py-2 text-xs leading-relaxed text-muted">{s.desc}</p>
              </button>
            ))}
            <p className="text-xs text-faint">
              {name} · {occ.name} · {TRAITS.find((t) => t.id === posTrait)?.name} / {TRAITS.find((t) => t.id === negTrait)?.name} · {shelter.name}
            </p>
            {hasSave ? <p className="text-xs text-hunger">開始新局會覆蓋目前的存檔。</p> : null}
          </div>
        ) : null}
      </div>

      <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {step < 2 ? (
          <Button className="w-full" size="lg" disabled={!canNext} onClick={() => setStep(step + 1)}>
            下一步
          </Button>
        ) : (
          <Button className="w-full" size="lg" onClick={start}>
            進入庇護所
          </Button>
        )}
      </div>
    </Shell>
  );
}
