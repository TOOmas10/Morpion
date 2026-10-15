import type { ReactNode } from "react";
import DateDuJour from "@/components/date-du-jour";
import EtiquetteCompte from "@/components/etiquette-compte";
import Header from "@/components/header";
import {
  BlocPostIt,
  Crayon,
  Gomme,
  Surligneur,
  Trombone,
} from "@/components/fournitures";
import Link from "next/link";

const LIENS_PIED = [
  ["/regles", "Règles du jeu"],
  ["/mentions-legales", "Mentions légales"],
  ["/confidentialite", "Confidentialité"],
  ["/conditions", "Conditions"],
] as const;

export default function Bureau({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="relative flex min-h-full items-center justify-center overflow-x-clip px-4 py-3 sm:py-6 lg:py-5">
        <div className="relative flex w-full max-w-5xl justify-center">
          <div
            className="post-it bg-postit-rose objet-arrive arrive-gauche delai-1 pointer-events-none absolute top-8 left-0 z-10 hidden w-40 -rotate-4 p-3 text-sm text-encre lg:block"
            aria-hidden
          >
            <p>Bonjour !</p>
            <p>Bienvenue sur ce morpion 7x6</p>
          </div>
          <Crayon className="objet-arrive arrive-gauche delai-2 pointer-events-none absolute bottom-28 -left-6 z-10 hidden w-28 rotate-[35deg] lg:block" />
          <BlocPostIt className="objet-arrive arrive-gauche delai-3 pointer-events-none absolute bottom-6 left-4 z-10 hidden w-16 -rotate-6 lg:block" />
          <div className="objet-arrive arrive-droite delai-1 pointer-events-none absolute right-2 bottom-16 z-10 hidden lg:flex lg:items-end">
            <Surligneur
              couleur="var(--fluo-rose)"
              ouvert
              className="w-20 -rotate-[24deg]"
            />
            <Surligneur
              couleur="var(--fluo-bleu)"
              className="-ml-8 w-20 -rotate-4"
            />
            <Surligneur
              couleur="var(--fluo-jaune)"
              className="-ml-8 w-20 rotate-[14deg]"
            />
          </div>
          <Gomme className="objet-arrive arrive-droite delai-2 pointer-events-none absolute right-6 bottom-1 z-10 hidden w-20 rotate-6 lg:block" />

          <div className="seyes feuille-arrive relative w-full max-w-[520px] rounded-sm pt-6 pr-3 pb-4 pl-12 shadow-[0_18px_40px_-12px_rgb(90_60_20/0.45)] sm:pt-8 sm:pr-6 sm:pb-6 sm:pl-16 lg:-rotate-1">
            <div
              className="pointer-events-none absolute top-10 bottom-10 left-3 flex flex-col justify-between sm:left-5"
              aria-hidden
            >
              <span className="size-3 rounded-full bg-bois shadow-[inset_0_1px_2px_rgb(0_0_0/0.3)]" />
              <span className="size-3 rounded-full bg-bois shadow-[inset_0_1px_2px_rgb(0_0_0/0.3)]" />
              <span className="size-3 rounded-full bg-bois shadow-[inset_0_1px_2px_rgb(0_0_0/0.3)]" />
            </div>
            <span
              className="scotch pointer-events-none absolute -top-2 left-6 h-6 w-16 -rotate-12"
              aria-hidden
            />
            <span
              className="scotch pointer-events-none absolute -top-2 right-8 h-6 w-16 rotate-6"
              aria-hidden
            />
            <Trombone className="pointer-events-none absolute -top-4 -left-3 hidden h-10 w-6 -rotate-12 sm:block" />

            <div className="flex min-h-7 items-baseline justify-between gap-3">
              <EtiquetteCompte />
              <DateDuJour />
            </div>
            <div className="mt-2">
              <Header />
            </div>
            <div className="mt-3">{children}</div>
            <nav
              aria-label="Informations sur le site"
              className="mt-4 flex flex-wrap justify-center gap-x-3 text-xs text-graphite"
            >
              {LIENS_PIED.map(([href, texte]) => (
                <Link key={href} href={href} className="py-1 underline-offset-4 hover:underline">
                  {texte}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </main>
    </>
  );
}
