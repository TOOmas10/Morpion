import type { Metadata } from "next";
import { Lien, Liste, MiseAJour, PageTexte, Rubrique } from "@/components/page-texte";
import { BASE_DE_DONNEES, DERNIERE_MISE_A_JOUR, EDITEUR, HEBERGEUR } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergeur et propriété intellectuelle du Morpion 7×6.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <PageTexte titre="Mentions légales">
      <Rubrique titre="Éditeur du site">
        <p>
          Le Morpion 7×6 est un projet personnel, gratuit, sans publicité et sans but commercial, édité par{" "}
          <strong>{EDITEUR.nom}</strong>, particulier.
        </p>
        <p>
          Contact : <Lien href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</Lien>
        </p>
        <p>Directeur de la publication : {EDITEUR.nom}.</p>
      </Rubrique>

      <Rubrique titre="Hébergement">
        <Liste>
          <li>
            Site : {HEBERGEUR.nom}, {HEBERGEUR.adresse} — <Lien href={HEBERGEUR.site}>vercel.com</Lien>
          </li>
          <li>
            Base de données : {BASE_DE_DONNEES.nom}, {BASE_DE_DONNEES.lieu} —{" "}
            <Lien href={BASE_DE_DONNEES.site}>neon.com</Lien>
          </li>
        </Liste>
      </Rubrique>

      <Rubrique titre="Propriété intellectuelle">
        <p>
          Le code, les textes, les dessins et le design du site sont l&apos;œuvre de {EDITEUR.nom}. Ils ne peuvent
          pas être réutilisés sans son accord.
        </p>
        <p>Le site utilise aussi des créations libres, merci à leurs auteurs :</p>
        <Liste>
          <li>polices Shantell Sans et Playwrite FR Trad, sous licence SIL Open Font License 1.1 ;</li>
          <li>Pyodide, qui fait tourner Python dans le navigateur, sous licence Mozilla Public License 2.0 ;</li>
          <li>le langage Python, sous licence Python Software Foundation.</li>
        </Liste>
      </Rubrique>

      <Rubrique titre="Données personnelles et cookies">
        <p>
          Tout est expliqué dans la <Lien href="/confidentialite">politique de confidentialité</Lien>. Les règles
          du jeu et de la communauté sont dans les <Lien href="/conditions">conditions d&apos;utilisation</Lien>.
        </p>
      </Rubrique>

      <Rubrique titre="Signaler un problème">
        <p>
          Un pseudo choquant, un bug ou un contenu qui te gêne ? Écris à{" "}
          <Lien href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</Lien>.
        </p>
      </Rubrique>

      <MiseAJour date={DERNIERE_MISE_A_JOUR} />
    </PageTexte>
  );
}
