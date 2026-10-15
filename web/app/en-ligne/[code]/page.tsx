import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Choix, ChoixPostIt, Retour } from "@/components/choix";
import { InvitationRejoindre } from "@/components/formulaires-partie";
import { IconeBadge } from "@/components/icones-boutique";
import SalleEnLigne from "@/components/salle-en-ligne";
import TransitionPage from "@/components/transition-page";
import { badgeDe } from "@/lib/apparence";
import { chargerPartie, etatPour, lireInvitation, normaliserCode, symboleDe } from "@/lib/parties";
import { lireSession, pseudoDe } from "@/lib/session";

// Le titre et l'image d'aperçu nomment l'hôte : « Thomas t'invite à jouer » s'affiche quand le lien
// est partagé. La page elle-même n'est jamais indexée par les moteurs de recherche.
export async function generateMetadata({ params }: PageProps<"/en-ligne/[code]">): Promise<Metadata> {
  const invitation = await lireInvitation(normaliserCode((await params).code));
  const titre = invitation ? `${invitation.hote} t'invite à jouer` : "Partie en ligne";
  const description = invitation
    ? `Rejoins la partie de ${invitation.hote} au Morpion 7×6 : le premier qui aligne 4 symboles gagne.`
    : "Une partie en ligne du Morpion 7×6.";
  return {
    title: titre,
    description,
    robots: { index: false },
    openGraph: { title: `${titre} · Morpion 7×6`, description },
    twitter: { title: `${titre} · Morpion 7×6`, description },
  };
}

// Visiteur pas encore connecté : il voit d'abord qui l'invite, puis se connecte ou crée un compte.
function InvitationVisiteur({ code, hote, badge }: { code: string; hote: string; badge: ReturnType<typeof badgeDe> }) {
  const retour = encodeURIComponent(`/en-ligne/${code}`);
  return (
    <div className="flex flex-col items-center gap-6">
      <Retour href="/" />
      <h2 className="text-center text-lg font-semibold text-encre sm:text-2xl">
        <mark className="-rotate-1 rounded-sm bg-fluo-rose/55 px-1 text-encre">
          {hote}
          {badge && <IconeBadge badge={badge} className="ml-1" />}
        </mark>{" "}
        t&apos;invite à jouer !
      </h2>
      <p className="max-w-xs text-center text-graphite">
        Connecte-toi ou crée un compte gratuit (un pseudo suffit) pour rejoindre la partie.
      </p>
      <Choix>
        <ChoixPostIt href={`/connexion?retour=${retour}`} couleur="bleu" rotation={-2}>
          Se connecter
        </ChoixPostIt>
        <ChoixPostIt href={`/inscription?retour=${retour}`} couleur="vert" rotation={2}>
          Créer un compte
        </ChoixPostIt>
      </Choix>
    </div>
  );
}

function Message({ texte }: { texte: string }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Retour href="/en-ligne" />
      <p className="text-center text-lg font-semibold text-graphite sm:text-2xl">
        {texte}
      </p>
    </div>
  );
}

async function Contenu({ code, idUtilisateur }: { code: string; idUtilisateur: string }) {
  const partie = await chargerPartie(code);
  if (!partie) return <Message texte="Aucune partie avec ce code" />;

  const symbole = symboleDe(partie, idUtilisateur);
  if (symbole) {
    const etat = await etatPour(partie, symbole);
    return (
      <div className="flex flex-col items-center gap-4">
        <Retour href="/en-ligne" />
        <SalleEnLigne key={etat.code} etatInitial={etat} />
      </div>
    );
  }

  if (partie.statut === "EXPIREE") return <Message texte="Ce code a expiré" />;
  if (partie.statut !== "ATTENTE") {
    return <Message texte="Cette partie est déjà complète" />;
  }

  const badgeHote = badgeDe(partie.joueurX);
  return (
    <div className="flex flex-col items-center gap-6">
      <Retour href="/en-ligne" />
      <p className="text-center text-lg font-semibold text-encre sm:text-2xl">
        <mark className="-rotate-1 rounded-sm bg-fluo-rose/55 px-1 text-encre">
          {pseudoDe(partie.joueurX)}
          {badgeHote && <IconeBadge badge={badgeHote} className="ml-1" />}
        </mark>{" "}
        t&apos;invite à jouer !
      </p>
      <InvitationRejoindre code={code} />
    </div>
  );
}

export default async function SallePage({ params }: PageProps<"/en-ligne/[code]">) {
  const code = normaliserCode((await params).code);
  const session = await lireSession();
  if (!session) {
    const invitation = await lireInvitation(code);
    if (!invitation) redirect(`/connexion?retour=/en-ligne/${code}`);
    return (
      <TransitionPage>
        <InvitationVisiteur code={code} hote={invitation.hote} badge={invitation.badge} />
      </TransitionPage>
    );
  }

  return (
    <TransitionPage>
      <Contenu code={code} idUtilisateur={session.user.id} />
    </TransitionPage>
  );
}
