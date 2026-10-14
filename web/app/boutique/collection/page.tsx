import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Retour } from "@/components/choix";
import TransitionPage from "@/components/transition-page";
import Vitrine from "@/components/vitrine";
import { lireVitrine } from "@/lib/boutique-serveur";

export const metadata: Metadata = {
  title: "Ma collection",
};

export default async function CollectionPage() {
  const donnees = await lireVitrine();
  if (!donnees.connecte) redirect("/connexion?retour=/boutique/collection");
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-5">
        <Retour href="/boutique" />
        <p className="font-ecole text-2xl text-encre">Ma collection</p>
        <Vitrine mode="collection" {...donnees} />
      </div>
    </TransitionPage>
  );
}
