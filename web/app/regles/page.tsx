import type { Metadata } from "next";
import { Lien, Liste, PageTexte, Rubrique } from "@/components/page-texte";
import { PIECES_EN_LIGNE, PIECES_LOCALES, PLAFOND_LOCAL_24H } from "@/lib/boutique";

export const metadata: Metadata = {
  title: "Règles du jeu",
  description:
    "Les règles du morpion 7×6 : une grille de 7 colonnes et 6 lignes, le premier qui aligne 4 symboles gagne. Modes de jeu, points, pièces et astuces.",
  alternates: { canonical: "/regles" },
};

export default function ReglesPage() {
  return (
    <PageTexte titre="Règles du jeu">
      <p>
        Le Morpion 7×6, c&apos;est le morpion de la cour de récré en plus grand : une grille de{" "}
        <strong>7 colonnes et 6 lignes</strong> (42 cases), et il faut aligner <strong>4 symboles</strong> au lieu de 3.
      </p>

      <Rubrique titre="Comment on joue">
        <Liste>
          <li>Deux joueurs : les croix (X) et les ronds (O). Les X commencent.</li>
          <li>Chacun son tour, on pose son symbole dans n&apos;importe quelle case vide (pas de gravité, ce n&apos;est pas un puissance 4).</li>
          <li>
            Le premier qui aligne <strong>4 symboles</strong> à la suite gagne : en ligne, en colonne ou en diagonale.
          </li>
          <li>Si les 42 cases sont remplies sans alignement, c&apos;est un match nul.</li>
        </Liste>
      </Rubrique>

      <Rubrique titre="Les modes de jeu">
        <Liste>
          <li>
            <strong>Contre l&apos;IA</strong> : trois niveaux, facile, moyen et difficile. L&apos;IA est écrite en
            Python et calcule ses coups directement dans ton navigateur.{" "}
            <Lien href="/jouer/ia">Jouer contre l&apos;IA</Lien>
          </li>
          <li>
            <strong>À deux</strong> sur le même écran, chacun son tour. <Lien href="/jouer/duo">Jouer à deux</Lien>
          </li>
          <li>
            <strong>En ligne</strong> : crée une partie, envoie le code ou le lien à un ami, et jouez chacun sur votre
            appareil. Le hasard décide qui a les X. À la fin, un bouton « Revanche » relance une partie en inversant
            les camps.
          </li>
        </Liste>
      </Rubrique>

      <Rubrique titre="Points et classement">
        <p>
          Seules les parties en ligne comptent pour le <Lien href="/classement">classement</Lien> : victoire 3 points,
          match nul 1 point, défaite 0. Abandonner donne la victoire à l&apos;adversaire.
        </p>
      </Rubrique>

      <Rubrique titre="Pièces et boutique">
        <p>Avec un compte, chaque partie terminée rapporte des pièces :</p>
        <Liste>
          <li>
            en ligne : victoire {PIECES_EN_LIGNE.victoire}, nul {PIECES_EN_LIGNE.nul}, défaite{" "}
            {PIECES_EN_LIGNE.defaite} (rien en cas d&apos;abandon) ;
          </li>
          <li>
            contre l&apos;IA : facile {PIECES_LOCALES.facile}, moyen {PIECES_LOCALES.moyen}, difficile{" "}
            {PIECES_LOCALES.difficile} ; à deux : {PIECES_LOCALES.duo} (au plus {PLAFOND_LOCAL_24H} pièces par 24 h hors
            ligne).
          </li>
        </Liste>
        <p>
          Elles servent à acheter de nouvelles formes, couleurs, tracés et badges dans la{" "}
          <Lien href="/boutique">boutique</Lien>. Ton style te suit dans tous les modes.
        </p>
      </Rubrique>

      <Rubrique titre="Quelques astuces">
        <Liste>
          <li>Les cases du centre font partie de beaucoup plus d&apos;alignements possibles que les bords.</li>
          <li>Dès que l&apos;adversaire a 3 symboles alignés avec une case libre au bout, bloque-le.</li>
          <li>Le coup gagnant : créer deux menaces en même temps, il ne pourra en bloquer qu&apos;une.</li>
        </Liste>
      </Rubrique>
    </PageTexte>
  );
}
