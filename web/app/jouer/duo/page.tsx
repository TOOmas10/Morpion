import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import Morpion from "@/components/morpion";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "À deux sur le même écran",
  description: "Joue au morpion 7×6 à deux sur le même téléphone ou ordinateur : le premier qui aligne 4 symboles gagne.",
  alternates: { canonical: "/jouer/duo" },
};

export default function PartieDuoPage() {
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/jouer" />
        <Morpion mode="duo" />
      </div>
    </TransitionPage>
  );
}
