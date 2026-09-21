import { Ban, Cigarette, ScrollText, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BANS, CATALOG, useShop, type ShopItem, type ShopTab } from "@/game/shop";
import { useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";
import { LangSwitch, Shell } from "./chrome";

const TABS: { id: ShopTab; icon: typeof ShieldCheck }[] = [
  { id: "law", icon: ShieldCheck },
  { id: "look", icon: ScrollText },
  { id: "found", icon: Sparkles },
];

function PaperSwatch({ id }: { id: string }) {
  return (
    <div
      className={cn(
        "flex h-14 w-full flex-col justify-center gap-1.5 rounded-sm border border-border px-3",
        id === "field" && "bg-surface-2",
        id === "carbon" && "bg-bg",
        id === "ledger" && "bg-thirst/15",
        id === "ash" && "bg-hunger/20",
      )}
    >
      <span className="h-1 w-3/4 rounded-full bg-fg/25" />
      <span className="h-1 w-1/2 rounded-full bg-fg/15" />
    </div>
  );
}

function ItemCard({ item }: { item: ShopItem }) {
  const tt = useT();
  const smokes = useShop((s) => s.smokes);
  const owned = useShop((s) => s.owns(item.id));
  const paper = useShop((s) => s.paper);
  const frame = useShop((s) => s.frame);
  const founder = useShop((s) => s.founder);
  const buy = useShop((s) => s.buy);
  const wearPaper = useShop((s) => s.wearPaper);
  const wearFrame = useShop((s) => s.wearFrame);
  const equipped =
    (item.paper && paper === item.paper) ||
    (item.frame && frame === item.frame) ||
    (item.kind === "pack" && founder);
  const short = smokes < item.smokes;

  const wear = () => {
    if (item.paper) wearPaper(item.paper);
    if (item.frame) wearFrame(item.frame);
  };

  return (
    <article className="rounded-md border border-border bg-surface p-3">
      {item.paper ? <PaperSwatch id={item.paper} /> : null}
      {item.frame ? (
        <div className="flex h-16 items-center justify-center">
          <div
            className={cn(
              "size-12 rounded-sm bg-surface-2",
              item.frame === "tape" && "portrait-tape",
              item.frame === "rust" && "portrait-rust",
              item.frame === "brass" && "portrait-brass",
            )}
          />
        </div>
      ) : null}
      {item.kind === "pack" ? (
        <div className="flex h-16 items-center justify-center rounded-sm bg-surface-2">
          <span className="font-display tracking-[0.2em] text-sm">FOUNDING</span>
        </div>
      ) : null}
      <h3 className="mt-2 text-sm">{tt(`shop.item.${item.id}`)}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{tt(`shop.item.${item.id}.blurb`)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {owned ? (
          <Button size="sm" variant={equipped ? "default" : "secondary"} onClick={wear} disabled={item.kind === "pack"}>
            {equipped ? tt("shop.wearing") : tt("shop.wear")}
          </Button>
        ) : (
          <Button size="sm" onClick={() => buy(item.id)} disabled={short}>
            <Cigarette className="size-3.5" />
            {item.smokes}
          </Button>
        )}
      </div>
    </article>
  );
}

export function ShopScreen() {
  const tt = useT();
  const tab = useShop((s) => s.tab);
  const setTab = useShop((s) => s.setTab);
  const smokes = useShop((s) => s.smokes);
  const nights = useShop((s) => s.nights);
  const founder = useShop((s) => s.founder);
  const note = useShop((s) => s.note);
  const paper = useShop((s) => s.paper);
  const wearPaper = useShop((s) => s.wearPaper);
  const closeShop = useGame((s) => s.closeShop);
  const looks = CATALOG.filter((c) => c.kind !== "pack");
  const pack = CATALOG.find((c) => c.id === "pack.founder")!;

  return (
    <Shell>
      <header className="flex items-end justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div>
          <div className="text-[11px] tracking-[0.18em] text-muted uppercase">{tt("shop.kicker")}</div>
          <h1 className="font-display text-2xl tracking-wide">{tt("shop.title")}</h1>
        </div>
        <div className="text-right">
          <LangSwitch className="mb-1 justify-end" />
          <div className="flex items-center justify-end gap-1 text-sm">
            <Cigarette className="size-3.5 text-muted" />
            <span className="font-display tabular-nums">{smokes}</span>
          </div>
        </div>
      </header>

      <nav className="mx-4 mb-3 grid grid-cols-3 gap-1 rounded-md bg-surface p-1">
        {TABS.map((row) => {
          const Icon = row.icon;
          const on = tab === row.id;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => setTab(row.id)}
              className={cn(
                "flex min-h-11 items-center justify-center gap-1 rounded-sm text-[11px] tracking-wide",
                on ? "bg-accent text-accent-fg" : "text-muted",
              )}
            >
              <Icon className="size-3.5" />
              {tt(`shop.tab.${row.id}`)}
            </button>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {tab === "law" ? (
          <div className="space-y-4">
            <p className="ash-prose font-serif text-[15px] leading-relaxed text-fg/90">{tt("shop.law.body")}</p>
            <ul className="space-y-2">
              {BANS.map((key) => (
                <li key={key} className="flex gap-2 rounded-md bg-surface px-3 py-2 text-sm">
                  <Ban className="mt-0.5 size-4 shrink-0 text-hp" />
                  <span>{tt(key)}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed text-muted">{tt("shop.law.ok")}</p>
          </div>
        ) : null}

        {tab === "look" ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-muted">{tt("shop.look.body")}</p>
            <button
              type="button"
              onClick={() => wearPaper("field")}
              className={cn(
                "w-full rounded-md border p-3 text-left",
                paper === "field" ? "border-accent bg-surface" : "border-border bg-surface-2",
              )}
            >
              <PaperSwatch id="field" />
              <div className="mt-2 text-sm">{tt("shop.item.paper.field")}</div>
              <div className="text-xs text-muted">{tt("shop.item.paper.field.blurb")}</div>
            </button>
            {looks.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}

        {tab === "found" ? (
          <div className="space-y-3">
            <p className="ash-prose font-serif text-[15px] leading-relaxed">{tt("shop.found.body")}</p>
            <ItemCard item={pack} />
            <div className="rounded-md bg-surface px-3 py-3 text-sm">
              <div className="text-[11px] tracking-[0.16em] text-muted uppercase">{tt("shop.found.stats")}</div>
              <p className="mt-1">{tt("shop.found.nights", { n: nights })}</p>
              {founder ? <p className="mt-1 text-hunger">{tt("shop.found.mark")}</p> : null}
            </div>
          </div>
        ) : null}

        {note ? <p className="mt-4 text-xs text-hunger">{tt(note)}</p> : null}
        <p className="mt-6 text-[11px] leading-relaxed text-faint">{tt("shop.demo")}</p>
      </div>

      <div className="border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button variant="secondary" className="w-full" onClick={closeShop}>
          {tt("ui.back")}
        </Button>
      </div>
    </Shell>
  );
}
