import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import TransitionPage from "@/components/transition-page";
import Vitrine from "@/components/vitrine";
import { lireVitrine } from "@/lib/boutique-serveur";

export const metadata: Metadata = {
  title: "Boutique",
};

export default async function BoutiquePage() {
  const donnees = await lireVitrine();
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-5">
        <Retour href="/" />
        <p className="font-ecole text-2xl text-encre">Boutique</p>
        <Vitrine mode="boutique" {...donnees} />
      </div>
    </TransitionPage>
  );
}
