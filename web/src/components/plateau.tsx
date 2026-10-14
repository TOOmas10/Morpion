"use client";

import type { KeyboardEvent } from "react";
import { useState } from "react";
import Confettis from "@/components/confettis";
import { Grille, TraitGagnant } from "@/components/croquis";
import { Symbole } from "@/components/symbole";
import type { Apparence, Camp } from "@/lib/apparence";
import { CASES, COLONNES } from "@/lib/grille";
import { cn } from "@/lib/utils";

const DEPLACEMENTS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -COLONNES,
  ArrowDown: COLONNES,
};

type PropsPlateauJeu = {
  cases: string[];
  estJouable: (index: number) => boolean;
  surClic: (index: number) => void;
  fantome: Camp;
  apparences: Record<Camp, Apparence>;
  ligne: number[] | null;
  attenue?: boolean;
  fete?: boolean;
};

export default function PlateauJeu({
  cases,
  estJouable,
  surClic,
  fantome,
  apparences,
  ligne,
  attenue = false,
  fete = false,
}: PropsPlateauJeu) {
  const [active, setActive] = useState(Math.floor(CASES / 2));

  function naviguer(evenement: KeyboardEvent<HTMLDivElement>) {
    const deplacement = DEPLACEMENTS[evenement.key];
    if (deplacement === undefined) return;
    const colonne = active % COLONNES;
    if (deplacement === -1 && colonne === 0) return;
    if (deplacement === 1 && colonne === COLONNES - 1) return;
    const cible = active + deplacement;
    if (cible < 0 || cible >= CASES) return;
    evenement.preventDefault();
    setActive(cible);
    evenement.currentTarget
      .querySelector<HTMLButtonElement>(`[data-case="${cible}"]`)
      ?.focus();
  }

  return (
    <div className="relative aspect-[7/6] w-full">
      <Grille />
      {ligne && <TraitGagnant ligne={ligne} />}
      {fete && <Confettis />}
      <div
        role="group"
        aria-label="Grille de jeu"
        onKeyDown={naviguer}
        className={cn(
          "absolute inset-0 grid grid-cols-7 grid-rows-6 transition-opacity duration-500",
          attenue && "opacity-40",
        )}
      >
        {cases.map((valeur, index) => {
          const jouable = estJouable(index);
          return (
            <button
              key={index}
              type="button"
              data-case={index}
              tabIndex={index === active ? 0 : -1}
              aria-label={`Case ${index + 1} : ${valeur === " " ? "vide" : valeur}`}
              aria-disabled={!jouable}
              onFocus={() => setActive(index)}
              onClick={() => jouable && surClic(index)}
              className={cn(
                "group relative flex items-center justify-center p-[16%] outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-rose-fonce focus-visible:ring-inset",
                jouable ? "cursor-pointer" : "cursor-default",
              )}
            >
              {(valeur === "X" || valeur === "O") && (
                <Symbole
                  anime
                  apparence={apparences[valeur]}
                  className="size-full"
                  style={{ rotate: `${((index * 37) % 7) - 3}deg` }}
                />
              )}
              {valeur === " " && jouable && (
                <Symbole
                  apparence={apparences[fantome]}
                  className="size-full opacity-0 transition-opacity group-hover:opacity-25"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
