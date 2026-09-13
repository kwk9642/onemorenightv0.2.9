import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setMuted as setAudioMuted, unlockAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import { Shell } from "./chrome";

export function TitleScreen({ muted }: { muted: boolean }) {
  const continueGame = useGame((s) => s.continueGame);
  const openCreate = useGame((s) => s.openCreate);
  const hasSave = useGame((s) => s.hasSave);
  const toggleMute = useGame((s) => s.toggleMute);
  const [localMute, setLocalMute] = useState(muted);
  const quiet = muted || localMute;

  const onMute = () => {
    unlockAudio();
    const next = !quiet;
    setLocalMute(next);
    setAudioMuted(next);
    toggleMute();
  };

  return (
    <Shell>
      <div className="relative min-h-0 flex-1">
        <img
          src="/art/title.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" />
        <button
          type="button"
          onClick={onMute}
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex size-11 items-center justify-center rounded-md bg-bg/40 text-fg"
          aria-label={quiet ? "開啟聲音" : "靜音"}
        >
          {quiet ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16">
          <div className="stagger-in space-y-2">
            <div className="text-[11px] tracking-[0.28em] text-muted uppercase">Kentucky — The Midwest</div>
            <h1 className="font-display text-5xl leading-none tracking-[0.12em]">ASH STATE</h1>
            <p className="text-lg text-fg/90">灰州</p>
            <p className="max-w-[22rem] text-pretty text-sm leading-relaxed text-muted">
              選一個人活下去。經營庇護所，派人進入美國廢土搜刮。倖存者可以是同伴，也可以是敵人。死了，就真的死了。
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="lg" className="w-full" onClick={openCreate}>
              新的倖存
            </Button>
            {hasSave ? (
              <Button size="lg" variant="secondary" className="w-full" onClick={continueGame}>
                繼續
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Shell>
  );
}
