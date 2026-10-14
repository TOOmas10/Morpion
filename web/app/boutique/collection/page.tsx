import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import TransitionPage from "@/components/transition-page";
import Vitrine from "@/components/vitrine";

export const metadata: Metadata = {
  title: "Ma collection",
};

export default function CollectionPage() {
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-5">
        <Retour href="/boutique" />
        <p className="font-ecole text-2xl text-encre">Ma collection</p>
        <Vitrine mode="collection" />
      </div>
    </TransitionPage>
  );
}
