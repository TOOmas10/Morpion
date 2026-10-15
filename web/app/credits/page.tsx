import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "Crédits",
  description: "Qui a créé le Morpion 7×6.",
  alternates: { canonical: "/credits" },
};

export default function CreditsPage() {
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/" />
        <h2 className="font-ecole text-2xl text-encre">Crédits</h2>
        <ul className="flex flex-col gap-2 text-lg text-encre">
          <li>Réalisé par Thomas Berthaud</li>
        </ul>
      </div>
    </TransitionPage>
  );
}
