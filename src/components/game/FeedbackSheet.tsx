import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import { loadSave } from "@/game/save";
import { pushInbox, snapshot, V02_NOTES } from "@/game/v02";

export function FeedbackSheet({ onClose }: { onClose: () => void }) {
  const tt = useT();
  const run = useGame((s) => s.run);
  const snap = useMemo(() => snapshot(run ?? loadSave()), [run]);
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);

  const pack = () => {
    const body = [q.trim() || "（沒寫問題）", "", snap].join("\n");
    pushInbox(body);
    return body;
  };

  const copy = async () => {
    const body = pack();
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
    <div className="absolute inset-0 z-30 flex flex-col bg-bg">
      <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{tt("fb.kicker")}</p>
        <button type="button" className="h-11 px-3 text-sm" onClick={onClose}>
          {tt("fb.close")}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <h2 className="font-display text-xl tracking-wide">{tt("fb.title")}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">{tt("fb.body")}</p>
        <label className="mt-4 block text-xs text-muted" htmlFor="fb-q">
          {tt("fb.q")}
        </label>
        <textarea
          id="fb-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={5}
          className="mt-1 min-h-28 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm leading-relaxed"
          placeholder={tt("fb.ph")}
        />
        <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-surface p-3 text-[11px] leading-relaxed text-muted">
          {snap}
        </pre>
        <Button className="mt-3 w-full" onClick={copy}>
          {copied ? tt("fb.copied") : tt("fb.copy")}
        </Button>
        <p className="mt-2 text-[11px] leading-relaxed text-faint">{tt("fb.where")}</p>
        <p className="mt-5 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("fb.inbox")}</p>
        <ul className="mt-2 space-y-2">
          {V02_NOTES.map((n) => (
            <li key={n.id} className="rounded-md border border-border bg-surface px-3 py-2">
              <div className="text-[10px] tracking-[0.12em] text-faint uppercase">{n.from}</div>
              <p className="mt-1 text-sm leading-relaxed">{n.q}</p>
              <div className="mt-1 text-[11px] text-muted">
                {n.status === "fixed-preview" ? tt("fb.preview") : tt("fb.open")}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
