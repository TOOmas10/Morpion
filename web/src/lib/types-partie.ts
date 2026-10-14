import type { Apparence } from "@/lib/apparence";
import type { Badge } from "@/lib/boutique";

export type Symbole = "X" | "O";

type StatutEnLigne = "ATTENTE" | "EN_COURS" | "TERMINEE" | "EXPIREE";

export type EtatPartie = {
  code: string;
  statut: StatutEnLigne;
  plateau: string;
  tour: Symbole;
  gagnant: Symbole | "nul" | null;
  finPar: "ligne" | "plein" | "abandon" | null;
  ligne: number[] | null;
  monSymbole: Symbole;
  joueurX: string;
  joueurO: string | null;
  pointsGagnes: number;
  piecesGagnees: number;
  apparences: Record<Symbole, Apparence>;
  badges: Record<Symbole, Badge | null>;
  revanche: "aucune" | "moi" | "adversaire";
  codeRevanche: string | null;
};

export type ResultatCoup =
  | { ok: true; etat: EtatPartie }
  | { ok: false; erreur: string; etat: EtatPartie | null };

export type ResultatRejoindre = { erreur: string | null };

export type ResultatRevanche =
  | { ok: true; code: string | null; etat: EtatPartie | null }
  | { ok: false; erreur: string };
