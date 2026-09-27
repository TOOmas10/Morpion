import type { CSSProperties } from "react";

const COULEURS = [
  "var(--fluo-rose)",
  "var(--fluo-bleu)",
  "var(--fluo-jaune)",
  "var(--fluo-vert)",
];
const NOMBRE = 18;

const MORCEAUX = Array.from({ length: NOMBRE }, (_, i) => {
  const angle = (i / NOMBRE) * Math.PI * 2;
  const distance = 110 + (i % 3) * 35;
  return {
    background: COULEURS[i % COULEURS.length],
    "--dx": `${Math.round(Math.cos(angle) * distance)}px`,
    "--dy": `${Math.round(Math.sin(angle) * distance - 30)}px`,
    "--r": `${(i % 2 === 0 ? 1 : -1) * (180 + i * 25)}deg`,
    "--delai": `${(i % 4) * 40}ms`,
  } as CSSProperties;
});

export default function Confettis() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      {MORCEAUX.map((style, index) => (
        <span key={index} className="confetti" style={style} />
      ))}
    </div>
  );
}
