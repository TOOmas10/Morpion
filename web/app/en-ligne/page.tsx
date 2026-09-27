import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Choix, Retour } from "@/components/choix";
import { FormulaireCreer, FormulaireRejoindre } from "@/components/formulaires-partie";
import { limiteAttente } from "@/lib/parties";
import { prisma } from "@/lib/prisma";
import { lireSession } from "@/lib/session";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "En ligne",
};

export default async function EnLignePage() {
  const session = await lireSession();
  if (!session) redirect("/connexion?retour=/en-ligne");
  const moi = session.user.id;

  const aReprendre = await prisma.partie.findMany({
    where: {
      OR: [{ joueurXId: moi }, { joueurOId: moi }],
      AND: {
        OR: [
          { statut: "EN_COURS" },
          { statut: "ATTENTE", creeLe: { gt: limiteAttente() } },
        ],
      },
    },
    orderBy: { majLe: "desc" },
    take: 3,
    select: { code: true, statut: true },
  });

  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/jouer" />
        <p className="font-ecole text-2xl text-encre">Jouer en ligne</p>
        <Choix>
          <FormulaireCreer />
          <FormulaireRejoindre />
        </Choix>
        {aReprendre.length > 0 && (
          <p className="flex flex-wrap justify-center gap-x-3 text-graphite">
            Reprendre :
            {aReprendre.map((partie) => (
              <Link
                key={partie.code}
                href={`/en-ligne/${partie.code}`}
                className="inline-block py-1 font-semibold tracking-widest text-encre underline underline-offset-4"
              >
                {partie.code}
              </Link>
            ))}
          </p>
        )}
      </div>
    </TransitionPage>
  );
}
