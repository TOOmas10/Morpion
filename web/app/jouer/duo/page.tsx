import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import Morpion from "@/components/morpion";
import TransitionPage from "@/components/transition-page";
import { equipementConnecte } from "@/lib/session";

export const metadata: Metadata = {
  title: "Duo",
};

export default async function PartieDuoPage() {
  const equipement = await equipementConnecte();
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/jouer" />
        <Morpion mode="duo" equipement={equipement} connecte={equipement !== null} />
      </div>
    </TransitionPage>
  );
}
