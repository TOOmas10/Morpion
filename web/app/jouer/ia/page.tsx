import type { Metadata } from "next";
import { Choix, ChoixPostIt, Etoiles, Retour } from "@/components/choix";
import PrechargerIA from "@/components/precharger-ia";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "Jouer contre l'IA",
  description: "Affronte une IA écrite en Python : niveau facile, moyen ou difficile. Aligne 4 symboles avant elle !",
  alternates: { canonical: "/jouer/ia" },
};

export default function NiveauPage() {
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/jouer" />
        <h2 className="font-ecole text-2xl text-encre">Choisis le niveau</h2>
        <Choix>
          <ChoixPostIt href="/jouer/ia/facile" couleur="vert" rotation={-2}>
            <Etoiles n={1} />
            Facile
          </ChoixPostIt>
          <ChoixPostIt href="/jouer/ia/moyen" couleur="jaune" rotation={1}>
            <Etoiles n={2} />
            Moyen
          </ChoixPostIt>
          <ChoixPostIt href="/jouer/ia/difficile" couleur="rose" rotation={-1}>
            <Etoiles n={3} />
            Difficile
            <span className="text-xs font-normal text-graphite">coriace</span>
          </ChoixPostIt>
        </Choix>
        <PrechargerIA />
      </div>
    </TransitionPage>
  );
}
