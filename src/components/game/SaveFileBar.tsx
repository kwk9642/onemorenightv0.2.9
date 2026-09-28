import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/game/i18n";
import { downloadSave, loadSave } from "@/game/save";
import { useGame } from "@/game/store";

export function SaveFileBar() {
  const tt = useT();
  const run = useGame((s) => s.run);
  const hasSave = useGame((s) => s.hasSave);
  const adoptSave = useGame((s) => s.adoptSave);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const exportFile = () => {
    const state = run ?? loadSave();
    if (!state) {
      setMsg(tt("save.none"));
      return;
    }
    downloadSave(state);
    setMsg(tt("save.wrote", { n: state.day }));
  };

  return (
    <div className="space-y-2">
      <p className="text-center text-[11px] leading-relaxed text-muted">{tt("save.note")}</p>
      <div className="grid grid-cols-2 gap-2">
        <Button size="lg" variant="secondary" className="w-full" disabled={!run && !hasSave} onClick={exportFile}>
          {tt("save.export")}
        </Button>
        <Button size="lg" variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>
          {tt("save.import")}
        </Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const data = JSON.parse(String(reader.result ?? ""));
              if (adoptSave(data)) setMsg(tt("save.kept"));
              else setMsg(tt("save.bad"));
            } catch {
              setMsg(tt("save.bad"));
            }
          };
          reader.readAsText(file);
        }}
      />
      {msg ? <p className="text-center text-[11px] leading-relaxed text-fg/80">{msg}</p> : null}
    </div>
  );
}
