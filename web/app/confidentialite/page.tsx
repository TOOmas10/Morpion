import type { Metadata } from "next";
import ChoixStatistiques from "@/components/choix-statistiques";
import { Lien, Liste, MiseAJour, PageTexte, Rubrique } from "@/components/page-texte";
import { JOURS_CONSERVATION, JOURS_SESSION } from "@/lib/conservation";
import { BASE_DE_DONNEES, DERNIERE_MISE_A_JOUR, EDITEUR, HEBERGEUR } from "@/lib/site";

export const metadata: Metadata = {
  title: "Confidentialité",
  description:
    "Quelles données le Morpion 7×6 garde, pourquoi, combien de temps, et comment les télécharger ou les supprimer.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <PageTexte titre="Politique de confidentialité">
      <p>
        Le Morpion demande le moins de choses possible : <strong>ni ton nom, ni ton âge, ni ton adresse email</strong>.
        Pas de publicité, pas de revente de données, pas de traceur publicitaire.
      </p>

      <Rubrique titre="Qui s'occupe de tes données ?">
        <p>
          {EDITEUR.nom}, qui édite le site (responsable du traitement). Pour toute question :{" "}
          <Lien href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</Lien>.
        </p>
      </Rubrique>

      <Rubrique titre="Ce qui est enregistré">
        <Liste>
          <li>
            <strong>Ton compte</strong> : ton pseudo (visible au classement et par tes adversaires), ton mot de passe
            sous forme d&apos;empreinte chiffrée (personne ne peut le relire), ta date d&apos;inscription et de dernière
            visite. L&apos;outil de connexion exige une adresse email : on en fabrique une fausse à partir du pseudo,
            aucune vraie adresse n&apos;est demandée.
          </li>
          <li>
            <strong>Ton jeu</strong> : points, pièces, articles achetés et équipés, parties en ligne (grille, résultat,
            adversaire, dates) et parties en solo (mode, niveau, pièces gagnées, pour le plafond anti-triche).
          </li>
          <li>
            <strong>Tes connexions</strong> : pour chaque appareil connecté, la date, l&apos;adresse IP et le type de
            navigateur, pour te protéger (et voir tes appareils dans « Mon compte »).
          </li>
          <li>
            <strong>Les compteurs anti-abus</strong> : l&apos;adresse IP et la page visée, pour freiner les essais de
            mots de passe en rafale.
          </li>
          <li>
            <strong>Les statistiques de visite</strong> (Vercel Analytics) : pages vues (sans les codes de partie), pays,
            type d&apos;appareil et site d&apos;où tu viens. Sans cookie : ton navigateur est reconnu par une empreinte
            qui change chaque jour, et seuls des totaux sont consultés.
          </li>
        </Liste>
      </Rubrique>

      <Rubrique titre="Pourquoi">
        <Liste>
          <li>Faire marcher le jeu, ton compte, le classement et la boutique (c&apos;est le service que tu demandes).</li>
          <li>Protéger les comptes et empêcher la triche (intérêt légitime).</li>
          <li>Savoir quelles pages sont utilisées pour améliorer le site (intérêt légitime, tu peux refuser).</li>
        </Liste>
      </Rubrique>

      <Rubrique titre="Combien de temps">
        <Liste>
          <li>
            Ton compte : jusqu&apos;à ce que tu le supprimes, ou après{" "}
            {Math.round(JOURS_CONSERVATION.comptesInactifs / 365)} ans sans aucune visite.
          </li>
          <li>Une connexion : {JOURS_SESSION} jours après ta dernière visite sur l&apos;appareil.</li>
          <li>Les parties en ligne terminées : {JOURS_CONSERVATION.partiesTerminees / 365} an.</li>
          <li>Les parties en ligne abandonnées : {JOURS_CONSERVATION.partiesNonTerminees} jours.</li>
          <li>Les parties en solo : {JOURS_CONSERVATION.partiesSolo} jours.</li>
          <li>Les compteurs anti-abus : 24 heures.</li>
          <li>L&apos;empreinte des statistiques : 24 heures (seuls les totaux sont gardés).</li>
        </Liste>
        <p>Tout est effacé automatiquement, chaque nuit.</p>
      </Rubrique>

      <Rubrique titre="Qui y a accès">
        <p>
          Seulement l&apos;éditeur, et deux prestataires techniques qui n&apos;utilisent les données que pour faire
          tourner le site :
        </p>
        <Liste>
          <li>
            {HEBERGEUR.nom} : hébergement du site et statistiques de visite (États-Unis) ;
          </li>
          <li>
            {BASE_DE_DONNEES.nom} : base de données, {BASE_DE_DONNEES.lieu}.
          </li>
        </Liste>
        <p>
          Ces transferts hors de l&apos;Union européenne sont encadrés par les garanties de ces prestataires
          (Data Privacy Framework UE–États-Unis et clauses contractuelles types de la Commission européenne).
        </p>
      </Rubrique>

      <Rubrique titre="Cookies et stockage dans ton navigateur">
        <Liste>
          <li>
            <strong>Un seul cookie</strong>, celui qui te garde connecté. Il est indispensable au service, donc
            aucun bandeau n&apos;est nécessaire.
          </li>
          <li>Une copie du jeu, pour qu&apos;il marche hors connexion (application installable).</li>
          <li>Ton choix sur les statistiques ci-dessous, s&apos;il y en a un.</li>
        </Liste>
        <ChoixStatistiques />
        <p className="text-xs text-graphite">
          Si ton navigateur envoie le signal « Global Privacy Control », tes visites ne sont jamais comptées.
        </p>
      </Rubrique>

      <Rubrique titre="Tes droits">
        <Liste>
          <li>
            <strong>Voir et récupérer tes données</strong> : bouton « Télécharger mes données » dans{" "}
            <Lien href="/compte">Mon compte</Lien>.
          </li>
          <li>
            <strong>Tout effacer</strong> : bouton « Supprimer mon compte » dans <Lien href="/compte">Mon compte</Lien>.
          </li>
          <li>
            <strong>Corriger, t&apos;opposer, limiter</strong> : écris à{" "}
            <Lien href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</Lien>, réponse sous un mois.
          </li>
        </Liste>
        <p>
          Si tu n&apos;es pas satisfait, tu peux te plaindre auprès de la CNIL :{" "}
          <Lien href="https://www.cnil.fr/fr/plaintes">cnil.fr</Lien>.
        </p>
      </Rubrique>

      <Rubrique titre="Si tu as moins de 15 ans">
        <p>
          Le jeu ne te demande aucune information sur toi. Montre quand même cette page à un parent : il peut
          t&apos;aider à choisir un pseudo qui ne révèle pas ton vrai nom.
        </p>
      </Rubrique>

      <Rubrique titre="Sécurité">
        <p>
          Connexion chiffrée (HTTPS), mots de passe jamais stockés en clair, essais de connexion limités, aucune donnée
          bancaire : la boutique utilise seulement des pièces gagnées en jouant.
        </p>
      </Rubrique>

      <MiseAJour date={DERNIERE_MISE_A_JOUR} />
    </PageTexte>
  );
}
