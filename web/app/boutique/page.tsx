import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import TransitionPage from "@/components/transition-page";
import Vitrine from "@/components/vitrine";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Dépense les pièces gagnées en jouant : 47 formes, couleurs, tracés et badges pour personnaliser ton symbole.",
  alternates: { canonical: "/boutique" },
};

export default function BoutiquePage() {
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-4">
        <Retour href="/" />
        <h2 className="font-ecole text-2xl text-encre">Boutique</h2>
        <Vitrine mode="boutique" />
      </div>
    </TransitionPage>
  );
}
