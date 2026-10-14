import {
  BADGES,
  COULEURS,
  FORMES,
  TRACES,
  valeurValide,
  type Badge,
  type Couleur,
  type Forme,
  type Trace,
} from "@/lib/boutique";

export type Apparence = {
  forme: Forme;
  couleur: Couleur;
  trace: Trace;
};

export type Equipement = {
  forme?: string | null;
  couleur?: string | null;
  trace?: string | null;
  badge?: string | null;
};

export type Camp = "X" | "O";

const DEFAUTS: Record<Camp, Apparence> = {
  X: { forme: "croix", couleur: "rose", trace: "surligneur" },
  O: { forme: "rond", couleur: "bleu", trace: "surligneur" },
};

export function apparenceDe(equipement: Equipement | null, camp: Camp): Apparence {
  const defaut = DEFAUTS[camp];
  return {
    forme: valeurValide(FORMES, equipement?.forme) ?? defaut.forme,
    couleur: valeurValide(COULEURS, equipement?.couleur) ?? defaut.couleur,
    trace: valeurValide(TRACES, equipement?.trace) ?? defaut.trace,
  };
}

export function badgeDe(equipement: Equipement | null): Badge | null {
  return valeurValide(BADGES, equipement?.badge);
}

function memeAllure(a: Apparence, b: Apparence): boolean {
  return a.forme === b.forme && a.couleur === b.couleur;
}

export function apparencesPartie(
  equipementX: Equipement | null,
  equipementO: Equipement | null,
): Record<Camp, Apparence> {
  const X = apparenceDe(equipementX, "X");
  let O = apparenceDe(equipementO, "O");
  if (memeAllure(X, O)) {
    O = memeAllure(X, DEFAUTS.O) ? DEFAUTS.X : DEFAUTS.O;
  }
  return { X, O };
}
