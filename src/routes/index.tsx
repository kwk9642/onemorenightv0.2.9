import { createFileRoute } from "@tanstack/react-router";
import { AshApp } from "@/components/game/AshApp";
import { DataBible } from "@/components/game/DataBible";

type Search = { rd?: "bible" };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    rd: s.rd === "bible" ? s.rd : undefined,
  }),
  component: Home,
});

function Home() {
  const { rd } = Route.useSearch();
  if (rd === "bible") return <DataBible />;
  return <AshApp />;
}