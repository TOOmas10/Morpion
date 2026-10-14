import type { Metadata } from "next";
import Link from "next/link";
import { Retour } from "@/components/choix";
import { IconeBadge } from "@/components/icones-boutique";
import { badgeDe } from "@/lib/apparence";
import type { Badge } from "@/lib/boutique";
import { prisma } from "@/lib/prisma";
import { lireSession, pseudoDe } from "@/lib/session";
import { cn } from "@/lib/utils";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "Classement",
};

const PAR_PAGE = 5;

type Ligne = {
  id: string;
  rang: number;
  pseudo: string;
  points: number;
  badge: Badge | null;
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
        "entree-ligne flex items-baseline gap-3 px-2 py-0.5 sm:py-1",
        estMoi && "rounded-sm bg-fluo-jaune/45",
      )}
    >
      <span className="w-8 shrink-0 text-right font-semibold text-graphite">
        {ligne.rang}.
      </span>
      <span className="min-w-0 flex-1 truncate text-encre">
        {ligne.pseudo}
        {ligne.badge && <IconeBadge badge={ligne.badge} className="ml-1" />}
        {estMoi && <span className="text-graphite"> (toi)</span>}
      </span>
      <span className="shrink-0 font-semibold text-encre">
        {ligne.points} {ligne.points > 1 ? "pts" : "pt"}
      </span>
    </li>
  );
}

function numeroDePage(valeur: string | string[] | undefined): number {
  const nombre = Number(Array.isArray(valeur) ? valeur[0] : valeur);
  return Number.isInteger(nombre) && nombre > 1 ? nombre : 1;
}

function lienPage(page: number): string {
  return page > 1 ? `/classement?page=${page}` : "/classement";
}

function FlechePage({
  page,
  actif,
  libelle,
  children,
}: {
  page: number;
  actif: boolean;
  libelle: string;
  children: React.ReactNode;
}) {
  const classe =
    "flex size-10 items-center justify-center rounded-full border border-graphite/30 bg-white/70 text-xl text-encre";
  if (!actif) {
    return (
      <span aria-hidden className={cn(classe, "opacity-30")}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={lienPage(page)}
      scroll={false}
      aria-label={libelle}
      className={cn(
        classe,
        "transition hover:border-graphite/60 active:translate-y-0.5",
      )}
    >
      {children}
    </Link>
  );
}

export default async function ClassementPage({
  searchParams,
}: PageProps<"/classement">) {
  const [session, total, parametres] = await Promise.all([
    lireSession(),
    prisma.user.count(),
    searchParams,
  ]);
  const moi = session?.user.id;
  const pages = Math.max(1, Math.ceil(total / PAR_PAGE));
  const page = Math.min(numeroDePage(parametres.page), pages);
  const saut = (page - 1) * PAR_PAGE;

  const joueurs = await prisma.user.findMany({
    // L'id départage les égalités parfaites : l'ordre est stable d'une page à l'autre.
    orderBy: [{ points: "desc" }, { createdAt: "asc" }, { id: "asc" }],
    skip: saut,
    take: PAR_PAGE,
    select: {
      id: true,
      name: true,
      username: true,
      displayUsername: true,
      points: true,
      badge: true,
    },
  });

  // Rang « sportif » : les ex æquo partagent le même rang, le suivant saute des places.
  const devantLePremier = joueurs.length
    ? await prisma.user.count({ where: { points: { gt: joueurs[0].points } } })
    : 0;
  const lignes: Ligne[] = [];
  joueurs.forEach((joueur, index) => {
    const precedente = lignes[index - 1];
    const rang = !precedente
      ? devantLePremier + 1
      : precedente.points === joueur.points
        ? precedente.rang
        : saut + index + 1;
    lignes.push({
      id: joueur.id,
      rang,
      pseudo: pseudoDe(joueur),
      points: joueur.points,
      badge: badgeDe(joueur),
    });
  });

  let maLigne: Ligne | null = null;
  let maPage: number | null = null;
  if (session && moi && !lignes.some((ligne) => ligne.id === moi)) {
    const [devant, avantMoi] = await Promise.all([
      prisma.user.count({ where: { points: { gt: session.user.points } } }),
      prisma.user.count({
        where: {
          OR: [
            { points: { gt: session.user.points } },
            {
              points: session.user.points,
              createdAt: { lt: session.user.createdAt },
            },
            {
              points: session.user.points,
              createdAt: session.user.createdAt,
              id: { lt: moi },
            },
          ],
        },
      }),
    ]);
    maLigne = {
      id: moi,
      rang: devant + 1,
      pseudo: pseudoDe(session.user),
      points: session.user.points,
      badge: badgeDe(session.user),
    };
    maPage = Math.floor(avantMoi / PAR_PAGE) + 1;
  }

  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-4">
        <Retour href="/" />
        <p className="font-ecole text-2xl text-encre">Tableau d&apos;honneur</p>
        <p className="text-sm text-graphite">
          En ligne : victoire 3 pts · nul 1 pt · défaite 0
        </p>
        {lignes.length === 0 ? (
          <p className="text-graphite">
            Personne n&apos;a encore joué en ligne.
          </p>
        ) : (
          <ol key={page} className="flex w-full max-w-xs flex-col text-lg">
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
        {pages > 1 && (
          <nav
            className="flex flex-col items-center gap-2"
            aria-label="Pages du classement"
          >
            <div className="flex items-center gap-4">
              <FlechePage
                page={page - 1}
                actif={page > 1}
                libelle="Page précédente"
              >
                ‹
              </FlechePage>
              <span
                className="min-w-14 text-center text-graphite"
                data-page={page}
              >
                {page} / {pages}
              </span>
              <FlechePage
                page={page + 1}
                actif={page < pages}
                libelle="Page suivante"
              >
                ›
              </FlechePage>
            </div>
            {maPage && maPage !== page && (
              <Link
                href={lienPage(maPage)}
                scroll={false}
                className="py-1 text-sm text-graphite underline underline-offset-4"
              >
                Aller à ma page
              </Link>
            )}
          </nav>
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
