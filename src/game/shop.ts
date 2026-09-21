import { create } from "zustand";

export type PaperId = "field" | "carbon" | "ledger" | "ash";
export type FrameId = "none" | "tape" | "rust" | "brass";
export type ShopTab = "law" | "look" | "found";

export type ShopItemId =
  | "paper.carbon"
  | "paper.ledger"
  | "paper.ash"
  | "frame.tape"
  | "frame.rust"
  | "frame.brass"
  | "pack.founder";

export interface ShopItem {
  id: ShopItemId;
  kind: "paper" | "frame" | "pack";
  paper?: PaperId;
  frame?: FrameId;
  smokes: number;
}

export interface Wallet {
  smokes: number;
  owned: ShopItemId[];
  paper: PaperId;
  frame: FrameId;
  founder: boolean;
  nights: number;
}

const KEY = "ash-market-v1";
const MAX_SMOKES = 99;

export const CATALOG: ShopItem[] = [
  { id: "paper.carbon", kind: "paper", paper: "carbon", smokes: 12 },
  { id: "paper.ledger", kind: "paper", paper: "ledger", smokes: 12 },
  { id: "paper.ash", kind: "paper", paper: "ash", smokes: 16 },
  { id: "frame.tape", kind: "frame", frame: "tape", smokes: 8 },
  { id: "frame.rust", kind: "frame", frame: "rust", smokes: 10 },
  { id: "frame.brass", kind: "frame", frame: "brass", smokes: 14 },
  { id: "pack.founder", kind: "pack", smokes: 40 },
];

export const BANS = [
  "shop.ban.revive",
  "shop.ban.food",
  "shop.ban.points",
  "shop.ban.energy",
  "shop.ban.gacha",
  "shop.ban.bond",
] as const;

const FREE_PAPER: PaperId = "field";
const FREE_FRAME: FrameId = "none";

function emptyWallet(): Wallet {
  return {
    smokes: 0,
    owned: [],
    paper: FREE_PAPER,
    frame: FREE_FRAME,
    founder: false,
    nights: 0,
  };
}

function loadWallet(): Wallet {
  if (typeof window === "undefined") return emptyWallet();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyWallet();
    const data = JSON.parse(raw) as Partial<Wallet>;
    return {
      ...emptyWallet(),
      smokes: Math.max(0, Math.min(MAX_SMOKES, Number(data.smokes) || 0)),
      owned: Array.isArray(data.owned) ? (data.owned.filter(Boolean) as ShopItemId[]) : [],
      paper: data.paper === "carbon" || data.paper === "ledger" || data.paper === "ash" ? data.paper : FREE_PAPER,
      frame: data.frame === "tape" || data.frame === "rust" || data.frame === "brass" ? data.frame : FREE_FRAME,
      founder: !!data.founder,
      nights: Math.max(0, Number(data.nights) || 0),
    };
  } catch {
    return emptyWallet();
  }
}

function writeWallet(w: Wallet) {
  try {
    localStorage.setItem(KEY, JSON.stringify(w));
  } catch {
    /* private mode */
  }
}

function owns(w: Wallet, id: ShopItemId) {
  if (id === "pack.founder") return w.founder;
  return w.owned.includes(id) || w.founder;
}

function withUnlock(w: Wallet, id: ShopItemId): Wallet {
  let next: Wallet = { ...w, owned: w.owned.includes(id) ? w.owned : [...w.owned, id] };
  if (id === "pack.founder") {
    next = {
      ...next,
      founder: true,
      owned: Array.from(new Set([...next.owned, ...CATALOG.map((c) => c.id)])),
      paper: next.paper === FREE_PAPER ? "ash" : next.paper,
      frame: next.frame === FREE_FRAME ? "brass" : next.frame,
    };
  }
  const item = CATALOG.find((c) => c.id === id);
  if (item?.paper) next.paper = item.paper;
  if (item?.frame) next.frame = item.frame;
  return next;
}

interface ShopStore extends Wallet {
  tab: ShopTab;
  note: string | null;
  boot: () => void;
  setTab: (tab: ShopTab) => void;
  grantNight: () => void;
  buy: (id: ShopItemId) => boolean;
  wearPaper: (id: PaperId) => void;
  wearFrame: (id: FrameId) => void;
  owns: (id: ShopItemId) => boolean;
  paperOwned: (id: PaperId) => boolean;
  frameOwned: (id: FrameId) => boolean;
}

function persist(partial: Partial<Wallet>, get: () => ShopStore): Wallet {
  const cur = get();
  const next: Wallet = {
    smokes: partial.smokes ?? cur.smokes,
    owned: partial.owned ?? cur.owned,
    paper: partial.paper ?? cur.paper,
    frame: partial.frame ?? cur.frame,
    founder: partial.founder ?? cur.founder,
    nights: partial.nights ?? cur.nights,
  };
  writeWallet(next);
  return next;
}

export const useShop = create<ShopStore>((set, get) => ({
  ...emptyWallet(),
  tab: "law",
  note: null,
  boot: () => set({ ...loadWallet(), note: null }),
  setTab: (tab) => set({ tab, note: null }),
  grantNight: () => {
    const w = get();
    const next = persist({ smokes: Math.min(MAX_SMOKES, w.smokes + 2), nights: w.nights + 1 }, get);
    set(next);
  },
  buy: (id) => {
    const w = get();
    if (owns(w, id)) {
      set({ note: "shop.note.have" });
      return true;
    }
    const item = CATALOG.find((c) => c.id === id);
    if (!item) return false;
    if (w.smokes < item.smokes) {
      set({ note: "shop.note.short" });
      return false;
    }
    const unlocked = withUnlock({ ...w, smokes: w.smokes - item.smokes }, id);
    writeWallet(unlocked);
    set({ ...unlocked, note: "shop.note.bought" });
    return true;
  },
  wearPaper: (id) => {
    const w = get();
    if (id !== FREE_PAPER && !w.founder && !w.owned.includes(`paper.${id}` as ShopItemId)) return;
    set(persist({ paper: id }, get));
  },
  wearFrame: (id) => {
    const w = get();
    if (id !== FREE_FRAME && !w.founder && !w.owned.includes(`frame.${id}` as ShopItemId)) return;
    set(persist({ frame: id }, get));
  },
  owns: (id) => owns(get(), id),
  paperOwned: (id) => id === FREE_PAPER || get().founder || get().owned.includes(`paper.${id}` as ShopItemId),
  frameOwned: (id) => id === FREE_FRAME || get().founder || get().owned.includes(`frame.${id}` as ShopItemId),
}));
