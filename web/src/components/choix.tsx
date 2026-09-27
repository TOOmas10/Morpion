import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Couleur = "jaune" | "rose" | "vert" | "bleu";

const FONDS: Record<Couleur, string> = {
  jaune: "bg-postit-jaune",
  rose: "bg-postit-rose",
  vert: "bg-postit-vert",
  bleu: "bg-postit-bleu",
};

type PropsChoixPostIt = {
  href: string;
  couleur: Couleur;
  rotation?: number;
  children: ReactNode;
};

const CLASSE_POSTIT =
  "post-it flex size-32 cursor-pointer flex-col items-center justify-center gap-2 text-center text-2xl font-semibold text-encre transition-all duration-200 ease-out hover:-translate-y-1 hover:rotate-0 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-graphite focus-visible:outline-offset-2 sm:size-36";

export function ChoixPostIt({ href, couleur, rotation = 0, children }: PropsChoixPostIt) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-avant"]}
      style={{ rotate: `${rotation}deg` } as CSSProperties}
      className={cn(CLASSE_POSTIT, FONDS[couleur])}
    >
      {children}
    </Link>
  );
}

type PropsBoutonPostIt = {
  couleur: Couleur;
  rotation?: number;
  disabled?: boolean;
  children: ReactNode;
};

export function BoutonPostIt({
  couleur,
  rotation = 0,
  disabled = false,
  children,
}: PropsBoutonPostIt) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{ rotate: `${rotation}deg` } as CSSProperties}
      className={cn(CLASSE_POSTIT, FONDS[couleur], "disabled:cursor-wait disabled:opacity-70")}
    >
      {children}
    </button>
  );
}

type PropsCartePostIt = {
  couleur: Couleur;
  rotation?: number;
  children: ReactNode;
};

export function CartePostIt({ couleur, rotation = 0, children }: PropsCartePostIt) {
  return (
    <div
      style={{ rotate: `${rotation}deg` } as CSSProperties}
      className={cn(
        "post-it flex size-32 flex-col items-center justify-center gap-2 p-3 text-center text-encre sm:size-36",
        FONDS[couleur],
      )}
    >
      {children}
    </div>
  );
}

type PropsEtoiles = {
  n: number;
};

export function Etoiles({ n }: PropsEtoiles) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: n }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className="size-4 text-graphite"
          fill="var(--fluo-jaune)"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth={1}
          aria-hidden
        >
          <path d="M12 2 L14.7 9.2 L22 9.8 L16.3 14.6 L18.1 22 L12 17.8 L5.9 22 L7.7 14.6 L2 9.8 L9.3 9.2 Z" />
        </svg>
      ))}
    </div>
  );
}

type PropsRetour = {
  href: string;
  children?: ReactNode;
};

export function Retour({ href, children }: PropsRetour) {
  return (
    <Link
      href={href}
      transitionTypes={["nav-arriere"]}
      className="group self-start text-lg text-graphite underline-offset-4 hover:underline"
    >
      <span
        aria-hidden
        className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
      >
        ←
      </span>{" "}
      {children ?? "Retour"}
    </Link>
  );
}

type PropsChoix = {
  children: ReactNode;
};

export function Choix({ children }: PropsChoix) {
  return <div className="choix flex flex-wrap justify-center gap-6">{children}</div>;
}
