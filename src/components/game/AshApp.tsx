import { useEffect } from "react";
import { unlockAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import { CreateScreen } from "./CreateScreen";
import { BuildScreen, RosterScreen, ShelterScreen } from "./HubScreens";
import { MapScreen, SquadScreen } from "./MapScreens";
import { EncounterScreen, EndScreen, MissionScreen, OccupyScreen } from "./MissionScreens";
import { TitleScreen } from "./TitleScreen";

export function AshApp() {
  const boot = useGame((s) => s.boot);
  const run = useGame((s) => s.run);
  const menu = useGame((s) => s.menu);
  const screen = run?.screen ?? (menu === "create" ? "create" : "title");

  useEffect(() => {
    boot();
    const on = () => unlockAudio();
    window.addEventListener("pointerdown", on, { once: true });
    return () => window.removeEventListener("pointerdown", on);
  }, [boot]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as unknown as { __ash?: unknown }).__ash = { screen, day: run?.day ?? 0 };
  }, [screen, run?.day]);

  if (!run) {
    if (menu === "create") return <CreateScreen />;
    return <TitleScreen muted={false} />;
  }
  if (screen === "create") return <CreateScreen />;
  if (screen === "title") return <TitleScreen muted={run.muted} />;
  if (screen === "end") return <EndScreen state={run} />;
  if (screen === "mission") return <MissionScreen state={run} />;
  if (screen === "encounter") return <EncounterScreen state={run} />;
  if (screen === "occupy") return <OccupyScreen state={run} />;
  if (screen === "squad") return <SquadScreen state={run} />;
  if (screen === "map") return <MapScreen state={run} />;
  if (screen === "roster") return <RosterScreen state={run} />;
  if (screen === "build") return <BuildScreen state={run} />;
  return <ShelterScreen state={run} />;
}
