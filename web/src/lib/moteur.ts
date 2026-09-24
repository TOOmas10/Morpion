import type { PyodideAPI, loadPyodide } from "pyodide";

declare global {
  interface Window {
    loadPyodide?: typeof loadPyodide;
  }
}

const URL_PYODIDE = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";

type ModuleMorpion = {
  meilleur_coup: (plateau: unknown) => number;
  coup_ia: (plateau: unknown, niveau: string) => number;
  gagnant: (plateau: unknown) => string | undefined;
  plein: (plateau: unknown) => boolean;
  LIGNES_GAGNANTES: { toJs: () => unknown; destroy: () => void };
};

export type Moteur = {
  pyodide: PyodideAPI;
  morpion: ModuleMorpion;
};

let chargement: Promise<Moteur> | null = null;

function chargerScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = URL_PYODIDE + "pyodide.js";
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error("Impossible de charger Pyodide"));
    };
    document.head.appendChild(script);
  });
}

async function charger(): Promise<Moteur> {
  await chargerScript();
  const lancer = window.loadPyodide;
  if (!lancer) throw new Error("loadPyodide introuvable");
  const pyodide = await lancer({ indexURL: URL_PYODIDE });
  const reponse = await fetch("/morpion.py");
  const code = await reponse.text();
  pyodide.FS.writeFile("/home/pyodide/morpion.py", code);
  const morpion = pyodide.pyimport("morpion") as ModuleMorpion;
  return { pyodide, morpion };
}

export function chargerMoteur(): Promise<Moteur> {
  if (!chargement) {
    chargement = charger().catch((erreur) => {
      chargement = null;
      throw erreur;
    });
  }
  return chargement;
}

export type Case = "X" | "O" | " ";

export type Plateau = Case[];

export const VIDE: Case = " ";
export const HUMAIN: Case = "X";
export const IA: Case = "O";

export function meilleurCoup(moteur: Moteur, plateau: Plateau): number {
  const liste = moteur.pyodide.toPy(plateau);
  try {
    return moteur.morpion.meilleur_coup(liste);
  } finally {
    liste.destroy();
  }
}

export type Niveau = "facile" | "moyen" | "difficile";

export const NIVEAUX: Niveau[] = ["facile", "moyen", "difficile"];

export function coupIA(moteur: Moteur, plateau: Plateau, niveau: Niveau): number {
  const liste = moteur.pyodide.toPy(plateau);
  try {
    return moteur.morpion.coup_ia(liste, niveau);
  } finally {
    liste.destroy();
  }
}

export function quiGagne(moteur: Moteur, plateau: Plateau): string | undefined {
  const liste = moteur.pyodide.toPy(plateau);
  try {
    return moteur.morpion.gagnant(liste);
  } finally {
    liste.destroy();
  }
}

export function estPlein(moteur: Moteur, plateau: Plateau): boolean {
  const liste = moteur.pyodide.toPy(plateau);
  try {
    return moteur.morpion.plein(liste);
  } finally {
    liste.destroy();
  }
}

export function ligneGagnante(moteur: Moteur, plateau: Plateau): number[] | null {
  const gagnant = quiGagne(moteur, plateau);
  if (!gagnant) return null;
  const proxy = moteur.morpion.LIGNES_GAGNANTES;
  try {
    const lignes = proxy.toJs() as number[][];
    return lignes.find((ligne) => ligne.every((i) => plateau[i] === gagnant)) ?? null;
  } finally {
    proxy.destroy();
  }
}
