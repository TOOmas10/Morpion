import type { Metadata } from "next";
import { Retour } from "@/components/choix";
import TransitionPage from "@/components/transition-page";
import Vitrine from "@/components/vitrine";

export const metadata: Metadata = {
  title: "Boutique",
};

export default function BoutiquePage() {
  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-5">
        <Retour href="/" />
        <p className="font-ecole text-2xl text-encre">Boutique</p>
        <Vitrine mode="boutique" />
      </div>
    </TransitionPage>
  );
}
