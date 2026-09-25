import { create } from "zustand";
import {
  assignJob,
  createNewGame,
  declineOccupy,
  discardItem as applyDiscard,
  equipItem,
  extractMission,
  failMission,
  forceEncounter,
  grantMissionLoot,
  kickSurvivor,
  missionChoice,
  missionKill,
  missionStrike,
  occupyHere,
  resolveEncounter,
  restNight,
  repairWall as applyRepairWall,
  doseHerb,
  startMission,
  unequipSlot,
  upgradeFacility,
} from "./engine";
import { canMission } from "./growth";
import { canStartDispatch, isAway, startDispatch } from "./dispatch";
import { clearSave, loadSave, writeSave } from "./save";
import { click, ok, setBgm, setMuted, unlockAudio, warn } from "./audio";
import { useShop } from "./shop";
import type { CreateInput, DispatchTask, EquipSlot, FacilityId, GameState, GearItem, JobId, PlayMode, Resources, SandboxOpts } from "./types";
import { DEFAULT_SANDBOX } from "./mode";

function persist(s: GameState): GameState {
  const log = s.log ?? [];
  const next = log.length > 80 ? { ...s, log: log.slice(-80) } : s;
  writeSave(next);
  return next;
}

function peekOf(saved: GameState | null): { day: number; loc: string } | null {
  if (!saved?.shelter) return null;
  return { day: saved.day, loc: saved.shelter.locationId };
}

interface GameStore {
  run: GameState | null;
  hasSave: boolean;
  savePeek: { day: number; loc: string } | null;
  help: boolean;
  dispatchOpen: boolean;
  logOpen: boolean;
  menu: "title" | "create" | "shop" | "mode";
  draftMode: PlayMode;
  draftLate: boolean;
  draftSandbox: SandboxOpts;
  openMode: () => void;
  setDraftMode: (mode: PlayMode) => void;
  setDraftLate: (on: boolean) => void;
  setDraftSandbox: (patch: Partial<SandboxOpts>) => void;
  muted: boolean;
  boot: () => void;
  openCreate: () => void;
  openTitle: () => void;
  parkTitle: () => void;
  openShop: () => void;
  closeShop: () => void;
  openHelp: () => void;
  closeHelp: () => void;
  openLog: () => void;
  closeLog: () => void;
  openDispatch: () => void;
  closeDispatch: () => void;
  sendDispatch: (ids: string[], task: DispatchTask) => void;
  newGame: (input: CreateInput) => void;
  continueGame: () => void;
  abandon: () => void;
  setScreen: (screen: GameState["screen"]) => void;
  setSquad: (ids: string[]) => void;
  setMapTarget: (id: string | null) => void;
  goMission: () => void;
  choose: (id: string) => void;
  encounter: (a: "invite" | "turn" | "fight" | "trade") => void;
  occupy: () => void;
  skipOccupy: () => void;
  job: (id: string, job: JobId) => void;
  kick: (id: string) => void;
  upgrade: (id: FacilityId) => void;
  repairWall: () => void;
  sleep: () => void;
  dose: (whoId: string, index: number, how: "poultice" | "brew") => void;
  toggleMute: () => void;
  simKill: (killerId?: string) => void;
  simHurt: (id: string, dmg: number, infect: boolean) => void;
  clearNotices: () => void;
  simLoot: (got: Partial<Resources>, gear?: GearItem[], rng?: number) => void;
  simEncounter: () => void;
  simExtract: () => void;
  simFail: () => void;
  equip: (survivorId: string, uid: string) => void;
  unequip: (survivorId: string, slot: EquipSlot) => void;
  discard: (uid: string) => void;
}

