import { Portrait } from "@/components/game/chrome";
import {
  EQUIP_SLOTS,
  RARITY_CLASS,
  gearById,
  gearIcon,
  gearStatBits,
  itemName,
  visualOf,
} from "@/game/gear";
import { useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import type { GameState, GearItem, Survivor } from "@/game/types";
import { cn } from "@/lib/utils";

function ItemLine({ item, onClick, action }: { item: GearItem; onClick?: () => void; action?: string }) {
  const def = gearById(item.defId);
  if (!def) return null;
  const icon = gearIcon(item.defId);
  const bits = gearStatBits(def);
  const inner = (
    <>
      {icon ? (
        <img
          src={icon}
          alt=""
          className="size-10 shrink-0 object-contain"
          style={{ filter: visualOf(item.defId).filter }}
        />
      ) : (
        <div className="size-10 shrink-0 rounded-sm bg-surface-2" />
      )}
      <div className="min-w-0 flex-1">
        <div className={cn("truncate text-sm", RARITY_CLASS[def.rarity])}>{itemName(item)}</div>
        <div className="text-xs leading-snug text-faint">
          {item.cond}%{bits.length ? ` · ${bits.join(" · ")}` : ""}
        </div>
      </div>
      {action ? <span className="shrink-0 text-xs text-muted">{action}</span> : null}
    </>
  );
  const cls = "flex w-full items-center gap-2 rounded-md border border-border bg-surface-2 px-2 py-2 text-left";
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(cls, "min-h-11")}>
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}

export function GearDoll({ state, s }: { state: GameState; s: Survivor }) {
  const tt = useT();
  const equip = useGame((x) => x.equip);
  const unequip = useGame((x) => x.unequip);

  return (
    <div className="mt-3">
      <div className="mb-3 flex justify-center">
        <Portrait survivor={s} className="h-28 w-24" />
      </div>
      <ul className="space-y-1">
        {EQUIP_SLOTS.map((slot) => {
          const worn = s.worn?.[slot];
          const pool = (state.stash ?? []).filter((it) => gearById(it.defId)?.slot === slot);
          return (
            <li key={slot} className="grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2">
              <label htmlFor={`eq-${s.id}-${slot}`} className="text-xs text-muted">
                {tt(`gear.slot.${slot}`)}
              </label>
              <select
                id={`eq-${s.id}-${slot}`}
                value={worn?.uid ?? ""}
                onChange={(e) => {
                  const uid = e.target.value;
                  if (!uid) unequip(s.id, slot);
                  else equip(s.id, uid);
                }}
                className="h-11 min-w-0 rounded-md border border-border bg-surface-2 px-2 text-sm text-fg"
              >
                <option value="">{tt("gear.none")}</option>
                {worn ? (
                  <option value={worn.uid}>
                    {itemName(worn)} · {worn.cond}%
                    {gearById(worn.defId) ? ` · ${gearStatBits(gearById(worn.defId)!).slice(0, 2).join(" ")}` : ""}
                  </option>
                ) : null}
                {pool.map((it) => {
                  const d = gearById(it.defId);
                  return (
                    <option key={it.uid} value={it.uid}>
                      {itemName(it)} · {it.cond}%
                      {d ? ` · ${gearStatBits(d).slice(0, 2).join(" ")}` : ""}
                    </option>
                  );
                })}
              </select>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[11px] leading-relaxed text-faint">{tt("gear.legend")}</p>
    </div>
  );
}

export function StashPanel({ state }: { state: GameState }) {
  const tt = useT();
  const discard = useGame((x) => x.discard);
  const stash = state.stash ?? [];
  if (!stash.length) {
    return <p className="text-sm text-muted">{tt("gear.stashEmpty")}</p>;
  }
  const grouped = EQUIP_SLOTS.map((slot) => ({
    slot,
    items: stash.filter((it) => gearById(it.defId)?.slot === slot),
  })).filter((g) => g.items.length);
  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-faint">{tt("gear.hint")}</p>
      {grouped.map((g) => (
        <div key={g.slot}>
          <div className="mb-1 text-xs tracking-wide text-muted uppercase">
            {tt(`gear.slot.${g.slot}`)} · {g.items.length}
          </div>
          <ul className="space-y-1">
            {g.items.map((it) => (
              <li key={it.uid} className="flex items-stretch gap-1">
                <div className="min-w-0 flex-1">
                  <ItemLine item={it} />
                </div>
                <button
                  type="button"
                  onClick={() => discard(it.uid)}
                  title={tt("gear.discardHint")}
                  className="min-h-11 shrink-0 rounded-md border border-border px-2 text-xs text-muted"
                >
                  {tt("gear.discard")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function FindsHint({ finds }: { finds: GearItem[] }) {
  const tt = useT();
  if (!finds.length) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-hunger">
      <span>{tt("gear.bag", { n: finds.length })}</span>
      <span className="flex gap-1">
        {finds.slice(0, 4).map((it) => {
          const icon = gearIcon(it.defId);
          return icon ? <img key={it.uid} src={icon} alt="" className="size-6 object-contain" /> : null;
        })}
      </span>
    </div>
  );
}
