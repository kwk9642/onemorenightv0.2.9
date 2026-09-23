import { Component, useEffect, type ReactNode } from "react";
import { setBgm, unlockAudio } from "@/game/audio";
import { bootLocale, t } from "@/game/i18n";
import { loadSave } from "@/game/save";
import { useGame } from "@/game/store";
import { Button } from "@/components/ui/button";
import { CreateScreen } from "./CreateScreen";
import { BuildScreen, RosterScreen, ShelterScreen } from "./HubScreens";
import { MapScreen, SquadScreen } from "./MapScreens";
import { EncounterScreen, EndScreen, MissionScreen, OccupyScreen } from "./MissionScreens";
import { ShopScreen } from "./ShopScreen";
import { ModeScreen } from "./ModeScreen";
import { TitleScreen } from "./TitleScreen";
import { Shell } from "./chrome";
import { DataBible } from "./DataBible";
import { DevLogSheet } from "./DevLogSheet";
import { DispatchPanel } from "./DispatchPanel";

class GameCatch extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  render() {
    if (this.state.crashed) {
      return (
        <Shell>
          <div className="flex flex-1 flex-col justify-end gap-4 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <p className="font-serif text-3xl leading-none">{t("crash.title")}</p>
            <p className="text-sm leading-relaxed text-muted">{t("crash.body")}</p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                this.setState({ crashed: false });
                const saved = loadSave();
                if (saved) useGame.setState({ run: saved, hasSave: true, muted: !!saved.muted });
              }}
            >
              {t("crash.resume")}
            </Button>
          </div>
        </Shell>
      );
    }
    return this.props.children;
  }
}

export function AshApp() {
  const boot = useGame((s) => s.boot);
  const run = useGame((s) => s.run);
  const menu = useGame((s) => s.menu);
  const muted = useGame((s) => s.muted);
  const help = useGame((s) => s.help);
  const closeHelp = useGame((s) => s.closeHelp);
  const dispatchOpen = useGame((s) => s.dispatchOpen);
  const logOpen = useGame((s) => s.logOpen);
  const closeLog = useGame((s) => s.closeLog);
  const raw = run?.ended ? "end" : run?.screen;
  const screen =
    raw === "title" || raw === "create" ? "shelter" : (raw ?? (menu === "create" ? "create" : menu === "shop" ? "shop" : "title"));

  useEffect(() => {
    bootLocale();
    boot();
    const on = () => unlockAudio();
    window.addEventListener("pointerdown", on, { once: true });
    window.addEventListener("keydown", on, { once: true });
    return () => {
      window.removeEventListener("pointerdown", on);
      window.removeEventListener("keydown", on);
    };
  }, [boot]);

  useEffect(() => {
    if (muted || run?.muted) {
      setBgm("off");
      return;
    }
    if (!run || screen === "title" || screen === "create" || menu === "shop" || menu === "mode") setBgm("title");
    else if (screen === "end") setBgm("end");
    else if (screen === "occupy") setBgm("occupy");
    else if (screen === "mission" || screen === "encounter") setBgm("mission");
    else setBgm("hub");
  }, [screen, run, muted, menu]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as unknown as { __ash?: unknown }).__ash = {
      screen,
      day: run?.day ?? 0,
      store: useGame,
    };
  }, [screen, run?.day]);

  if (menu === "shop") return <ShopScreen />;
  const bible = help ? (
    <div className="fixed inset-0 z-50 bg-bg">
      <DataBible onClose={closeHelp} />
    </div>
  ) : null;
  const logSheet = logOpen ? (
    <div className="fixed inset-0 z-50 bg-bg">
      <DevLogSheet onClose={closeLog} />
    </div>
  ) : null;
  const dispatchSheet =
    run && dispatchOpen ? (
      <div className="fixed inset-0 z-40 bg-bg">
        <DispatchPanel state={run} />
      </div>
    ) : null;

  if (!run) {
    if (menu === "create") {
      return (
        <>
          <CreateScreen />
          {bible}
          {logSheet}
        </>
      );
    }
    if (menu === "mode") {
      return (
        <>
          <ModeScreen />
          {bible}
          {logSheet}
        </>
      );
    }
    return (
      <>
        <TitleScreen muted={muted} />
        {bible}
        {logSheet}
      </>
    );
  }

  return (
    <GameCatch>
      {screen === "end" ? (
        <EndScreen state={run} />
      ) : screen === "encounter" ? (
        <EncounterScreen state={run} />
      ) : screen === "mission" ? (
        <MissionScreen state={run} />
      ) : screen === "occupy" ? (
        <OccupyScreen state={run} />
      ) : screen === "squad" ? (
        <SquadScreen state={run} />
      ) : screen === "map" ? (
        <MapScreen state={run} />
      ) : screen === "roster" ? (
        <RosterScreen state={run} />
      ) : screen === "build" ? (
        <BuildScreen state={run} />
      ) : (
        <ShelterScreen state={run} />
      )}
      {bible}
      {logSheet}
      {dispatchSheet}
    </GameCatch>
  );
}
