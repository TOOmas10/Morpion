import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import Morpion from "@/components/morpion";

export const metadata: Metadata = {
  title: "Duo",
};

export default function PartieDuoPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Retour href="/jouer" />
      <Morpion mode="duo" />
    </div>
  );
}
