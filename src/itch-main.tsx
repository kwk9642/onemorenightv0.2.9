import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AshApp } from "@/components/game/AshApp";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AshApp />
  </StrictMode>,
);
