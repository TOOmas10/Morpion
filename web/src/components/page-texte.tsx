import Link from "next/link";
import type { ReactNode } from "react";
import { Retour } from "@/components/choix";
import TransitionPage from "@/components/transition-page";

// Mise en page commune aux pages de texte (règles, mentions légales, confidentialité, conditions).
export function PageTexte({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <TransitionPage>
      <article className="flex flex-col items-center gap-4">
        <Retour href="/" />
        <h2 className="font-ecole text-center text-2xl text-encre">{titre}</h2>
        <div className="flex w-full max-w-prose flex-col gap-5 text-sm leading-relaxed text-encre sm:text-base">
          {children}
        </div>
      </article>
    </TransitionPage>
  );
}

export function Rubrique({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-ecole text-lg text-encre">{titre}</h3>
      {children}
    </section>
  );
}

export function Liste({ children }: { children: ReactNode }) {
  return <ul className="flex list-disc flex-col gap-1 pl-5">{children}</ul>;
}

export function Lien({ href, children }: { href: string; children: ReactNode }) {
  const externe = href.startsWith("http") || href.startsWith("mailto:");
  // py-1 : zone cliquable d'au moins 24 px ; [overflow-wrap:anywhere] : une longue adresse email peut aller à la ligne.
  const classe = "py-1 font-semibold underline underline-offset-4 [overflow-wrap:anywhere]";
  return externe ? (
    <a href={href} className={classe} {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}>
      {children}
    </a>
  ) : (
    <Link href={href} className={classe}>
      {children}
    </Link>
  );
}

export function MiseAJour({ date }: { date: string }) {
  return <p className="text-xs text-graphite">Dernière mise à jour : {date}</p>;
}
