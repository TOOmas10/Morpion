import type { ReactNode } from "react";
import { connection } from "next/server";
import Header from "@/components/header";
import {
  BlocPostIt,
  Crayon,
  Gomme,
  Surligneur,
  Trombone,
} from "@/components/fournitures";

async function DateDuJour() {
  await connection();
  const formatte = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date());
  const texte = formatte.charAt(0).toUpperCase() + formatte.slice(1);
  return (
    <p className="font-ecole text-xs text-graphite sm:text-sm">{texte}</p>
  );
}

export default function Bureau({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-full items-center justify-center overflow-x-clip px-4 py-10">
      <div className="relative flex w-full max-w-5xl justify-center">
        <div
          className="post-it bg-postit-rose pointer-events-none absolute top-8 left-0 z-10 hidden w-40 -rotate-4 p-3 text-sm text-encre lg:block"
          aria-hidden
        >
          <p>Défi :</p>
          <p>faire match nul contre l&apos;IA en difficile !</p>
        </div>
        <Crayon className="pointer-events-none absolute bottom-28 -left-6 z-10 hidden w-28 rotate-[35deg] lg:block" />
        <BlocPostIt className="pointer-events-none absolute bottom-6 left-4 z-10 hidden w-16 -rotate-6 lg:block" />
        <div className="pointer-events-none absolute right-2 bottom-16 z-10 hidden lg:flex lg:items-end">
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
        <Gomme className="pointer-events-none absolute right-6 bottom-1 z-10 hidden w-20 rotate-6 lg:block" />

        <div className="seyes relative w-full max-w-[520px] rounded-sm pt-10 pr-6 pb-8 pl-16 shadow-[0_18px_40px_-12px_rgb(90_60_20/0.45)] lg:-rotate-1">
          <div
            className="pointer-events-none absolute top-10 bottom-10 left-5 flex flex-col justify-between"
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

          <div className="text-right">
            <DateDuJour />
          </div>
          <div className="mt-3 lg:mt-4">
            <Header />
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </main>
  );
}
