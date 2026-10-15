import type { Metadata } from "next";
import { Choix, ChoixPostIt, Retour } from "@/components/choix";
import { Croix, Rond } from "@/components/croquis";
import PrechargerIA from "@/components/precharger-ia";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "Jouer",
  description: "Choisis ton mode de jeu : contre l'IA, à deux sur le même écran ou en ligne avec un ami.",
  alternates: { canonical: "/jouer" },
};

export default function JouerPage() {
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/" />
        <h2 className="font-ecole text-2xl text-encre">Choisis ton mode</h2>
        <Choix>
          <ChoixPostIt href="/jouer/ia" couleur="bleu" rotation={-2}>
            <Rond className="size-8 text-bleu-fonce" />
            Contre l’IA
          </ChoixPostIt>
          <ChoixPostIt href="/jouer/duo" couleur="rose" rotation={2}>
            <Croix className="size-8 text-rose-fonce" />
            Contre un joueur
          </ChoixPostIt>
          <ChoixPostIt href="/en-ligne" couleur="vert" rotation={-1}>
            <span className="flex items-center gap-1">
              <Croix className="size-6 text-rose-fonce" />
              <Rond className="size-6 text-bleu-fonce" />
            </span>
            En ligne
          </ChoixPostIt>
        </Choix>
        <PrechargerIA />
      </div>
    </TransitionPage>
  );
}
