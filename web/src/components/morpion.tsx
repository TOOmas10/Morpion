"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import BoutonGomme from "./bouton-gomme";
import { Croix, Rond } from "./croquis";
import PlateauJeu from "./plateau";
import { ALIGNEMENT, CASES } from "@/lib/grille";
import { cn } from "@/lib/utils";
import {
  chargerMoteur,
  VIDE,
  estPlein,
  ligneGagnante,
  coupIA,
  quiGagne,
  HUMAIN,
  IA,
  type Case,
  type Moteur,
  type Niveau,
  type Plateau,
} from "@/lib/moteur";

type Mode = "ia" | "duo";

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

const NOMS_NIVEAU: Record<Niveau, string> = {
  facile: "Facile",
  moyen: "Moyen",
  difficile: "Difficile",
};

const PLATEAU_VIDE: Plateau = new Array<Case>(CASES).fill(VIDE);

function resultat(moteur: Moteur, plateau: Plateau): Statut | null {
  const gagnant = quiGagne(moteur, plateau);
  if (gagnant === HUMAIN) return "gagne";
  if (gagnant === IA) return "perdu";
  if (estPlein(moteur, plateau)) return "nul";
  return null;
}

function NomJoueur({ joueur }: { joueur: Case }) {
  const estX = joueur === HUMAIN;
  return (
    <mark
      className={cn(
        "-rotate-1 rounded-sm px-1 text-encre box-decoration-clone",
        estX ? "bg-fluo-rose/55" : "bg-fluo-bleu/55",
      )}
    >
      {estX ? "Joueur 1" : "Joueur 2"}
    </mark>
  );
}

function contenuStatutDuo(statut: Statut, joueur: Case): ReactNode {
  switch (statut) {
    case "tonTour":
      return (
        <>
          {joueur === HUMAIN ? (
            <Croix className="size-6 text-fluo-rose" />
          ) : (
            <Rond className="size-6 text-fluo-bleu" />
          )}
          <span>
            Au tour de <NomJoueur joueur={joueur} />
          </span>
        </>
      );
    case "gagne":
      return (
        <>
          <NomJoueur joueur={HUMAIN} /> gagne !
        </>
      );
    case "perdu":
      return (
        <>
          <NomJoueur joueur={IA} /> gagne !
        </>
      );
    case "nul":
      return "Égalité !";
    default:
      return TEXTES[statut];
  }
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

type PropsMorpion = {
  mode: Mode;
  niveau?: Niveau;
};

export default function Morpion({ mode, niveau = "difficile" }: PropsMorpion) {
  const [plateau, setPlateau] = useState<Plateau>(PLATEAU_VIDE);
  const [statut, setStatut] = useState<Statut>("chargement");
  const [ligne, setLigne] = useState<number[] | null>(null);
  const [joueur, setJoueur] = useState<Case>(HUMAIN);
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

    if (mode === "duo") {
      const apres = [...plateau];
      apres[index] = joueur;
      setPlateau(apres);

      const fin = resultat(moteur, apres);
      if (fin) {
        setStatut(fin);
        if (fin === "gagne" || fin === "perdu") {
          setLigne(ligneGagnante(moteur, apres));
        }
        if (fin === "gagne" || fin === "perdu" || fin === "nul") {
          enregistrerScore(fin);
        }
        return;
      }
      setJoueur(joueur === HUMAIN ? IA : HUMAIN);
      return;
    }

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
      const coup = coupIA(moteur, apresToi, niveau);
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
    setJoueur(HUMAIN);
  }

  const partieTerminee =
    statut === "gagne" || statut === "perdu" || statut === "nul";

  return (
    <div className="relative flex w-full max-w-[400px] flex-col items-center gap-3">
      <p
        key={mode === "duo" ? `${statut}-${joueur}` : statut}
        aria-live="polite"
        data-statut={statut}
        data-joueur={mode === "duo" ? joueur : undefined}
        className={
          "pop flex h-9 min-w-0 items-center justify-center gap-2 text-base font-semibold whitespace-nowrap sm:text-2xl " +
          (mode === "duo" ? "text-encre" : COULEURS[statut])
        }
      >
        {mode === "duo" ? (
          contenuStatutDuo(statut, joueur)
        ) : (
          <>
            {statut === "tonTour" && (
              <Croix className="size-6 text-fluo-rose" />
            )}
            {statut === "iaReflechit" && (
              <Rond className="size-6 text-fluo-bleu" />
            )}
            {TEXTES[statut]}
          </>
        )}
      </p>
      <PlateauJeu
        cases={plateau}
        estJouable={(index) => statut === "tonTour" && plateau[index] === VIDE}
        surClic={cliquer}
        fantome={mode === "duo" && joueur === IA ? "O" : "X"}
        ligne={ligne}
        attenue={statut === "nul"}
        fete={statut === "gagne" || (mode === "duo" && statut === "perdu")}
      />
      <p className="-mt-2 text-xs text-graphite sm:text-sm">
        Aligne {ALIGNEMENT} symboles pour gagner
      </p>
      <div className="flex h-14 items-center">
        {partieTerminee && (
          <BoutonGomme texte="Rejouer" onClick={rejouer} autoFocus />
        )}
        {statut === "erreur" && (
          <BoutonGomme
            texte="Recharger"
            onClick={() => window.location.reload()}
            autoFocus
          />
        )}
      </div>
      <div
        className="post-it bg-postit-jaune relative mt-2 w-28 -rotate-2 p-2 text-sm lg:absolute lg:-right-[156px] lg:top-[48px] lg:mt-0 lg:w-36 lg:-rotate-3 lg:p-3 lg:text-base"
        aria-label={
          mode === "ia"
            ? `Score : toi ${score.gagne}, IA ${score.perdu}, nuls ${score.nul}`
            : `Score : J1 ${score.gagne}, J2 ${score.perdu}, nuls ${score.nul}`
        }
      >
        <p className="font-ecole text-base font-bold text-encre lg:text-lg">
          {mode === "ia" ? `Score · ${NOMS_NIVEAU[niveau]}` : "Score"}
        </p>
        <div className="mt-1 flex flex-col gap-1 text-graphite">
          <div className="flex items-center gap-2">
            <span className="w-9 shrink-0">{mode === "ia" ? "Toi" : "J1"}</span>
            <Batons nombre={score.gagne} />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-9 shrink-0">{mode === "ia" ? "IA" : "J2"}</span>
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
