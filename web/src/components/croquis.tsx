import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type PropsForme = {
  anime?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Grille() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="absolute inset-0 size-full text-graphite"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.5}
      opacity={0.9}
      aria-hidden
    >
      <path
        pathLength={1}
        className="trace"
        style={{ "--delai": "0ms", "--duree": "350ms" } as CSSProperties}
        d="M 99 8 C 103 90 96 190 101 292"
      />
      <path
        pathLength={1}
        className="trace"
        style={{ "--delai": "150ms", "--duree": "350ms" } as CSSProperties}
        d="M 201 8 C 197 90 204 190 199 292"
      />
      <path
        pathLength={1}
        className="trace"
        style={{ "--delai": "300ms", "--duree": "350ms" } as CSSProperties}
        d="M 8 99 C 90 103 190 96 292 101"
      />
      <path
        pathLength={1}
        className="trace"
        style={{ "--delai": "450ms", "--duree": "350ms" } as CSSProperties}
        d="M 8 201 C 90 197 190 204 292 199"
      />
    </svg>
  );
}

export function Croix({ anime, className, style }: PropsForme) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("mix-blend-multiply", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="butt"
      strokeLinejoin="round"
      strokeWidth={15}
      aria-hidden
      style={style}
    >
      <path
        pathLength={1}
        strokeOpacity={0.8}
        className={anime ? "trace" : undefined}
        style={anime ? ({ "--delai": "0ms", "--duree": "200ms" } as CSSProperties) : undefined}
        d="M 22 22 C 40 38, 60 62, 78 78"
      />
      <path
        pathLength={1}
        strokeOpacity={0.8}
        className={anime ? "trace" : undefined}
        style={anime ? ({ "--delai": "120ms", "--duree": "200ms" } as CSSProperties) : undefined}
        d="M 78 22 C 60 38, 40 62, 22 78"
      />
    </svg>
  );
}

export function Rond({ anime, className, style }: PropsForme) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("mix-blend-multiply", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="butt"
      strokeLinejoin="round"
      strokeWidth={15}
      aria-hidden
      style={style}
    >
      <path
        pathLength={1}
        strokeOpacity={0.8}
        className={anime ? "trace" : undefined}
        style={anime ? ({ "--duree": "350ms" } as CSSProperties) : undefined}
        d="M 50 22 C 65 22 78 35 78 50 C 78 65 65 78 50 78 C 35 78 22 65 22 50 C 22 35 34 23 49 22 C 51 22 53 23 54 24"
      />
    </svg>
  );
}

type PropsTraitGagnant = {
  ligne: number[];
};

export function TraitGagnant({ ligne }: PropsTraitGagnant) {
  const centre = (index: number) => ({
    x: 50 + 100 * (index % 3),
    y: 50 + 100 * Math.floor(index / 3),
  });

  const depart = centre(ligne[0]);
  const arrivee = centre(ligne[2]);
  const dx = arrivee.x - depart.x;
  const dy = arrivee.y - depart.y;
  const longueur = Math.hypot(dx, dy) || 1;
  const ux = dx / longueur;
  const uy = dy / longueur;

  const debut = { x: depart.x - ux * 25, y: depart.y - uy * 25 };
  const fin = { x: arrivee.x + ux * 25, y: arrivee.y + uy * 25 };
  const milieu = { x: (debut.x + fin.x) / 2, y: (debut.y + fin.y) / 2 };
  const bombement = 6;
  const controle = {
    x: milieu.x - uy * bombement,
    y: milieu.y + ux * bombement,
  };

  return (
    <svg
      viewBox="0 0 300 300"
      className="absolute inset-0 size-full pointer-events-none mix-blend-multiply text-fluo-jaune"
      fill="none"
      stroke="currentColor"
      strokeLinecap="butt"
      strokeLinejoin="round"
      strokeWidth={46}
      opacity={0.75}
      aria-hidden
      data-trait="gagnant"
    >
      <path
        pathLength={1}
        className="trace"
        style={{ "--delai": "250ms", "--duree": "450ms" } as CSSProperties}
        d={`M ${debut.x} ${debut.y} Q ${controle.x} ${controle.y} ${fin.x} ${fin.y}`}
      />
    </svg>
  );
}
