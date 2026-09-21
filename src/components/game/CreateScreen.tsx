import { useMemo, useState } from "react";
import {
  CookingPot,
  Flame,
  KeyRound,
  Medal,
  Shield,
  Sprout,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { asset } from "@/game/asset";
import {
  FACES,
  OCCUPATIONS,
  START_SHELTERS,
  TRAITS,
  faceById,
  occById,
  pickerTraits,
  poolOf,
  traitById,
  withOccupationTraits,
} from "@/game/data";
import { randomCreate } from "@/game/engine";
import { SKILL_KEYS, allocTotal, composeSkills, emptySkills, skillBoostLine, startXpMul, xpToNext } from "@/game/growth";
import { useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import type { CreateInput, OccupationId, SkillId, Skills, TraitId } from "@/game/types";
import { cn } from "@/lib/utils";
import { LangSwitch, Portrait, Shell } from "./chrome";

const OCC_ICON = {
  firefighter: Flame,
  doctor: Stethoscope,
  officer: Shield,
  chef: CookingPot,
  mechanic: Wrench,
  farmer: Sprout,
  veteran: Medal,
  burglar: KeyRound,
} as const;

function fmtPool(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}

export function CreateScreen() {
  const tt = useT();
  const newGame = useGame((s) => s.newGame);
  const openTitle = useGame((s) => s.openTitle);
  const hasSave = useGame((s) => s.hasSave);
  const [mode, setMode] = useState<"wizard" | "result">("wizard");
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Dale Hale");
  const [portrait, setPortrait] = useState("river");
  const [occupation, setOccupation] = useState<OccupationId>("firefighter");
  const [traits, setTraits] = useState<TraitId[]>([]);
  const [alloc, setAlloc] = useState<Skills>(emptySkills());
  const [shelterId, setShelterId] = useState("farmhouse");

  const occ = occById(occupation);
  const face = faceById(portrait);
  const shelter = START_SHELTERS.find((s) => s.id === shelterId)!;
  const pickable = pickerTraits();
  const pos = pickable.filter((x) => x.kind === "pos").sort((a, b) => a.points - b.points);
  const neg = pickable.filter((x) => x.kind === "neg").sort((a, b) => b.points - a.points);
  const mods = traits.map(traitById);
  const pool = poolOf(occupation, traits);
  const spent = allocTotal(alloc);
  const left = pool - spent;
  const preview = composeSkills(occ.skills, mods, alloc);
  const granted = occ.granted;
  const picked = traits.filter((id) => !granted.includes(id));

  const applyInput = (input: CreateInput) => {
    setName(input.name);
    setOccupation(input.occupation);
    setPortrait(input.portrait);
    setTraits(withOccupationTraits(input.occupation, input.traits));
    setAlloc({ ...emptySkills(), ...input.alloc });
    setShelterId(input.shelterId);
  };

  const toggleTrait = (id: TraitId) => {
    const def = traitById(id);
    if (def.kind === "occ") return;
    const on = traits.includes(id);
    let next = on ? traits.filter((x) => x !== id) : [...traits, id];
    if (!on) {
      const blocked = def.excludes ?? [];
      next = next.filter((x) => !blocked.includes(x));
      for (const other of TRAITS) {
        if ((other.excludes ?? []).includes(id)) next = next.filter((x) => x !== other.id);
      }
    }
    setTraits(withOccupationTraits(occupation, next));
    setAlloc(emptySkills());
  };

  const bump = (k: SkillId, d: number) => {
    const next = { ...alloc, [k]: Math.max(0, (alloc[k] ?? 0) + d) };
    if (allocTotal(next) > pool) return;
    if (preview[k] + d > 10 && d > 0) return;
    setAlloc(next);
  };

  const roll = () => {
    const { input } = randomCreate();
    applyInput(input);
    setMode("result");
  };

  const start = () => {
    newGame({ name, occupation, portrait, traits, alloc, shelterId });
  };

  const titles = [tt("create.face"), tt("create.occ"), tt("create.traits"), tt("create.skills"), tt("create.shelter")];
  const canNext = useMemo(() => {
    if (step === 0) return !!portrait && !!name.trim();
    if (step === 1) return !!occupation;
    if (step === 2) return pool >= 0;
    if (step === 3) return left >= 0;
    return !!shelterId;
  }, [step, portrait, name, occupation, pool, left, shelterId]);

  return (
    <Shell>
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="h-11 text-sm text-muted"
            onClick={() => {
              if (mode === "result") {
                openTitle();
                return;
              }
              if (step === 0) openTitle();
              else setStep(step - 1);
            }}
          >
            {tt("ui.back")}
          </button>
          <div className="text-[11px] tracking-[0.2em] text-muted uppercase">
            {mode === "result" ? tt("create.rolled") : `${titles[step]} · ${step + 1}/5`}
          </div>
          <button type="button" className="h-11 text-sm text-fg" onClick={roll}>
            {mode === "result" ? tt("create.reroll") : tt("ui.random")}
          </button>
        </div>
        <LangSwitch className="mt-1 justify-end" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {mode === "result" ? (
          <ResultCard
            name={name}
            portrait={portrait}
            occupation={occupation}
            traits={traits}
            granted={granted}
            picked={picked}
            preview={preview}
            shelterId={shelterId}
            pool={pool}
            left={left}
          />
        ) : null}

        {mode === "wizard" && step === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">{tt("create.faceHint")}</p>
            <div className="flex items-end gap-3">
              <Portrait portrait={portrait} name={name} tone={face.tone} className="h-36 w-28 shrink-0" />
              <div className="min-w-0 flex-1 pb-1">
                <div className="mb-1 text-[11px] tracking-wide text-muted">{tt("create.name")}</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {FACES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPortrait(f.id)}
                  className={cn(
                    "overflow-hidden rounded-md border",
                    portrait === f.id ? "border-accent ring-1 ring-accent" : "border-border",
                  )}
                >
                  <img src={asset(f.src)} alt="" className="aspect-[3/4] h-auto w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {mode === "wizard" && step === 1 ? (
          <div className="space-y-2">
            <div className="mb-3 flex items-center gap-3">
              <Portrait portrait={portrait} name={name} tone={face.tone} className="h-16 w-12 shrink-0" />
              <div className="min-w-0">
                <div className="font-display tracking-wide">{name}</div>
                <p className="text-sm text-muted">{tt("create.occHint")}</p>
              </div>
            </div>
            {OCCUPATIONS.map((o) => {
              const Icon = OCC_ICON[o.id];
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setOccupation(o.id);
                    setTraits(withOccupationTraits(o.id, traits));
                    setAlloc(emptySkills());
                  }}
                  className={cn(
                    "flex w-full items-stretch gap-3 rounded-lg border p-2 text-left transition-colors duration-[var(--motion-quick)]",
                    occupation === o.id ? "border-accent bg-surface-2" : "border-border bg-surface",
                  )}
                >
                  <div
                    className="flex w-12 shrink-0 items-center justify-center rounded-md"
                    style={{ background: o.tone }}
                  >
                    <Icon className="size-5 text-fg" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 py-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display tracking-wide">{tt(`occ.${o.id}`)}</span>
                      {tt(`occ.${o.id}.en`) !== tt(`occ.${o.id}`) ? (
                        <span className="text-[11px] text-faint">{tt(`occ.${o.id}.en`)}</span>
                      ) : null}
                      <span className={cn("ml-auto text-[11px] tabular-nums", o.pool < 0 ? "text-hp" : "text-muted")}>
                        {tt("create.points", { n: fmtPool(o.pool) })}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{tt(`occ.${o.id}.blurb`)}</p>
                    {occupation === o.id ? (
                      <p className="mt-1 text-[11px] leading-relaxed text-faint">{tt(`occ.${o.id}.desc`)}</p>
                    ) : null}
                    <p className="mt-1 text-[11px] text-faint">
                      {tt("create.innate")}{" "}
                      {SKILL_KEYS.filter((k) => o.skills[k] > 0)
                        .map((k) => `${tt(`skill.${k}`)} ${o.skills[k]}`)
                        .join(" · ") || tt("create.none")}
                    </p>
                    {o.granted.length ? (
                      <p className="mt-1 text-[11px] text-stamina">
                        {tt("create.free")} {o.granted.map((id) => tt(`trait.${id}`)).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}

        {mode === "wizard" && step === 2 ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Portrait portrait={portrait} name={name} tone={face.tone} className="size-16 shrink-0" />
              <div className="min-w-0">
                <div className="font-display tracking-wide">{name}</div>
                <div className="text-xs text-muted">
                  {tt(`occ.${occupation}`)} · {tt(`occ.${occupation}.en`)}
                </div>
              </div>
            </div>
            <div className="flex items-baseline justify-between rounded-md border border-border bg-surface px-3 py-2">
              <span className="text-xs text-muted">{tt("create.poolHint")}</span>
              <span className={cn("font-display tabular-nums text-lg", pool < 0 ? "text-hp" : "text-fg")}>{pool}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted">{tt(`occ.${occupation}.desc`)}</p>
            {granted.length ? (
              <section>
                <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("create.occTrait")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {granted.map((id) => (
                    <TraitBtn key={id} t={traitById(id)} on locked />
                  ))}
                </div>
              </section>
            ) : null}
            <section>
              <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("create.pos")}</h3>
              <div className="grid grid-cols-2 gap-2">
                {pos.map((tr) => (
                  <TraitBtn key={tr.id} t={tr} on={traits.includes(tr.id)} onClick={() => toggleTrait(tr.id)} />
                ))}
              </div>
            </section>
            <section>
              <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("create.neg")}</h3>
              <div className="grid grid-cols-2 gap-2">
                {neg.map((tr) => (
                  <TraitBtn key={tr.id} t={tr} on={traits.includes(tr.id)} onClick={() => toggleTrait(tr.id)} />
                ))}
              </div>
            </section>
            {pool < 0 ? <p className="text-xs text-hp">{tt("create.needPoints")}</p> : null}
          </div>
        ) : null}

        {mode === "wizard" && step === 3 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">{tt("create.skillHint")}</p>
            <div className="flex items-baseline justify-between rounded-md border border-border bg-surface px-3 py-2">
              <span className="text-xs text-muted">{tt("create.alloc")}</span>
              <span className="font-display tabular-nums text-lg">{left}</span>
            </div>
            <ul className="space-y-2">
              {SKILL_KEYS.map((k) => {
                const innate = occ.skills[k];
                const extra = alloc[k] ?? 0;
                const total = preview[k];
                return (
                  <li key={k} className="rounded-md border border-border bg-surface p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <div className="text-sm">
                          {tt(`skill.${k}`)}{" "}
                          <span className="text-[11px] text-muted">{tt("skill.lv", { n: total, rank: tt(`skill.rank.${total}`) })}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted">{tt(`skill.${k}.lv.${total}`)}</p>
                        <p className="text-[11px] leading-relaxed text-faint">{skillBoostLine(k, total)}</p>
                        <div className="text-[11px] text-faint">
                          {tt("create.innateN", { n: innate })}
                          {extra ? tt("create.plusAlloc", { n: extra }) : ""}
                          {tt("create.nextXp", { n: xpToNext(total) })}
                          {" · "}
                          {tt("skill.learn", { n: total, mul: startXpMul(total).toFixed(2) })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="size-11 rounded-md border border-border bg-surface-2 text-lg"
                          onClick={() => bump(k, -1)}
                          disabled={extra <= 0}
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-display tabular-nums text-lg">{total}</span>
                        <button
                          type="button"
                          className="size-11 rounded-md border border-border bg-surface-2 text-lg"
                          onClick={() => bump(k, 1)}
                          disabled={left <= 0 || total >= 10}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn("h-1.5 flex-1 rounded-full", i < total ? "bg-accent" : "bg-border")}
                        />
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {mode === "wizard" && step === 4 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">{tt("create.shelterHint")}</p>
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
                  <img src={asset(s.image)} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3">
                    <div className="font-display tracking-wide">{tt(`sh.${s.id}`)}</div>
                    <div className="text-[11px] text-muted">
                      {tt(`sh.${s.id}.en`) !== tt(`sh.${s.id}`) ? `${tt(`sh.${s.id}.en`)} · ` : ""}
                      {tt("create.cap", { n: s.capacity })}
                    </div>
                  </div>
                </div>
                <p className="px-3 py-2 text-xs leading-relaxed text-muted">{tt(`sh.${s.id}.desc`)}</p>
              </button>
            ))}
            <div className="flex items-center gap-3 rounded-md border border-border bg-surface p-2">
              <Portrait portrait={portrait} name={name} tone={face.tone} className="h-14 w-11 shrink-0" />
              <p className="text-xs text-faint">
                {name} · {tt(`occ.${occ.id}`)} · {traits.map((id) => tt(`trait.${id}`)).join(" / ") || tt("create.noTrait")} · {tt(`sh.${shelter.id}`)}
              </p>
            </div>
            {hasSave ? <p className="text-xs text-hunger">{tt("create.overwrite")}</p> : null}
          </div>
        ) : null}
      </div>

      <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {mode === "result" ? (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              className="w-full"
              size="lg"
              onClick={() => {
                setMode("wizard");
                setStep(0);
              }}
            >
              {tt("create.tweak")}
            </Button>
            <Button className="w-full" size="lg" onClick={start}>
              {tt("ui.enter")}
            </Button>
          </div>
        ) : step < 4 ? (
          <Button className="w-full" size="lg" disabled={!canNext} onClick={() => setStep(step + 1)}>
            {tt("ui.next")}
          </Button>
        ) : (
          <Button className="w-full" size="lg" onClick={start}>
            {tt("ui.enter")}
          </Button>
        )}
      </div>
    </Shell>
  );
}

function ResultCard({
  name,
  portrait,
  occupation,
  traits,
  granted,
  picked,
  preview,
  shelterId,
  pool,
  left,
}: {
  name: string;
  portrait: string;
  occupation: OccupationId;
  traits: TraitId[];
  granted: TraitId[];
  picked: TraitId[];
  preview: Skills;
  shelterId: string;
  pool: number;
  left: number;
}) {
  const tt = useT();
  const occ = occById(occupation);
  const face = faceById(portrait);
  const shelter = START_SHELTERS.find((s) => s.id === shelterId)!;
  const pos = picked.filter((id) => traitById(id).kind === "pos");
  const neg = picked.filter((id) => traitById(id).kind === "neg");
  void traits;
  return (
    <div className="ash-prose space-y-4">
      <div className="flex gap-4">
        <Portrait portrait={portrait} name={name} tone={face.tone} className="h-44 w-32 shrink-0" />
        <div className="min-w-0 flex-1 pt-1">
          <div className="font-display text-2xl tracking-wide">{name}</div>
          <div className="mt-1 text-sm text-muted">
            {tt(`occ.${occupation}`)}
            {tt(`occ.${occupation}.en`) !== tt(`occ.${occupation}`) ? (
              <span className="text-faint"> · {tt(`occ.${occupation}.en`)}</span>
            ) : null}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">{tt(`occ.${occupation}.desc`)}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            <span className={cn("rounded-sm border border-border px-2 py-1 tabular-nums", occ.pool < 0 ? "text-hp" : "text-muted")}>
              {tt("create.points", { n: fmtPool(occ.pool) })}
            </span>
            <span className="rounded-sm border border-border px-2 py-1 text-muted">
              {tt("create.leftOver", { n: left })}
            </span>
            <span className="rounded-sm border border-border px-2 py-1 text-muted">{tt(`sh.${shelter.id}`)}</span>
          </div>
        </div>
      </div>

      {granted.length ? (
        <section>
          <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("create.occTrait")}</h3>
          <div className="flex flex-wrap gap-2">
            {granted.map((id) => (
              <span key={id} className="rounded-sm border border-stamina/40 bg-surface px-2 py-1 text-xs text-stamina">
                {tt(`trait.${id}`)}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("create.pos")}</h3>
        {pos.length ? (
          <ul className="space-y-1">
            {pos.map((id) => (
              <li key={id} className="flex items-baseline justify-between gap-2 text-sm">
                <span>{tt(`trait.${id}`)}</span>
                <span className="text-[11px] tabular-nums text-muted">{traitById(id).points}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-faint">{tt("create.noTrait")}</p>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("create.neg")}</h3>
        {neg.length ? (
          <ul className="space-y-1">
            {neg.map((id) => (
              <li key={id} className="flex items-baseline justify-between gap-2 text-sm">
                <span>{tt(`trait.${id}`)}</span>
                <span className="text-[11px] tabular-nums text-stamina">+{traitById(id).points}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-faint">{tt("create.noTrait")}</p>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("create.skills")}</h3>
        <ul className="space-y-1.5">
          {SKILL_KEYS.map((k) => (
            <li key={k} className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-[11px] text-muted">{tt(`skill.${k}`)}</span>
              <div className="flex flex-1 gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={cn("h-1.5 flex-1 rounded-full", i < preview[k] ? "bg-accent" : "bg-border")} />
                ))}
              </div>
              <span className="w-16 text-right font-display text-xs tabular-nums">
                {preview[k]} {tt(`skill.rank.${preview[k]}`)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="overflow-hidden rounded-md border border-border">
        <div className="relative h-24">
          <img src={asset(shelter.image)} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
          <div className="absolute bottom-2 left-3 text-sm">{tt(`sh.${shelter.id}`)}</div>
        </div>
      </div>
      {pool < 0 ? <p className="text-xs text-hp">{tt("create.needPoints")}</p> : null}
    </div>
  );
}

function TraitBtn({
  t: trait,
  on,
  onClick,
  locked,
}: {
  t: (typeof TRAITS)[number];
  on: boolean;
  onClick?: () => void;
  locked?: boolean;
}) {
  const tt = useT();
  const sign = trait.points > 0 ? `+${trait.points}` : trait.points === 0 ? tt("create.freeShort") : `${trait.points}`;
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={cn(
        "rounded-md border px-3 py-3 text-left",
        locked ? "border-stamina/40 bg-surface-2" : on ? "border-accent bg-surface-2" : "border-border bg-surface",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm">{tt(`trait.${trait.id}`)}</div>
        <div className={cn("text-[11px] tabular-nums", trait.points > 0 ? "text-stamina" : "text-muted")}>{sign}</div>
      </div>
      <div className="text-[11px] text-muted">{tt(`trait.${trait.id}.blurb`)}</div>
    </button>
  );
}
