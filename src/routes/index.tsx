import { createFileRoute } from "@tanstack/react-router";
import { AshApp } from "@/components/game/AshApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AshApp />;
}
