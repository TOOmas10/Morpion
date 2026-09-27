import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Retour } from "@/components/choix";
import { InvitationRejoindre } from "@/components/formulaires-partie";
import SalleEnLigne from "@/components/salle-en-ligne";
import TransitionPage from "@/components/transition-page";
import { chargerPartie, etatPour, normaliserCode, symboleDe } from "@/lib/parties";
import { lireSession, pseudoDe } from "@/lib/session";

export const metadata: Metadata = {
  title: "Partie en ligne",
};

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
        <SalleEnLigne etatInitial={etat} />
      </div>
    );
  }

  if (partie.statut === "EXPIREE") return <Message texte="Ce code a expiré" />;
  if (partie.statut !== "ATTENTE") {
    return <Message texte="Cette partie est déjà complète" />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Retour href="/en-ligne" />
      <p className="text-center text-lg font-semibold text-encre sm:text-2xl">
        <mark className="-rotate-1 rounded-sm bg-fluo-rose/55 px-1 text-encre">
          {pseudoDe(partie.joueurX)}
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
  if (!session) redirect(`/connexion?retour=/en-ligne/${code}`);

  return (
    <TransitionPage>
      <Contenu code={code} idUtilisateur={session.user.id} />
    </TransitionPage>
  );
}
