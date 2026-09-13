import { create } from "zustand";
import {
  assignJob,
  createNewGame,
  declineOccupy,
  kickSurvivor,
  missionChoice,
  occupyHere,
  resolveEncounter,
  restNight,
  startMission,
  upgradeFacility,
} from "./engine";
import { clearSave, loadSave, writeSave } from "./save";
import { click, ok, setMuted, unlockAudio, warn } from "./audio";
import type { CreateInput, FacilityId, GameState, JobId } from "./types";

function persist(s: GameState): GameState {
  writeSave(s);
  return s;
}

interface GameStore {
  run: GameState | null;
  hasSave: boolean;
  menu: "title" | "create";
  boot: () => void;
  openCreate: () => void;
  openTitle: () => void;
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
  sleep: () => void;
  toggleMute: () => void;
}

export const useGame = create<GameStore>((set, get) => ({
  run: null,
  hasSave: false,
  menu: "title",
  boot: () => {
    const saved = loadSave();
    set({ hasSave: !!saved });
  },
  openCreate: () => {
    unlockAudio();
    click();
    set({ menu: "create" });
  },
  openTitle: () => set({ menu: "title" }),
  newGame: (input) => {
    unlockAudio();
    ok();
    const run = persist(createNewGame(input));
    set({ run, hasSave: true, menu: "title" });
  },
  continueGame: () => {
    unlockAudio();
    click();
    const run = loadSave();
    if (run) set({ run, hasSave: true });
  },
  abandon: () => {
    clearSave();
    set({ run: null, hasSave: false, menu: "title" });
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
    const kept = run.squadPick.filter((x) => run.survivors.find((s) => s.id === x && s.alive));
    set({
      run: persist({
        ...run,
        mapTarget: id,
        screen: "squad",
        squadPick: kept.length ? kept : [run.survivors.find((s) => s.alive)!.id],
      }),
    });
  },
  goMission: () => {
    const run = get().run;
    if (!run || !run.mapTarget) return;
    ok();
    set({ run: persist(startMission(run, run.mapTarget, run.squadPick)) });
  },
  choose: (id) => {
    const run = get().run;
    if (!run) return;
    click();
    const next = missionChoice(run, id);
    if (next.ended) warn();
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
  sleep: () => {
    const run = get().run;
    if (!run) return;
    const next = restNight(run, true);
    if (next.ended) warn();
    else click();
    set({ run: persist(next) });
  },
  toggleMute: () => {
    const run = get().run;
    const next = !(run?.muted ?? false);
    setMuted(next);
    if (run) set({ run: persist({ ...run, muted: next }) });
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
