import type { CSSProperties } from "react";
import type { Apparence } from "@/lib/apparence";
import { COULEURS_CSS, type Forme, type Trace } from "@/lib/boutique";
import { cn } from "@/lib/utils";

function polygone(cotes: number, rayonExterieur: number, rayonInterieur = rayonExterieur): string {
  const sommets = rayonInterieur === rayonExterieur ? cotes : cotes * 2;
  const points = Array.from({ length: sommets }, (_, k) => {
    const angle = ((-90 + (k * 360) / sommets) * Math.PI) / 180;
    const rayon = k % 2 === 0 || rayonInterieur === rayonExterieur ? rayonExterieur : rayonInterieur;
    return `${(50 + rayon * Math.cos(angle)).toFixed(1)} ${(52 + rayon * Math.sin(angle)).toFixed(1)}`;
  });
  return `M ${points.join(" L ")} Z`;
}

function fleur(): string {
  const point = (angle: number, rayon: number) => {
    const a = (angle * Math.PI) / 180;
    return `${(50 + rayon * Math.cos(a)).toFixed(1)} ${(50 + rayon * Math.sin(a)).toFixed(1)}`;
  };
  const petales = Array.from({ length: 5 }, (_, k) => {
    const angle = -90 + k * 72;
    return `Q ${point(angle - 34, 40)} ${point(angle, 33)} Q ${point(angle + 34, 40)} 50 50`;
  });
  return `M 50 50 ${petales.join(" ")}`;
}

function spirale(): string {
  const points = Array.from({ length: 56 }, (_, k) => {
    const theta = (k / 55) * 3.4 * Math.PI;
    const rayon = 3 + 9.4 * (theta / Math.PI);
    return `${(50 + rayon * Math.cos(theta)).toFixed(1)} ${(50 + rayon * Math.sin(theta)).toFixed(1)}`;
  });
  return `M ${points.join(" L ")}`;
}

const TRAITS: Record<Forme, string[]> = {
  croix: ["M 22 22 C 40 38, 60 62, 78 78", "M 78 22 C 60 38, 40 62, 22 78"],
  rond: [
    "M 50 22 C 65 22 78 35 78 50 C 78 65 65 78 50 78 C 35 78 22 65 22 50 C 22 35 34 23 49 22 C 51 22 53 23 54 24",
  ],
  triangle: ["M 50 19 C 61 39 71 58 81 78 C 61 79 40 77 19 78 C 29 58 40 39 52 22"],
  carre: ["M 23 23 C 42 21 61 24 77 22 C 79 42 77 61 78 77 C 59 79 40 77 22 78 C 21 59 23 40 22 26"],
  losange: ["M 50 17 C 60 31 71 42 83 51 C 71 61 60 71 50 84 C 40 71 29 61 17 51 C 29 41 40 31 52 19"],
  hexagone: [polygone(6, 31)],
  coeur: [
    "M 50 79 C 33 67 18 55 19 39 C 20 27 31 21 40 23 C 46 25 49 30 50 35 C 51 30 54 25 60 23 C 69 21 80 27 81 39 C 82 55 67 67 50 79",
  ],
  lune: [
    "M 63 19 C 40 20 25 35 25 52 C 25 70 41 83 60 82 C 67 82 72 80 77 76 C 59 75 46 63 46 49 C 46 36 55 26 70 21 C 68 20 66 19 63 19",
  ],
  goutte: ["M 50 15 C 59 31 76 46 76 61 C 76 75 64 85 50 85 C 36 85 24 75 24 61 C 24 46 41 31 51 17"],
  etoile: [polygone(5, 33, 14)],
  eclair: ["M 60 14 L 33 54 L 52 53 L 41 86 L 70 43 L 50 44 L 61 15"],
  nuage: [
    "M 31 71 C 18 71 14 58 22 51 C 20 40 32 33 41 38 C 45 26 63 25 67 37 C 77 34 87 44 82 54 C 90 58 87 71 76 71 C 61 72 46 71 33 71",
  ],
  fleur: [fleur()],
  spirale: [spirale()],
};

type StyleTrace = {
  largeur: number;
  bout: "butt" | "round";
  opacite: number;
  melange?: boolean;
  filtre?: string;
  lueur?: boolean;
  pointilles?: boolean;
  double?: boolean;
  contour?: boolean;
};

