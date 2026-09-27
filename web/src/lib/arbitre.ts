import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadPyodide, type PyodideAPI } from "pyodide";

type ModuleArbitre = {
  gagnant: (plateau: unknown) => string | undefined;
  plein: (plateau: unknown) => boolean;
  LIGNES_GAGNANTES: { toJs: () => unknown; destroy: () => void };
};

type Arbitre = {
  pyodide: PyodideAPI;
  morpion: ModuleArbitre;
  lignes: number[][];
};

export type Verdict = {
  gagnant: "X" | "O" | null;
  plein: boolean;
  ligne: number[] | null;
};

const memoire = globalThis as unknown as {
  chargementArbitre?: Promise<Arbitre>;
};

async function charger(): Promise<Arbitre> {
  const pyodide = await loadPyodide();
  const code = await readFile(
    path.join(process.cwd(), "public", "morpion.py"),
    "utf8",
  );
  pyodide.FS.writeFile("/home/pyodide/morpion.py", code);
  const morpion = pyodide.pyimport("morpion") as ModuleArbitre;
  const proxy = morpion.LIGNES_GAGNANTES;
  try {
    const lignes = proxy.toJs() as number[][];
    return { pyodide, morpion, lignes };
  } finally {
    proxy.destroy();
  }
}

function chargerArbitre(): Promise<Arbitre> {
  if (!memoire.chargementArbitre) {
    memoire.chargementArbitre = charger().catch((erreur) => {
      memoire.chargementArbitre = undefined;
      throw erreur;
    });
  }
  return memoire.chargementArbitre;
}

export async function arbitrer(plateau: string): Promise<Verdict> {
  const { pyodide, morpion, lignes } = await chargerArbitre();
  const cases = plateau.split("");
  const liste = pyodide.toPy(cases);
  try {
    const resultat = morpion.gagnant(liste);
    const gagnant = resultat === "X" || resultat === "O" ? resultat : null;
    const ligne = gagnant
      ? (lignes.find((l) => l.every((i) => cases[i] === gagnant)) ?? null)
      : null;
    return { gagnant, plein: morpion.plein(liste), ligne };
  } finally {
    liste.destroy();
  }
}
