import type { Metadata } from "next";
import { Lien, Liste, MiseAJour, PageTexte, Rubrique } from "@/components/page-texte";
import { DERNIERE_MISE_A_JOUR, EDITEUR } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Les règles du Morpion 7×6 : compte, pseudo, pièces, fair-play.",
  alternates: { canonical: "/conditions" },
};

export default function ConditionsPage() {
  return (
    <PageTexte titre="Conditions d'utilisation">
      <p>En jouant au Morpion 7×6 et en créant un compte, tu acceptes ces règles simples.</p>

      <Rubrique titre="Le service">
        <p>
          Le Morpion est un jeu gratuit, sans publicité, édité par {EDITEUR.nom} à titre personnel. Tu peux jouer
          contre l&apos;ordinateur ou à deux sans compte. Le compte sert au jeu en ligne, au classement et à la
          boutique.
        </p>
      </Rubrique>

      <Rubrique titre="Ton compte">
        <Liste>
          <li>Garde ton mot de passe pour toi : tu es responsable de ce qui est fait avec ton compte.</li>
          <li>
            Ton pseudo est public. Pas d&apos;insulte, de propos haineux ou choquant, ni de pseudo qui se fait passer
            pour quelqu&apos;un d&apos;autre (« admin »…).
          </li>
          <li>
            Tu peux supprimer ton compte quand tu veux depuis <Lien href="/compte">Mon compte</Lien>.
          </li>
        </Liste>
      </Rubrique>

      <Rubrique titre="Fair-play">
        <p>
          Interdit de tricher : modifier le jeu, automatiser des parties, abuser d&apos;un bug ou créer plusieurs comptes
          pour gagner des points ou des pièces. En cas d&apos;abus, les points ou les pièces peuvent être retirés et le
          compte supprimé.
        </p>
      </Rubrique>

      <Rubrique titre="Les pièces">
        <p>
          Les pièces se gagnent seulement en jouant. Elles n&apos;ont <strong>aucune valeur en argent réel</strong> :
          elles ne s&apos;achètent pas, ne se revendent pas et ne s&apos;échangent pas. Les prix et les articles de la
          boutique peuvent évoluer.
        </p>
      </Rubrique>

      <Rubrique titre="Disponibilité">
        <p>
          Le site est fourni tel quel, sans garantie qu&apos;il marche tout le temps. Il peut évoluer, être mis en pause
          ou s&apos;arrêter. L&apos;éditeur ne peut pas être tenu responsable d&apos;une perte de points, de pièces ou de
          parties.
        </p>
      </Rubrique>

      <Rubrique titre="Tes données">
        <p>
          Voir la <Lien href="/confidentialite">politique de confidentialité</Lien>.
        </p>
      </Rubrique>

      <Rubrique titre="Changements et droit applicable">
        <p>
          Ces règles peuvent être mises à jour ; la date ci-dessous change alors. Elles sont soumises au droit
          français. Une question ? <Lien href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</Lien>.
        </p>
      </Rubrique>

      <MiseAJour date={DERNIERE_MISE_A_JOUR} />
    </PageTexte>
  );
}
