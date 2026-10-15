import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Retour } from "@/components/choix";
import { FormulaireConnexion } from "@/components/formulaires-compte";
import { retourSur } from "@/lib/retour";
import { lireSession } from "@/lib/session";
import TransitionPage from "@/components/transition-page";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

export default async function ConnexionPage({
  searchParams,
}: PageProps<"/connexion">) {
  const retour = retourSur((await searchParams).retour);
  if (await lireSession()) redirect(retour);

  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/" />
        <h2 className="font-ecole text-2xl text-encre">Connexion</h2>
        <FormulaireConnexion retour={retour} />
      </div>
    </TransitionPage>
  );
}
