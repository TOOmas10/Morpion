import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import Morpion from "@/components/morpion";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "Duo",
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
