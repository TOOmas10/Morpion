import type { CSSProperties } from "react";
import type { Apparence } from "@/lib/apparence";
import { COULEURS_CSS, type Forme, type Trace } from "@/lib/boutique";
import { cn } from "@/lib/utils";

function etoile(): string {
  const points = Array.from({ length: 10 }, (_, k) => {
    const angle = ((-90 + k * 36) * Math.PI) / 180;
    const rayon = k % 2 === 0 ? 33 : 14;
    const x = 50 + rayon * Math.cos(angle);
    const y = 53 + rayon * Math.sin(angle);
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return `M ${points.join(" L ")} Z`;
}

const TRAITS: Record<Forme, string[]> = {
  croix: ["M 22 22 C 40 38, 60 62, 78 78", "M 78 22 C 60 38, 40 62, 22 78"],
  rond: [
    "M 50 22 C 65 22 78 35 78 50 C 78 65 65 78 50 78 C 35 78 22 65 22 50 C 22 35 34 23 49 22 C 51 22 53 23 54 24",
  ],
  triangle: ["M 50 19 C 61 39 71 58 81 78 C 61 79 40 77 19 78 C 29 58 40 39 52 22"],
  carre: ["M 23 23 C 42 21 61 24 77 22 C 79 42 77 61 78 77 C 59 79 40 77 22 78 C 21 59 23 40 22 26"],
  coeur: [
    "M 50 79 C 33 67 18 55 19 39 C 20 27 31 21 40 23 C 46 25 49 30 50 35 C 51 30 54 25 60 23 C 69 21 80 27 81 39 C 82 55 67 67 50 79",
  ],
  etoile: [etoile()],
  eclair: ["M 60 14 L 33 54 L 52 53 L 41 86 L 70 43 L 50 44 L 61 15"],
};

type StyleTrace = {
  largeur: number;
  bout: "butt" | "round";
  opacite: number;
  melange: boolean;
  filtre?: string;
  neon?: boolean;
};

const STYLES: Record<Trace, StyleTrace> = {
  surligneur: { largeur: 15, bout: "butt", opacite: 0.8, melange: true },
  feutre: { largeur: 10, bout: "round", opacite: 1, melange: false },
  crayon: { largeur: 5.5, bout: "round", opacite: 0.95, melange: true, filtre: "url(#trace-crayon)" },
  craie: { largeur: 12, bout: "round", opacite: 0.9, melange: false, filtre: "url(#trace-craie)" },
  neon: { largeur: 7, bout: "round", opacite: 1, melange: false, neon: true },
};

type PropsSymbole = {
  apparence: Apparence;
  anime?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Symbole({ apparence, anime = false, className, style }: PropsSymbole) {
  const couleur = COULEURS_CSS[apparence.couleur].trait;
  const trace = STYLES[apparence.trace];
  const traits = TRAITS[apparence.forme];
  const duree = traits.length > 1 ? 200 : 350;
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(trace.melange && "mix-blend-multiply", className)}
      fill="none"
      stroke={couleur}
      strokeLinecap={trace.bout}
      strokeLinejoin="round"
      strokeWidth={trace.largeur}
      aria-hidden
      data-forme={apparence.forme}
      data-couleur={apparence.couleur}
      data-trace={apparence.trace}
      style={{
        ...(trace.neon && {
          filter: `drop-shadow(0 0 2px ${couleur}) drop-shadow(0 0 6px ${couleur})`,
        }),
        ...style,
      }}
    >
      <g filter={trace.filtre}>
        {traits.map((d, index) => (
          <path
            key={index}
            d={d}
            pathLength={1}
            strokeOpacity={trace.opacite}
            className={anime ? "trace" : undefined}
            style={
              anime
                ? ({ "--delai": `${index * 120}ms`, "--duree": `${duree}ms` } as CSSProperties)
                : undefined
            }
          />
        ))}
      </g>
    </svg>
  );
}

export function FiltresTrace() {
  return (
    <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden focusable="false">
      <defs>
        <filter id="trace-crayon" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="bruit" />
          <feDisplacementMap in="SourceGraphic" in2="bruit" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="trace-craie" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="bruit" />
          <feColorMatrix
            in="bruit"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75"
            result="trous"
          />
          <feComposite in="SourceGraphic" in2="trous" operator="in" result="texture" />
          <feDisplacementMap in="texture" in2="bruit" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
