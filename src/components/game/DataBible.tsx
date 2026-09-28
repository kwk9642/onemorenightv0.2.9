import { useMemo, useState } from "react";
import { FACILITIES, JOBS, LOCATIONS, OCCUPATIONS, TRAITS, sizeLabel } from "@/game/data";
import { SKILL_KEYS, skillBoostLine } from "@/game/growth";
import { GEAR, gearStatBits } from "@/game/gear";
import { EDITION, WEB_STATE_LIST } from "@/game/edition";
import { getLocale, t, tLoc, useT } from "@/game/i18n";
import { cn } from "@/lib/utils";

export const BIBLE_TABS = ["play", "skills", "locations", "occupations", "traits", "gear", "facilities", "jobs", "rules"] as const;
export type BibleTab = (typeof BIBLE_TABS)[number];

const PLAY = ["edition", "goal", "save", "modes", "ap", "mission", "map", "dispatch", "search", "fight", "zombies", "herbs", "magazines", "bands", "diplomacy", "skills", "night", "house", "wear", "occupy", "gear", "win"] as const;
const RULES = ["ap", "search", "fight", "extract", "night", "raid", "build", "occupy", "dispatch"] as const;

function Card({ title, body, meta }: { title: string; body?: string; meta?: string }) {
  return (
    <article className="rounded-md border border-border bg-surface px-3 py-3">
      <h3 className="font-display text-sm tracking-wide">{title}</h3>
      {meta ? <p className="mt-1 text-[11px] leading-relaxed text-faint">{meta}</p> : null}
      {body ? <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p> : null}
    </article>
  );
}

function matches(q: string, ...parts: unknown[]) {
  if (!q) return true;
  return parts.some((p) => String(p ?? "").toLowerCase().includes(q));
}

function phrase(key: string, fallback: string) {
  const s = t(key);
  return s === key ? fallback : s;
}

