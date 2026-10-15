import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import TransitionPage from "@/components/transition-page";
import Vitrine from "@/components/vitrine";

export const metadata: Metadata = {
  title: "Ma collection",
  robots: { index: false },
};

export default function CollectionPage() {
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-4">
        <Retour href="/boutique" />
        <h2 className="font-ecole text-2xl text-encre">Ma collection</h2>
        <Vitrine mode="collection" />
      </div>
    </TransitionPage>
  );
}
