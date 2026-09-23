import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEVLOG, itchPageText, locText } from "@/game/devlog";
import { getLocale, useT } from "@/game/i18n";
import { cn } from "@/lib/utils";
import { LangSwitch } from "./chrome";

export function DevLogSheet({ onClose }: { onClose: () => void }) {
  const tt = useT();
  const loc = getLocale();
  const [sel, setSel] = useState(DEVLOG[0]?.id ?? "0.2");
  const [copied, setCopied] = useState(false);
  const entry = DEVLOG.find((e) => e.id === sel) ?? DEVLOG[0];

  const copy = async () => {
    const body = itchPageText(loc);
    try {
      await navigator.clipboard.writeText(body);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = body;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
  };

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-bg text-fg">
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{tt("log.kicker")}</p>
          <div className="flex items-center gap-1">
            <LangSwitch />
            <button type="button" className="h-11 px-3 text-sm" onClick={onClose}>
              {tt("log.close")}
            </button>
          </div>
        </div>
        <h1 className="font-display text-xl tracking-wide">{tt("log.title")}</h1>
        <p className="mt-1 text-xs leading-relaxed text-muted">{tt("log.body")}</p>
      </header>
      <div className="flex gap-1 overflow-x-auto px-4 pb-2">
        {DEVLOG.map((e, i) => {
          const on = e.id === sel;
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => setSel(e.id)}
              className={cn(
                "h-11 shrink-0 rounded-md px-3 text-xs",
                on ? "bg-accent text-accent-fg" : "bg-surface text-muted",
              )}
            >
              v{e.version}
              {i === 0 ? ` · ${tt("log.latest")}` : ""}
            </button>
          );
        })}
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {entry ? (
          <>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
                {locText(entry.kicker, loc)} · {entry.date}
              </p>
              <h2 className="mt-1 font-display text-lg tracking-wide">{locText(entry.title, loc)}</h2>
            </div>
            {entry.sections.map((s) => (
              <article key={locText(s.heading, loc)} className="rounded-md border border-border bg-surface px-3 py-3">
                <h3 className="font-display text-sm tracking-wide">{locText(s.heading, loc)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{locText(s.body, loc)}</p>
              </article>
            ))}
            <p className="text-[11px] leading-relaxed text-faint">{tt("log.itchHint")}</p>
            <Button className="w-full" onClick={copy}>
              {copied ? tt("log.copied") : tt("log.copyItch")}
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
