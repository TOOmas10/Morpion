"use client";

import Link from "next/link";
import type { ReactNode, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { commencerPartieLocale, terminerPartieLocale, type GainLocal } from "@app/jouer/actions";
import BoutonGomme from "./bouton-gomme";
import { IconePiece } from "./icones-boutique";
import PlateauJeu from "./plateau";
import { Symbole } from "./symbole";
import { apparencesPartie, type Apparence, type Camp, type Equipement } from "@/lib/apparence";
import { authClient, rafraichirCompte } from "@/lib/auth-client";
import { COULEURS_CSS, PLAFOND_LOCAL_24H } from "@/lib/boutique";
import { ALIGNEMENT, CASES } from "@/lib/grille";
import {
  chargerMoteur,
  VIDE,
  HUMAIN,
  IA,
  type Analyse,
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

function couleurStatut(statut: Statut, apparences: Record<Camp, Apparence>): string {
  if (statut === "chargement") return "var(--graphite)";
  if (statut === "nul") return "var(--vert-fonce)";
  const camp: Camp = statut === "tonTour" || statut === "gagne" ? "X" : "O";
  return COULEURS_CSS[apparences[camp].couleur].texte;
}

const NOMS_NIVEAU: Record<Niveau, string> = {
  facile: "Facile",
  moyen: "Moyen",
  difficile: "Difficile",
};

const PLATEAU_VIDE: Plateau = new Array<Case>(CASES).fill(VIDE);

function finDe(analyse: Analyse): ResultatPartie | null {
  if (analyse.gagnant === HUMAIN) return "gagne";
  if (analyse.gagnant === IA) return "perdu";
  if (analyse.plein) return "nul";
  return null;
}

function attendre(ms: number): Promise<void> {
  return new Promise((resoudre) => setTimeout(resoudre, ms));
}

function NomJoueur({ joueur, apparence }: { joueur: Case; apparence: Apparence }) {
  return (
    <mark
      className="-rotate-1 rounded-sm px-1 text-encre box-decoration-clone"
      style={{
        backgroundColor: `color-mix(in srgb, ${COULEURS_CSS[apparence.couleur].fond} 55%, transparent)`,
      }}
    >
      {joueur === HUMAIN ? "Joueur 1" : "Joueur 2"}
    </mark>
  );
}

function contenuStatutDuo(
  statut: Statut,
  joueur: Case,
  apparences: Record<Camp, Apparence>,
): ReactNode {
  const camp: Camp = joueur === HUMAIN ? "X" : "O";
  switch (statut) {
    case "tonTour":
      return (
        <>
          <Symbole apparence={apparences[camp]} className="size-6 shrink-0" />
          <span>
            Au tour de <NomJoueur joueur={joueur} apparence={apparences[camp]} />
          </span>
        </>
      );
    case "gagne":
      return (
        <>
          <NomJoueur joueur={HUMAIN} apparence={apparences.X} /> gagne !
        </>
      );
    case "perdu":
      return (
        <>
          <NomJoueur joueur={IA} apparence={apparences.O} /> gagne !
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

function MessageGain({ gain, connecte }: { gain: GainLocal | null; connecte: boolean }) {
  if (!connecte) {
    return (
      <Link href="/connexion" className="text-xs text-graphite underline underline-offset-4 sm:text-sm">
        Connecte-toi pour gagner des pièces
      </Link>
    );
  }
  if (!gain) return null;
  if (gain.gain === 0) {
    return (
      <p className="text-xs text-graphite sm:text-sm">
        Plafond atteint : {PLAFOND_LOCAL_24H} pièces par 24 h en solo
      </p>
    );
  }
  return (
    <p className="pop flex items-center gap-1 text-sm font-semibold text-encre" data-gain={gain.gain}>
      +{gain.gain} <IconePiece /> {gain.gain > 1 ? "pièces" : "pièce"}
    </p>
  );
}

function demarrerManche(
  jeton: RefObject<string | null>,
  connecte: boolean,
  mode: Mode,
  niveau: Niveau,
) {
  jeton.current = null;
  if (!connecte) return;
  commencerPartieLocale(mode, mode === "ia" ? niveau : undefined)
    .then((id) => {
      jeton.current = id;
    })
    .catch(() => {});
}

export default function Morpion({ mode, niveau = "difficile" }: PropsMorpion) {
  const { data: session } = authClient.useSession();
  const connecte = session != null;
  const { forme, couleur, trace, badge } = session?.user ?? {};
  const equipement = useMemo<Equipement | null>(
    () => (connecte ? { forme, couleur, trace, badge } : null),
    [connecte, forme, couleur, trace, badge],
  );
  const apparences = useMemo(() => apparencesPartie(equipement, null), [equipement]);
  const occupeRef = useRef(false);
  const jetonRef = useRef<string | null>(null);
  const [gainLocal, setGainLocal] = useState<GainLocal | null>(null);
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
  useEffect(() => {
    demarrerManche(jetonRef, connecte, mode, niveau);
  }, [connecte, mode, niveau]);
  function enregistrerScore(fin: ResultatPartie) {
    setScore((s) => ({ ...s, [fin]: s[fin] + 1 }));
  }
  function terminer(fin: ResultatPartie, analyse: Analyse) {
    setStatut(fin);
    setLigne(analyse.ligne);
    enregistrerScore(fin);
  }

  async function cliquer(index: number) {
    const moteur = moteurRef.current;
    if (!moteur || occupeRef.current || statut !== "tonTour" || plateau[index] !== VIDE) return;
    occupeRef.current = true;
    try {
      const apres = [...plateau];
      apres[index] = mode === "duo" ? joueur : HUMAIN;
      setPlateau(apres);
      const analyse = await moteur.analyser(apres);
      const fin = finDe(analyse);
      if (fin) {
        terminer(fin, analyse);
        return;
      }
      if (mode === "duo") {
        setJoueur(joueur === HUMAIN ? IA : HUMAIN);
        return;
      }

      setStatut("iaReflechit");
      const [coup] = await Promise.all([moteur.coupIA(apres, niveau), attendre(450)]);
      const apresIA = [...apres];
      apresIA[coup] = IA;
      setPlateau(apresIA);
      const analyseIA = await moteur.analyser(apresIA);
      const finIA = finDe(analyseIA);
      if (finIA) terminer(finIA, analyseIA);
      else setStatut("tonTour");
    } catch {
      setStatut("erreur");
    } finally {
      occupeRef.current = false;
    }
  }

  function rejouer() {
    setPlateau(PLATEAU_VIDE);
    setStatut("tonTour");
    setLigne(null);
    setJoueur(HUMAIN);
    setGainLocal(null);
    demarrerManche(jetonRef, connecte, mode, niveau);
  }

  const partieTerminee =
    statut === "gagne" || statut === "perdu" || statut === "nul";

  useEffect(() => {
    const jeton = jetonRef.current;
    if (!partieTerminee || !jeton) return;
    jetonRef.current = null;
    terminerPartieLocale(jeton, plateau.join(""))
      .then((resultatGain) => {
        if (!resultatGain) return;
        setGainLocal(resultatGain);
        rafraichirCompte();
      })
      .catch(() => {});
  }, [partieTerminee, plateau]);

  return (
    <div className="relative flex w-full max-w-[400px] flex-col items-center gap-3">
      <p
        key={mode === "duo" ? `${statut}-${joueur}` : statut}
        aria-live="polite"
        data-statut={statut}
        data-joueur={mode === "duo" ? joueur : undefined}
        className="pop flex h-9 min-w-0 items-center justify-center gap-2 text-base font-semibold whitespace-nowrap sm:text-2xl"
        style={{ color: mode === "duo" ? "var(--encre)" : couleurStatut(statut, apparences) }}
      >
        {mode === "duo" ? (
          contenuStatutDuo(statut, joueur, apparences)
        ) : (
          <>
            {statut === "tonTour" && (
              <Symbole apparence={apparences.X} className="size-6 shrink-0" />
            )}
            {statut === "iaReflechit" && (
              <Symbole apparence={apparences.O} className="size-6 shrink-0" />
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
        apparences={apparences}
        ligne={ligne}
        attenue={statut === "nul"}
        fete={statut === "gagne" || (mode === "duo" && statut === "perdu")}
      />
      <p className="-mt-2 text-xs text-graphite sm:text-sm">
        Aligne {ALIGNEMENT} symboles pour gagner
      </p>
      <div className="flex min-h-14 flex-col items-center justify-center gap-1">
        {partieTerminee && (
          <>
            <BoutonGomme texte="Rejouer" onClick={rejouer} autoFocus />
            <MessageGain gain={gainLocal} connecte={connecte} />
          </>
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