export function DataBible({ onClose }: { onClose?: () => void }) {
  const tt = useT();
  const loc = getLocale();
  const [tab, setTab] = useState<BibleTab>("play");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  const play = useMemo(() => {
    const states = WEB_STATE_LIST.map((id) => tt(`state.${id}`)).join(loc === "en" ? ", " : "、");
    const editionKey = `edition.${EDITION}`;
    return PLAY.map((id) =>
      id === "edition"
        ? { id, title: tt(`${editionKey}Title`), body: tt(`${editionKey}Body`, { states }) }
        : { id, title: tt(`bible.play.${id}`), body: tt(`bible.play.${id}.body`) },
    );
  }, [tt, loc]);

  let cards: { key: string; title: string; meta?: string; body?: string }[] = [];
  if (tab === "play") {
    cards = play.map((p) => ({ key: p.id, title: p.title, body: p.body }));
  } else if (tab === "locations") {
    cards = LOCATIONS.filter((l) => matches(needle, tLoc(l.id), l.nameEn, tt(`loc.${l.id}.blurb`), tt(`state.${l.region}`))).map(
      (l) => {
        const loot = Object.entries(l.loot)
          .map(([k, pair]) => `${tt(`res.${k}`)} ${pair[0]}–${pair[1]}`)
          .join(" · ");
        return {
          key: l.id,
          title: tLoc(l.id),
          meta: `${tt(`state.${l.region}`)} · ${sizeLabel(l.size)} · ${tt("map.zombies", { n: l.zombies })} · ${l.fuel ? tt("squad.fuel", { n: l.fuel }) : tt("squad.walk")}`,
          body: `${tt(`loc.${l.id}.blurb`)} ${loot ? `${tt("bible.loot")} ${loot}.` : ""} ${tt("bible.cap", { n: l.occupyCapacity })}`,
        };
      },
    );
  } else if (tab === "skills") {
    cards = SKILL_KEYS.flatMap((k) => {
      const title = tt(`skill.${k}`);
      const body = tt(`skill.${k}.blurb`) + " " + tt(`skill.how.${k}`);
      const rows = Array.from({ length: 11 }, (_, lv) => ({
        key: `${k}-${lv}`,
        title: `${title} ${lv} ${tt(`skill.rank.${lv}`)}`,
        meta: skillBoostLine(k, lv),
        body: tt(`skill.${k}.lv.${lv}`),
      })).filter((c) => matches(needle, c.title, c.meta, c.body, body));
      return needle
        ? rows
        : [{ key: k, title, meta: tt(`skill.how.${k}`), body }, ...rows];
    });
  } else if (tab === "occupations") {
    cards = OCCUPATIONS.filter((o) =>
      matches(needle, tt(`occ.${o.id}`), o.nameEn, tt(`occ.${o.id}.blurb`), tt(`occ.${o.id}.desc`)),
    ).map((o) => ({
      key: o.id,
      title: tt(`occ.${o.id}`),
      meta: `${tt("create.points", { n: o.pool })} · HP ${o.hp} · ${phrase(`occ.${o.id}.blurb`, o.blurb)}`,
      body: phrase(`occ.${o.id}.desc`, o.desc),
    }));
  } else if (tab === "traits") {
    cards = TRAITS.filter((tr) => matches(needle, tt(`trait.${tr.id}`), tr.blurb)).map((tr) => ({
      key: tr.id,
      title: `${tt(`trait.${tr.id}`)} · ${tr.points > 0 ? `+${tr.points}` : String(tr.points)}`,
      meta: tr.kind === "neg" ? tt("create.neg") : tt("create.pos"),
      body: phrase(`trait.${tr.id}.blurb`, tr.blurb),
    }));
  } else if (tab === "gear") {
    const items = GEAR.filter((g) =>
      matches(needle, g.names.zh, g.names.en, g.names.ja, g.names.ko, g.slot, gearStatBits(g).join(" ")),
    ).map((g) => ({
      key: g.id,
      title: g.names[loc] ?? g.names.zh,
      meta: `${tt(`gear.slot.${g.slot}`)} · ${tt(`gear.rarity.${g.rarity}`)}`,
      body: gearStatBits(g).join(" · ") || tt("gear.bare"),
    }));
    cards = needle ? items : [{ key: "legend", title: tt("bible.tab.gear"), body: tt("gear.legend") }, ...items];
  } else if (tab === "facilities") {
    cards = FACILITIES.filter((f) =>
      matches(needle, tt(`fac.${f.id}`), f.blurb, f.effect, tt(`fac.${f.id}.blurb`), tt(`fac.${f.id}.effect`)),
    ).map((f) => {
      const extra = f.cost.extra
        ? Object.entries(f.cost.extra)
            .map(([k, n]) => `${tt(`res.${k}`)} ${n}`)
            .join(" · ")
        : "";
      return {
        key: f.id,
        title: tt(`fac.${f.id}`),
        meta: `${tt("build.need")} ${tt("res.materials")} ${f.cost.materials}${extra ? ` · ${extra}` : ""} · ${tt("bible.max", { n: f.max })}`,
        body: `${phrase(`fac.${f.id}.blurb`, f.blurb)} ${phrase(`fac.${f.id}.effect`, f.effect)}`,
      };
    });
  } else if (tab === "jobs") {
    cards = JOBS.filter((j) => matches(needle, tt(`job.${j.id}`), j.blurb, tt(`job.${j.id}.blurb`))).map((j) => ({
      key: j.id,
      title: tt(`job.${j.id}`),
      meta: j.need ? tt(`fac.${j.need}`) : tt("bible.noNeed"),
      body: phrase(`job.${j.id}.blurb`, j.blurb),
    }));
  } else {
    cards = RULES.filter((id) => matches(needle, tt(`bible.rule.${id}`), tt(`bible.rule.${id}.body`))).map((id) => ({
      key: id,
      title: tt(`bible.rule.${id}`),
      body: tt(`bible.rule.${id}.body`),
    }));
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-bg text-fg">
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{tt("bible.kicker")}</p>
          {onClose ? (
            <button type="button" className="h-11 px-3 text-sm" onClick={onClose}>
              {tt("bible.close")}
            </button>
          ) : null}
        </div>
        <h1 className="font-display text-xl tracking-wide">{tt("bible.title")}</h1>
        <p className="mt-1 text-xs leading-relaxed text-muted">{tt("bible.body")}</p>
      </header>
      <div className="flex gap-1 overflow-x-auto px-4 pb-2">
        {BIBLE_TABS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "h-11 shrink-0 rounded-md px-3 text-xs",
              tab === id ? "bg-accent text-accent-fg" : "bg-surface text-muted",
            )}
          >
            {tt(`bible.tab.${id}`)}
          </button>
        ))}
      </div>
      {tab !== "play" ? (
        <label className="px-4 pb-2">
          <span className="sr-only">{tt("bible.search")}</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tt("bible.search")}
            className="h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm"
          />
        </label>
      ) : null}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {cards.length === 0 ? <p className="text-sm text-muted">{tt("bible.empty")}</p> : null}
        {cards.map((c) => (
          <Card key={c.key} title={c.title} meta={c.meta} body={c.body} />
        ))}
      </div>
    </div>
  );
}
