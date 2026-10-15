import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import EspaceCompte from "@/components/espace-compte";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false },
};

export default function ComptePage() {
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-4">
        <Retour href="/" />
        <h2 className="font-ecole text-2xl text-encre">Mon compte</h2>
        <EspaceCompte />
      </div>
    </TransitionPage>
  );
}
