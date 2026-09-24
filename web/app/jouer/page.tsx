import type { Metadata } from "next";
import { Choix, ChoixPostIt, Retour } from "@/components/choix";
import { Croix, Rond } from "@/components/croquis";

export const metadata: Metadata = {
  title: "Jouer",
};

export default function JouerPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Retour href="/" />
      <p className="font-ecole text-2xl text-encre">Choisis ton mode</p>
      <Choix>
        <ChoixPostIt href="/jouer/ia" couleur="bleu" rotation={-2}>
          <Rond className="size-8 text-bleu-fonce" />
          Contre l’IA
        </ChoixPostIt>
        <ChoixPostIt href="/jouer/duo" couleur="rose" rotation={2}>
          <Croix className="size-8 text-rose-fonce" />
          Contre un joueur
        </ChoixPostIt>
      </Choix>
    </div>
  );
}
