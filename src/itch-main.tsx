import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AshApp } from "@/components/game/AshApp";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AshApp />
  </StrictMode>,
);

void (async () => {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return;
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#0d0c0a" });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch {
    /* browser build */
  }
})();