const STYLES: Record<Trace, StyleTrace> = {
  surligneur: { largeur: 15, bout: "butt", opacite: 0.8, melange: true },
  stylo: { largeur: 3.5, bout: "round", opacite: 1 },
  feutre: { largeur: 10, bout: "round", opacite: 1 },
  crayon: { largeur: 5.5, bout: "round", opacite: 0.95, melange: true, filtre: "url(#trace-crayon)" },
  pointilles: { largeur: 8, bout: "round", opacite: 1, pointilles: true },
  double: { largeur: 5, bout: "round", opacite: 1, double: true },
  craie: { largeur: 12, bout: "round", opacite: 0.9, filtre: "url(#trace-craie)" },
  contour: { largeur: 13, bout: "round", opacite: 1, contour: true },
  pinceau: { largeur: 12, bout: "round", opacite: 0.95, filtre: "url(#trace-pinceau)" },
  neon: { largeur: 7, bout: "round", opacite: 1, lueur: true },
  paillettes: { largeur: 10, bout: "round", opacite: 1, filtre: "url(#trace-paillettes)", lueur: true },
};

type Passe = { trait: string; largeur: number; opacite: number; decalage?: number };

type PropsSymbole = {
  apparence: Apparence;
  anime?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Symbole({ apparence, anime = false, className, style }: PropsSymbole) {
  const couleur = COULEURS_CSS[apparence.couleur];
  const trace = STYLES[apparence.trace];
  const traits = TRAITS[apparence.forme];
  const duree = traits.length > 1 ? 200 : 350;
  const dessine = anime && !trace.pointilles;

  const passes: Passe[] = [];
  if (trace.double) passes.push({ trait: couleur.trait, largeur: trace.largeur, opacite: 0.85, decalage: 6 });
  passes.push({ trait: couleur.trait, largeur: trace.largeur, opacite: trace.opacite });
  if (trace.contour) passes.push({ trait: "#fffefa", largeur: trace.largeur * 0.42, opacite: 1 });

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(trace.melange && "mix-blend-multiply", anime && trace.pointilles && "pop", className)}
      fill="none"
      strokeLinecap={trace.bout}
      strokeLinejoin="round"
      aria-hidden
      data-forme={apparence.forme}
      data-couleur={apparence.couleur}
      data-trace={apparence.trace}
      style={{
        ...(trace.lueur && {
          filter: `drop-shadow(0 0 2px ${couleur.fond}) drop-shadow(0 0 6px ${couleur.fond})`,
        }),
        ...style,
      }}
    >
      <g filter={trace.filtre}>
        {passes.map((passe, numero) => (
          <g
            key={numero}
            stroke={passe.trait}
            strokeWidth={passe.largeur}
            strokeOpacity={passe.opacite}
            strokeDasharray={trace.pointilles ? "0.0001 0.075" : undefined}
            transform={passe.decalage ? `translate(${passe.decalage} ${passe.decalage})` : undefined}
          >
            {traits.map((d, index) => (
              <path
                key={index}
                d={d}
                pathLength={1}
                className={dessine ? "trace" : undefined}
                style={
                  dessine
                    ? ({ "--delai": `${index * 120}ms`, "--duree": `${duree}ms` } as CSSProperties)
                    : undefined
                }
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

export function FiltresTrace() {
  return (
    <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden focusable="false">
      <defs>
        <linearGradient id="degrade-arc-en-ciel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f03e3e" />
          <stop offset="0.2" stopColor="#ff9a1f" />
          <stop offset="0.4" stopColor="#ffd43b" />
          <stop offset="0.6" stopColor="#3ccf6a" />
          <stop offset="0.8" stopColor="#22b8f0" />
          <stop offset="1" stopColor="#a36bff" />
        </linearGradient>
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
        <filter id="trace-pinceau" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="5" result="bruit" />
          <feDisplacementMap in="SourceGraphic" in2="bruit" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="trace-paillettes" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="11" result="bruit" />
          <feColorMatrix
            in="bruit"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 11 -7.6"
            result="eclats"
          />
          <feComposite in="eclats" in2="SourceAlpha" operator="in" result="eclatsTrait" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="eclatsTrait" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
