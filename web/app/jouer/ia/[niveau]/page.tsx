import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Retour } from "@/components/choix";
import Morpion from "@/components/morpion";
import { NIVEAUX, type Niveau } from "@/lib/moteur";
import TransitionPage from "@/components/transition-page";

const NOMS: Record<Niveau, string> = {
  facile: "Facile",
  moyen: "Moyen",
  difficile: "Difficile",
};

export function generateStaticParams() {
  return NIVEAUX.map((niveau) => ({ niveau }));
}

export async function generateMetadata({
  params,
}: PageProps<"/jouer/ia/[niveau]">): Promise<Metadata> {
  const { niveau } = await params;
  const estConnu = NIVEAUX.includes(niveau as Niveau);
  return { title: estConnu ? NOMS[niveau as Niveau] : "Niveau" };
}

export default async function PartieIAPage({
  params,
}: PageProps<"/jouer/ia/[niveau]">) {
  const { niveau } = await params;
  if (!NIVEAUX.includes(niveau as Niveau)) notFound();

  return (
    <TransitionPage>
      <div className="flex flex-col items-center gap-6">
        <Retour href="/jouer/ia" />
        <Morpion mode="ia" niveau={niveau as Niveau} />
      </div>
    </TransitionPage>
  );
}
