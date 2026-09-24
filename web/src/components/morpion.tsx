"use client";

import { useEffect, useRef, useState } from "react";
import { Croix, Grille, Rond, TraitGagnant } from "./croquis";
import {
  chargerMoteur,
  VIDE,
  estPlein,
  ligneGagnante,
  meilleurCoup,
  quiGagne,
  HUMAIN,
  IA,
  type Case,
  type Moteur,
  type Plateau,
} from "@/lib/moteur";

type Statut =
  | "chargement"
  | "tonTour"
  | "iaReflechit"
  | "gagne"
  | "perdu"
  | "nul"
  | "erreur";

type ResultatPartie = "gagne" | "perdu" | "nul";

const TEXTES: Record<Statut, string> = {
  chargement: "L'IA taille son crayon…",
  tonTour: "À toi !",
  iaReflechit: "L'IA réfléchit…",
  gagne: "Gagné !",
  perdu: "Perdu !",
  nul: "Égalité !",
  erreur: "L'IA ne répond pas",
};

const COULEURS: Record<Statut, string> = {
  chargement: "text-graphite",
  tonTour: "text-rose-fonce",
  iaReflechit: "text-bleu-fonce",
  gagne: "text-rose-fonce",
  perdu: "text-bleu-fonce",
  nul: "text-vert-fonce",
  erreur: "text-bleu-fonce",
};

const PLATEAU_VIDE: Plateau = new Array<Case>(9).fill(VIDE);

function resultat(moteur: Moteur, plateau: Plateau): Statut | null {
  const gagnant = quiGagne(moteur, plateau);
  if (gagnant === HUMAIN) return "gagne";
  if (gagnant === IA) return "perdu";
  if (estPlein(moteur, plateau)) return "nul";
  return null;
}

function Batons({ nombre }: { nombre: number }) {
  if (nombre === 0) return null;
  const groupes = Math.floor(nombre / 5);
  const reste = nombre % 5;
  const paquets = [
    ...Array.from({ length: groupes }, () => 5),
    ...(reste > 0 ? [reste] : []),
  ];
  return (
    <svg
      viewBox={`0 0 ${paquets.length * 24} 20`}
      className="h-4 text-graphite"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      {paquets.map((taille, i) => {
        const ox = i * 24;
        return (
          <g key={i}>
            {Array.from({ length: taille === 5 ? 4 : taille }).map((_, j) => (
              <line
                key={j}
                x1={ox + 3 + j * 4}
                y1={17}
                x2={ox + 5 + j * 4}
                y2={3}
              />
            ))}
            {taille === 5 && <line x1={ox + 1} y1={4} x2={ox + 20} y2={16} />}
          </g>
        );
      })}
    </svg>
  );
}

function BoutonGomme({
  texte,
  onClick,
}: {
  texte: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      autoFocus
      onClick={onClick}
      className="gomme flex h-10 -rotate-2 cursor-pointer overflow-hidden rounded-md shadow-md transition active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-fonce"
    >
      <span className="w-[35%] bg-white" />
      <span className="flex items-center justify-center bg-[#4dabf7] px-6 text-xl font-semibold text-white">
        {texte}
      </span>
    </button>
  );
}