export const useGame = create<GameStore>((set, get) => ({
  run: null,
  hasSave: false,
  savePeek: null,
  help: false,
  dispatchOpen: false,
  logOpen: false,
  menu: "title",
  draftMode: "normal",
  draftLate: false,
  draftSandbox: { ...DEFAULT_SANDBOX },
  muted: false,
  boot: () => {
    useShop.getState().boot();
    const saved = loadSave();
    const { run, menu } = get();
    if (run) {
      set({ hasSave: !!saved, savePeek: peekOf(run) });
      return;
    }
    if (menu === "create" || menu === "shop" || menu === "mode") {
      set({ hasSave: !!saved, savePeek: peekOf(saved) });
      return;
    }
    set({ hasSave: !!saved, savePeek: peekOf(saved), muted: !!saved?.muted });
  },
  openMode: () => {
    unlockAudio();
    click();
    set({ menu: "mode", logOpen: false, dispatchOpen: false });
  },
  setDraftMode: (mode) => set({ draftMode: mode }),
  setDraftLate: (on) => set({ draftLate: on }),
  setDraftSandbox: (patch) => set({ draftSandbox: { ...get().draftSandbox, ...patch } }),
  openCreate: () => {
    unlockAudio();
    click();
    set({ menu: "create", logOpen: false, dispatchOpen: false });
  },
  openTitle: () => set({ menu: "title" }),
  parkTitle: () => {
    const run = get().run;
    if (run) writeSave(run);
    set({ run: null, menu: "title", dispatchOpen: false, logOpen: false, hasSave: !!run || get().hasSave, savePeek: peekOf(run) ?? get().savePeek });
  },
  openShop: () => {
    unlockAudio();
    click();
    set({ menu: "shop", logOpen: false });
  },
  closeShop: () => {
    click();
    set({ menu: "title" });
  },
  openHelp: () => {
    click();
    set({ help: true });
  },
  closeHelp: () => set({ help: false }),
  openLog: () => {
    click();
    set({ logOpen: true });
  },
  closeLog: () => set({ logOpen: false }),
  openDispatch: () => {
    click();
    set({ dispatchOpen: true });
  },
  closeDispatch: () => set({ dispatchOpen: false }),
  sendDispatch: (ids, task) => {
    const run = get().run;
    if (!run) return;
    if (!canStartDispatch(run, ids).ok) {
      warn();
      return;
    }
    ok();
    set({ run: persist(startDispatch(run, ids, task)), dispatchOpen: false });
  },
  newGame: (input) => {
    unlockAudio();
    ok();
    const run = persist(createNewGame({ ...input, mode: get().draftMode, sandbox: get().draftSandbox, scenario: get().draftLate ? "late" : null }));
    set({ run, hasSave: true, savePeek: peekOf(run), menu: "title", muted: run.muted, help: false, logOpen: false, dispatchOpen: false });
  },
  continueGame: () => {
    unlockAudio();
    click();
    const run = loadSave();
    if (run) set({ run, hasSave: true, savePeek: peekOf(run), muted: !!run.muted, help: false, dispatchOpen: false, logOpen: false });
    else set({ hasSave: false, savePeek: null, logOpen: false });
  },
  abandon: () => {
    clearSave();
    set({ run: null, hasSave: false, savePeek: null, menu: "title", help: false, logOpen: false, dispatchOpen: false });
  },
  setScreen: (screen) => {
    const run = get().run;
    if (!run) return;
    click();
    set({ run: persist({ ...run, screen }) });
  },
  setSquad: (ids) => {
    const run = get().run;
    if (!run) return;
    set({ run: { ...run, squadPick: ids } });
  },
  setMapTarget: (id) => {
    const run = get().run;
    if (!run) return;
    click();
    const kept = run.squadPick.filter((x) => {
      const s = run.survivors.find((p) => p.id === x && p.alive);
      return s && canMission(s) && !isAway(run, x);
    });
    const fallback = run.survivors.find((s) => canMission(s) && !isAway(run, s.id)) ?? run.survivors.find((s) => s.alive && !isAway(run, s.id));
    set({
      run: persist({
        ...run,
        mapTarget: id,
        screen: "squad",
        squadPick: kept.length ? kept : fallback ? [fallback.id] : [],
      }),
    });
  },
  goMission: () => {
    const run = get().run;
    if (!run || !run.mapTarget) return;
    const ids = run.squadPick.filter((id) => {
      const s = run.survivors.find((p) => p.id === id);
      return s && canMission(s) && !isAway(run, id);
    });
    if (!ids.length) return;
    ok();
    set({ run: persist(startMission(run, run.mapTarget, ids)) });
  },
  choose: (id) => {
    const run = get().run;
    if (!run) return;
    const next = missionChoice(run, id);
    if (next.ended) warn();
    else click();
    set({ run: persist(next) });
  },
  encounter: (a) => {
    const run = get().run;
    if (!run) return;
    if (a === "fight") warn();
    else ok();
    set({ run: persist(resolveEncounter(run, a)) });
  },
  occupy: () => {
    const run = get().run;
    if (!run) return;
    ok();
    set({ run: persist(occupyHere(run)) });
  },
  skipOccupy: () => {
    const run = get().run;
    if (!run) return;
    click();
    set({ run: persist(declineOccupy(run)) });
  },
  job: (id, job) => {
    const run = get().run;
    if (!run) return;
    click();
    set({ run: persist(assignJob(run, id, job)) });
  },
  kick: (id) => {
    const run = get().run;
    if (!run) return;
    warn();
    set({ run: persist(kickSurvivor(run, id)) });
  },
  upgrade: (id) => {
    const run = get().run;
    if (!run) return;
    ok();
    set({ run: persist(upgradeFacility(run, id)) });
  },
  repairWall: () => {
    const run = get().run;
    if (!run) return;
    ok();
    set({ run: persist(applyRepairWall(run)) });
  },
  sleep: () => {
    const run = get().run;
    if (!run) return;
    const next = restNight(run, true);
    if (!next.ended) useShop.getState().grantNight();
    if (next.ended) warn();
    else click();
    set({ run: persist(next) });
  },
  dose: (whoId, index, how) => {
    const run = get().run;
    if (!run) return;
    click();
    set({ run: persist(doseHerb(run, whoId, index, how)) });
  },
  toggleMute: () => {
    const run = get().run;
    const next = !get().muted;
    setMuted(next);
    if (next) setBgm("off");
    else unlockAudio();
    set({
      muted: next,
      run: run ? persist({ ...run, muted: next }) : run,
    });
  },
  simKill: (killerId?: string) => {
    const run = get().run;
    if (!run) return;
    set({ run: persist(missionKill(run, 1, killerId)) });
  },
  clearNotices: () => {
    const run = get().run;
    if (!run) return;
    set({ run: persist({ ...run, notices: [] }) });
  },
  simHurt: (id, dmg, infect) => {
    const run = get().run;
    if (!run) return;
    const next = missionStrike(run, id, dmg, infect);
    if (next.ended) warn();
    set({ run: persist(next) });
  },
  simLoot: (got, gear, rng) => {
    const run = get().run;
    if (!run) return;
    let next = grantMissionLoot(run, got, gear);
    if (rng != null) next = { ...next, rng };
    set({ run: persist(next) });
  },
  simEncounter: () => {
    const run = get().run;
    if (!run) return;
    set({ run: persist(forceEncounter(run)) });
  },
  simExtract: () => {
    const run = get().run;
    if (!run) return;
    ok();
    set({ run: persist(extractMission(run)) });
  },
  simFail: () => {
    const run = get().run;
    if (!run) return;
    warn();
    set({ run: persist(failMission(run)) });
  },
  equip: (survivorId, uid) => {
    const run = get().run;
    if (!run) return;
    click();
    set({ run: persist(equipItem(run, survivorId, uid)) });
  },
  unequip: (survivorId, slot) => {
    const run = get().run;
    if (!run) return;
    click();
    set({ run: persist(unequipSlot(run, survivorId, slot)) });
  },
  discard: (uid) => {
    const run = get().run;
    if (!run) return;
    click();
    set({ run: persist(applyDiscard(run, uid)) });
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      const run = useGame.getState().run;
      if (run) writeSave(run);
    }
  });
}