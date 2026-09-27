import type { Metadata } from "next";
import Link from "next/link";
import { Retour } from "@/components/choix";
import { prisma } from "@/lib/prisma";
import { lireSession, pseudoDe } from "@/lib/session";
import { cn } from "@/lib/utils";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "Classement",
};

const TAILLE_PODIUM = 20;

type Ligne = {
  id: string;
  rang: number;
  pseudo: string;
  points: number;
};

function LigneClassement({
  ligne,
  estMoi,
  ordre,
}: {
  ligne: Ligne;
  estMoi: boolean;
  ordre: number;
}) {
  return (
    <li
      data-rang={ligne.rang}
      style={{ animationDelay: `${ordre * 45}ms` }}
      className={cn(
        "entree-ligne flex items-baseline gap-3 px-2 py-1",
        estMoi && "rounded-sm bg-fluo-jaune/45",
      )}
    >
      <span className="w-8 shrink-0 text-right font-semibold text-graphite">
        {ligne.rang}.
      </span>
      <span className="min-w-0 flex-1 truncate text-encre">
        {ligne.pseudo}
        {estMoi && <span className="text-graphite"> (toi)</span>}
      </span>
      <span className="shrink-0 font-semibold text-encre">
        {ligne.points} {ligne.points > 1 ? "pts" : "pt"}
      </span>
    </li>
  );
}

export default async function ClassementPage() {
  const session = await lireSession();
  const moi = session?.user.id;

  const meilleurs = await prisma.user.findMany({
    orderBy: [{ points: "desc" }, { createdAt: "asc" }],
    take: TAILLE_PODIUM,
    select: { id: true, name: true, username: true, displayUsername: true, points: true },
  });

  const lignes: Ligne[] = [];
  meilleurs.forEach((joueur, index) => {
    const precedente = lignes[index - 1];
    const rang =
      precedente && precedente.points === joueur.points ? precedente.rang : index + 1;
    lignes.push({ id: joueur.id, rang, pseudo: pseudoDe(joueur), points: joueur.points });
  });

  let maLigne: Ligne | null = null;
  if (session && moi && !lignes.some((ligne) => ligne.id === moi)) {
    const devant = await prisma.user.count({
      where: { points: { gt: session.user.points } },
    });
    maLigne = {
      id: moi,
      rang: devant + 1,
      pseudo: pseudoDe(session.user),
      points: session.user.points,
    };
  }

  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/" />
        <p className="font-ecole text-2xl text-encre">Tableau d&apos;honneur</p>
        <p className="text-sm text-graphite">
          En ligne : victoire 3 pts · nul 1 pt · défaite 0
        </p>
        {lignes.length === 0 ? (
          <p className="text-graphite">Personne n&apos;a encore joué en ligne.</p>
        ) : (
          <ol className="flex w-full max-w-xs flex-col text-lg">
            {lignes.map((ligne, index) => (
              <LigneClassement
                key={ligne.id}
                ligne={ligne}
                estMoi={ligne.id === moi}
                ordre={index}
              />
            ))}
            {maLigne && (
              <>
                <li className="px-2 text-center text-graphite" aria-hidden>
                  …
                </li>
                <LigneClassement ligne={maLigne} estMoi ordre={lignes.length} />
              </>
            )}
          </ol>
        )}
        {!session && (
          <Link
            href="/connexion?retour=/classement"
            className="inline-block py-1 text-graphite underline underline-offset-4"
          >
            Connecte-toi pour apparaître au classement
          </Link>
        )}
      </div>
    </TransitionPage>
  );
}
