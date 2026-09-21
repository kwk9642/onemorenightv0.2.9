import { useState } from "react";
import { SKILL_CAP, SKILL_KEYS, skillBoostLine, startXpMul, xpToNext } from "@/game/growth";
import { t, useT } from "@/game/i18n";
import type { SkillId, Skills, Survivor } from "@/game/types";
import { cn } from "@/lib/utils";

function pips(level: number) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: SKILL_CAP }).map((_, i) => (
        <div key={i} className={cn("h-1.5 flex-1 rounded-full", i < level ? "bg-accent" : "bg-border")} />
      ))}
    </div>
  );
}

export function SkillRow({
  skill,
  level,
  xp,
  base,
  traits,
  open,
  onToggle,
  recent,
}: {
  skill: SkillId;
  level: number;
  xp?: number;
  base?: number;
  traits?: Survivor["traits"];
  open?: boolean;
  onToggle?: () => void;
  recent?: boolean;
}) {
  const tt = useT();
  const maxed = level >= SKILL_CAP;
  const need = xpToNext(level);
  const have = xp ?? 0;
  const pct = maxed ? 100 : Math.min(100, (have / need) * 100);
  const rank = tt(`skill.rank.${level}`);
  const flavor = tt(`skill.${skill}.lv.${level}`);
  const bits = skillBoostLine(skill, level);
  const nextLv = Math.min(SKILL_CAP, level + 1);
  const mul = startXpMul(base ?? 0) * (traits?.includes("fastlearner") ? 1.35 : traits?.includes("slowlearner") ? 0.65 : 1);
  return (
    <div className={cn("rounded-md border px-2.5 py-2", recent ? "border-stamina/60 bg-surface-2" : "border-border bg-surface")}>
      <button type="button" onClick={onToggle} className="flex w-full items-baseline gap-2 text-left">
        <span className="min-w-0 flex-1 text-sm">
          {tt(`skill.${skill}`)}{" "}
          <span className="text-[11px] text-muted">
            {tt("skill.lv", { n: level, rank })}
          </span>
        </span>
        <span className="shrink-0 text-[11px] tabular-nums text-faint">
          {maxed ? tt("skill.maxed") : tt("skill.xp", { have: Math.floor(have), need })}
        </span>
      </button>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
        <div className="h-full bg-accent transition-[width] duration-200 ease-out" style={{ width: `${pct}%` }} />
      </div>
      {open ? (
        <div className="mt-2 space-y-1.5">
          {pips(level)}
          <p className="text-[11px] leading-relaxed text-fg">{flavor}</p>
          <p className="text-[11px] leading-relaxed text-muted">{bits}</p>
          {maxed ? null : (
            <p className="text-[11px] leading-relaxed text-faint">
              {tt("skill.next", {
                n: nextLv,
                rank: tt(`skill.rank.${nextLv}`),
                boost: `${tt(`skill.${skill}.lv.${nextLv}`)} ${skillBoostLine(skill, nextLv)}`,
              })}
            </p>
          )}
          <p className="text-[11px] text-faint">
            {tt(`skill.how.${skill}`)}
            {base != null
              ? ` · ${tt("skill.learn", { n: base, mul: mul.toFixed(2) })}`
              : null}
          </p>
        </div>
      ) : (
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-faint">{bits}</p>
      )}
    </div>
  );
}

export function SkillList({
  levels,
  xp,
  base,
  traits,
  last,
  defaultOpen,
}: {
  levels: Skills;
  xp?: Skills;
  base?: Skills;
  traits?: Survivor["traits"];
  last?: Survivor["lastSkillUp"];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<SkillId | null>(defaultOpen ? "combat" : null);
  return (
    <ul className="space-y-1.5">
      {SKILL_KEYS.map((k) => (
        <li key={k}>
          <SkillRow
            skill={k}
            level={levels[k]}
            xp={xp?.[k]}
            base={base?.[k]}
            traits={traits}
            open={open === k}
            onToggle={() => setOpen((cur) => (cur === k ? null : k))}
            recent={last?.skill === k}
          />
        </li>
      ))}
    </ul>
  );
}

export function SkillNotices({
  notices,
  onDismiss,
}: {
  notices: { name: string; skill: SkillId; level: number }[];
  onDismiss: () => void;
}) {
  const tt = useT();
  if (!notices.length) return null;
  return (
    <div className="mb-3 rounded-md border border-stamina/50 bg-surface px-3 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-[11px] tracking-[0.16em] text-stamina uppercase">{tt("notices.title")}</h3>
        <button type="button" className="h-11 text-[11px] text-muted" onClick={onDismiss}>
          {tt("notices.dismiss")}
        </button>
      </div>
      <ul className="mt-1 space-y-1.5">
        {notices.map((n, i) => (
          <li key={`${n.name}-${n.skill}-${n.level}-${i}`} className="text-sm leading-relaxed">
            <span className="text-fg">
              {tt("notices.skill", {
                name: n.name,
                skill: t(`skill.${n.skill}`),
                n: n.level,
                rank: t(`skill.rank.${n.level}`),
              })}
            </span>
            <span className="mt-0.5 block text-[11px] text-muted">
              {t(`skill.${n.skill}.lv.${n.level}`)} {skillBoostLine(n.skill, n.level)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