export default function Morpion() {
  const [plateau, setPlateau] = useState<Plateau>(PLATEAU_VIDE);
  const [statut, setStatut] = useState<Statut>("chargement");
  const [ligne, setLigne] = useState<number[] | null>(null);
  const [score, setScore] = useState<Record<ResultatPartie, number>>({
    gagne: 0,
    perdu: 0,
    nul: 0,
  });
  const moteurRef = useRef<Moteur | null>(null);
  useEffect(() => {
    chargerMoteur()
      .then((moteur) => {
        moteurRef.current = moteur;
        setStatut("tonTour");
      })
      .catch(() => {
        setStatut("erreur");
      });
  }, []);
  function enregistrerScore(fin: ResultatPartie) {
    setScore((s) => ({ ...s, [fin]: s[fin] + 1 }));
  }
  function cliquer(index: number) {
    const moteur = moteurRef.current;
    if (!moteur || statut !== "tonTour" || plateau[index] !== VIDE) return;

    const apresToi = [...plateau];
    apresToi[index] = HUMAIN;
    setPlateau(apresToi);

    const finApresToi = resultat(moteur, apresToi);
    if (finApresToi) {
      setStatut(finApresToi);
      if (finApresToi === "gagne" || finApresToi === "perdu") {
        setLigne(ligneGagnante(moteur, apresToi));
      }
      if (
        finApresToi === "gagne" ||
        finApresToi === "perdu" ||
        finApresToi === "nul"
      ) {
        enregistrerScore(finApresToi);
      }
      return;
    }
    setStatut("iaReflechit");

    setTimeout(() => {
      const coup = meilleurCoup(moteur, apresToi);
      const apresIA = [...apresToi];
      apresIA[coup] = IA;
      setPlateau(apresIA);
      const finApresIA = resultat(moteur, apresIA);
      setStatut(finApresIA ? finApresIA : "tonTour");
      if (finApresIA === "gagne" || finApresIA === "perdu") {
        setLigne(ligneGagnante(moteur, apresIA));
      }
      if (
        finApresIA === "gagne" ||
        finApresIA === "perdu" ||
        finApresIA === "nul"
      ) {
        enregistrerScore(finApresIA);
      }
    }, 450);
  }

  function rejouer() {
    setPlateau(PLATEAU_VIDE);
    setStatut("tonTour");
    setLigne(null);
  }

  const partieTerminee =
    statut === "gagne" || statut === "perdu" || statut === "nul";

  return (
    <div className="relative flex flex-col items-center gap-6">
      <p
        key={statut}
        aria-live="polite"
        data-statut={statut}
        className={
          "pop flex h-9 items-center gap-2 text-2xl font-semibold " +
          COULEURS[statut]
        }
      >
        {statut === "tonTour" && <Croix className="size-6 text-fluo-rose" />}
        {statut === "iaReflechit" && (
          <Rond className="size-6 text-fluo-bleu" />
        )}
        {TEXTES[statut]}
      </p>
      <div className="relative aspect-square w-[min(80vw,340px)]">
        <Grille />
        {ligne && <TraitGagnant ligne={ligne} />}
        <div
          className={
            "absolute inset-0 grid grid-cols-3 grid-rows-3 transition-opacity duration-500" +
            (statut === "nul" ? " opacity-40" : "")
          }
        >
          {plateau.map((valeur, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Case ${index + 1} : ${valeur === VIDE ? "vide" : valeur}`}
              disabled={statut !== "tonTour" || valeur !== VIDE}
              className="group relative flex items-center justify-center p-[18%] enabled:cursor-pointer disabled:cursor-default focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-rose-fonce focus-visible:outline-offset-[-6px]"
              onClick={() => cliquer(index)}
            >
              {valeur === HUMAIN && (
                <Croix
                  anime
                  className="size-full text-fluo-rose"
                  style={{ rotate: `${((index * 37) % 7) - 3}deg` }}
                />
              )}
              {valeur === IA && (
                <Rond
                  anime
                  className="size-full text-fluo-bleu"
                  style={{ rotate: `${((index * 37) % 7) - 3}deg` }}
                />
              )}
              {valeur === VIDE && (
                <Croix className="size-full text-fluo-rose opacity-0 transition-opacity group-enabled:group-hover:opacity-25" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex h-14 items-center">
        {partieTerminee && <BoutonGomme texte="Rejouer" onClick={rejouer} />}
        {statut === "erreur" && (
          <BoutonGomme
            texte="Recharger"
            onClick={() => window.location.reload()}
          />
        )}
      </div>
      <div
        className="post-it bg-postit-jaune relative mt-2 w-28 -rotate-2 p-2 text-sm lg:absolute lg:-right-[104px] lg:top-0 lg:mt-0 lg:w-36 lg:-rotate-3 lg:p-3 lg:text-base"
        aria-label={`Score : toi ${score.gagne}, IA ${score.perdu}, nuls ${score.nul}`}
      >
        <p className="font-ecole text-base font-bold text-encre lg:text-lg">
          Score
        </p>
        <div className="mt-1 flex flex-col gap-1 text-graphite">
          <div className="flex items-center gap-2">
            <span className="w-9 shrink-0">Toi</span>
            <Batons nombre={score.gagne} />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-9 shrink-0">IA</span>
            <Batons nombre={score.perdu} />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-9 shrink-0">Nuls</span>
            <Batons nombre={score.nul} />
          </div>
        </div>
      </div>
    </div>
  );
}
