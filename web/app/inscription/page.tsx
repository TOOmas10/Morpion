import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Retour } from "@/components/choix";
import { FormulaireInscription } from "@/components/formulaires-compte";
import { retourSur } from "@/lib/retour";
import { lireSession } from "@/lib/session";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "Inscription",
  robots: { index: false },
};

export default async function InscriptionPage({
  searchParams,
}: PageProps<"/inscription">) {
  const retour = retourSur((await searchParams).retour);
  if (await lireSession()) redirect(retour);

  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/" />
        <h2 className="font-ecole text-2xl text-encre">Inscription</h2>
        <FormulaireInscription retour={retour} />
      </div>
    </TransitionPage>
  );
}
