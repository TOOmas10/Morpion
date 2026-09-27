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
};

export type ResultatCoup =
  | { ok: true; etat: EtatPartie }
  | { ok: false; erreur: string; etat: EtatPartie | null };

export type ResultatRejoindre = { erreur: string | null };
