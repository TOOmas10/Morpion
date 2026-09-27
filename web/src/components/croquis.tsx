import type { CSSProperties } from "react";
import { COLONNES, RANGEES } from "@/lib/grille";
import { cn } from "@/lib/utils";

type PropsForme = {
  anime?: boolean;
  className?: string;
  style?: CSSProperties;
};

const TAILLE_CASE = 100;
const LARGEUR = COLONNES * TAILLE_CASE;
const HAUTEUR = RANGEES * TAILLE_CASE;

function tremble(n: number): number {
  return ((n * 37) % 7) - 3;
}

const TRAITS = [
  ...Array.from({ length: COLONNES - 1 }, (_, i) => {
    const x = (i + 1) * TAILLE_CASE;
    return `M ${x + tremble(i)} 8 C ${x - tremble(i + 2)} ${HAUTEUR / 3} ${x + tremble(i + 4)} ${(HAUTEUR * 2) / 3} ${x - tremble(i + 1)} ${HAUTEUR - 8}`;
  }),
  ...Array.from({ length: RANGEES - 1 }, (_, i) => {
    const y = (i + 1) * TAILLE_CASE;
    return `M 8 ${y - tremble(i + 3)} C ${LARGEUR / 3} ${y + tremble(i + 5)} ${(LARGEUR * 2) / 3} ${y - tremble(i + 1)} ${LARGEUR - 8} ${y + tremble(i)}`;
  }),
];

export function Grille() {
  return (
    <svg
      viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
      className="absolute inset-0 size-full text-graphite"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={5}
      opacity={0.9}
      aria-hidden
    >
      {TRAITS.map((d, index) => (
        <path
          key={index}
          pathLength={1}
          className="trace"
          style={{ "--delai": `${index * 60}ms`, "--duree": "300ms" } as CSSProperties}
          d={d}
        />
      ))}
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
    x: TAILLE_CASE / 2 + TAILLE_CASE * (index % COLONNES),
    y: TAILLE_CASE / 2 + TAILLE_CASE * Math.floor(index / COLONNES),
  });

  const depart = centre(ligne[0]);
  const arrivee = centre(ligne[ligne.length - 1]);
  const dx = arrivee.x - depart.x;
  const dy = arrivee.y - depart.y;
  const longueur = Math.hypot(dx, dy) || 1;
  const ux = dx / longueur;
  const uy = dy / longueur;

  const debut = { x: depart.x - ux * 25, y: depart.y - uy * 25 };
  const fin = { x: arrivee.x + ux * 25, y: arrivee.y + uy * 25 };
  const milieu = { x: (debut.x + fin.x) / 2, y: (debut.y + fin.y) / 2 };
  const bombement = 8;
  const controle = {
    x: milieu.x - uy * bombement,
    y: milieu.y + ux * bombement,
  };

  return (
    <svg
      viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
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
        style={{ "--delai": "250ms", "--duree": "500ms" } as CSSProperties}
        d={`M ${debut.x} ${debut.y} Q ${controle.x} ${controle.y} ${fin.x} ${fin.y}`}
      />
    </svg>
  );
}
