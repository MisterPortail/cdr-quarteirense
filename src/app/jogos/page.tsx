import type { Metadata } from "next";
import { MatchesPage } from "@/components/matches/MatchesPage";

export const metadata: Metadata = {
  title: "Jogos e Resultados",
  description: "Próximos jogos, campos, resultados e classificações de todas as equipas do CDR Quarteirense.",
};

export default function Page() {
  return <MatchesPage />;
}
