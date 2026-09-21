import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unlockAudio } from "@/game/audio";
import { asset } from "@/game/asset";
import { getLocale, tLoc, TIP_COUNT, useT } from "@/game/i18n";
import { useGame } from "@/game/store";
import { LangSwitch, Shell } from "./chrome";
import { FeedbackSheet } from "./FeedbackSheet";

function rollTip(except?: number) {
  let n = Math.floor(Math.random() * TIP_COUNT);
  if (except != null && TIP_COUNT > 1 && n === except) n = (n + 1) % TIP_COUNT;
  return n;
}

const SHOTS = [
  { src: "/shots/01-title.jpg?v=en", key: "ui.shot.1" },
  { src: "/shots/02-shelter.jpg?v=en", key: "ui.shot.2" },
  { src: "/shots/03-roster.jpg?v=en2", key: "ui.shot.3" },
] as const;

export function TitleScreen({ muted }: { muted: boolean }) {
  const tt = useT();
  const loc = getLocale();
  const continueGame = useGame((s) => s.continueGame);
  const openCreate = useGame((s) => s.openCreate);
  const openHelp = useGame((s) => s.openHelp);
  const hasSave = useGame((s) => s.hasSave);
  const savePeek = useGame((s) => s.savePeek);
  const toggleMute = useGame((s) => s.toggleMute);
  const storeMute = useGame((s) => s.muted);
  const quiet = muted || storeMute;
  const [tip, setTip] = useState(0);
  const [kit, setKit] = useState(false);
  const [fb, setFb] = useState(false);

  useEffect(() => {
    setTip(rollTip());
  }, []);

  const onMute = () => {
    unlockAudio();
    toggleMute();
  };

  return (
    <Shell>
      <div className="relative min-h-0 flex-1">
        <img
          src={asset("/art/title.jpg")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" />
        <LangSwitch className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] z-10" />
        <button
          type="button"
          onClick={onMute}
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex size-11 items-center justify-center rounded-md bg-bg/40 text-fg"
          aria-label={quiet ? tt("ui.unmute") : tt("ui.mute")}
        >
          {quiet ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16">
          <div className="stagger-in space-y-2">
            <div className="text-[11px] tracking-[0.28em] text-muted uppercase">{tt("ui.ver")}</div>
            <h1
              className={
                loc === "en"
                  ? "font-display text-[2.6rem] leading-[0.95] tracking-[0.08em]"
                  : "font-serif text-5xl leading-none"
              }
            >
              {tt("ui.title")}
            </h1>
            <p
              className={
                loc === "en"
                  ? "font-serif text-xl text-fg/90"
                  : "font-display text-sm tracking-[0.2em] text-fg/75 uppercase"
              }
            >
              {tt("ui.ash")}
            </p>
            <button
              type="button"
              onClick={() => setTip((n) => rollTip(n))}
              className="max-w-[22rem] text-left"
            >
              <div className="text-[11px] tracking-[0.22em] text-muted uppercase">{tt("ui.tip")}</div>
              <p className="mt-1 text-pretty text-sm leading-relaxed text-fg/85">{tt(`tip.${tip}`)}</p>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {hasSave ? (
              <div className="space-y-1">
                {savePeek ? (
                  <p className="text-center text-[11px] tracking-wide text-muted">
                    {tt("ui.savePeek", { n: savePeek.day, loc: tLoc(savePeek.loc) })}
                  </p>
                ) : null}
                <Button size="lg" className="w-full" onClick={continueGame}>
                  {tt("ui.continue")}
                </Button>
              </div>
            ) : null}
            <Button size="lg" variant={hasSave ? "secondary" : "default"} className="w-full" onClick={openCreate}>
              {tt("ui.new")}
            </Button>
            <Button size="lg" variant="secondary" className="w-full" onClick={openHelp}>
              {tt("bible.openBtn")}
            </Button>
            <button
              type="button"
              onClick={() => setFb(true)}
              className="h-11 text-[11px] tracking-[0.16em] text-muted uppercase"
            >
              {tt("fb.openBtn")}
            </button>
            {import.meta.env.DEV ? (
              <button
                type="button"
                onClick={() => setKit(true)}
                className="h-11 text-[11px] tracking-[0.16em] text-muted uppercase"
              >
                {tt("ui.kitOpen")}
              </button>
            ) : null}
          </div>
        </div>

        {fb ? <FeedbackSheet onClose={() => setFb(false)} /> : null}
        {kit ? (
          <div className="absolute inset-0 z-30 flex flex-col bg-bg/95">
            <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{tt("ui.kitHint")}</p>
              <button type="button" className="h-11 px-3 text-sm" onClick={() => setKit(false)}>
                {tt("ui.kitClose")}
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <p className="mb-2 text-[11px] tracking-[0.16em] text-muted uppercase">{tt("ui.coverHint")}</p>
              <img src={asset("/itch-cover.jpg")} width={630} height={500} alt="" className="mb-5 w-full rounded-md border border-border" />
              {SHOTS.map((shot) => (
                <div key={shot.src} className="mb-5">
                  <p className="mb-1.5 text-[11px] tracking-[0.16em] text-muted uppercase">{tt(shot.key)}</p>
                  <img src={asset(shot.src.split("?")[0])} alt="" className="w-full rounded-md border border-border" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Shell>
  );
}
