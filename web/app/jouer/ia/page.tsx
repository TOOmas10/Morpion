import type { Metadata } from "next";
import { Choix, ChoixPostIt, Etoiles, Retour } from "@/components/choix";

export const metadata: Metadata = {
  title: "Niveau",
};

export default function NiveauPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Retour href="/jouer" />
      <p className="font-ecole text-2xl text-encre">Choisis le niveau</p>
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
          <span className="text-xs font-normal text-graphite">imbattable</span>
        </ChoixPostIt>
      </Choix>
    </div>
  );
}
