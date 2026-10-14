// Le moteur Python (Pyodide + morpion.py) vit dans un Web Worker (public/moteur-worker.js) :
// le fil principal reste libre pour l'interface pendant le chargement et la réflexion de l'IA.
const URL_WORKER = "/moteur-worker.js?v=1";

export type Analyse = {
  gagnant: Case | null;
  plein: boolean;
  ligne: number[] | null;
};

export type Moteur = {
  analyser: (plateau: Plateau) => Promise<Analyse>;
  coupIA: (plateau: Plateau, niveau: Niveau) => Promise<number>;
};

type Reponse = { id: number; ok: true; resultat: unknown } | { id: number; ok: false; erreur: string };

type Attente = { resoudre: (valeur: unknown) => void; rejeter: (erreur: Error) => void };

let worker: Worker | null = null;
let chargement: Promise<Moteur> | null = null;
let numero = 0;
const attentes = new Map<number, Attente>();

function abandonner(erreur: Error) {
  worker?.terminate();
  worker = null;
  chargement = null;
  for (const attente of attentes.values()) attente.rejeter(erreur);
  attentes.clear();
}

function lancerWorker(): Worker {
  if (worker) return worker;
  const nouveau = new Worker(URL_WORKER);
  nouveau.onmessage = (evenement: MessageEvent<Reponse>) => {
    const reponse = evenement.data;
    const attente = attentes.get(reponse.id);
    if (!attente) return;
    attentes.delete(reponse.id);
    if (reponse.ok) attente.resoudre(reponse.resultat);
    else attente.rejeter(new Error(reponse.erreur));
  };
  nouveau.onerror = () => abandonner(new Error("Le moteur Python s'est arrêté"));
  worker = nouveau;
  return nouveau;
}

function demander<T>(message: { type: string; plateau?: Plateau; niveau?: Niveau }): Promise<T> {
  const cible = lancerWorker();
  const id = ++numero;
  return new Promise<T>((resoudre, rejeter) => {
    attentes.set(id, { resoudre: resoudre as (valeur: unknown) => void, rejeter });
    cible.postMessage({ id, ...message });
  });
}

const MOTEUR: Moteur = {
  analyser: (plateau) => demander<Analyse>({ type: "analyser", plateau }),
  coupIA: (plateau, niveau) => demander<number>({ type: "jouer", plateau, niveau }),
};

export function chargerMoteur(): Promise<Moteur> {
  if (!chargement) {
    chargement = demander<null>({ type: "pret" }).then(
      () => MOTEUR,
      (erreur: Error) => {
        abandonner(erreur);
        throw erreur;
      },
    );
  }
  return chargement;
}

type Reseau = { saveData?: boolean; effectiveType?: string };

// Précharge le moteur quand le navigateur n'a rien d'autre à faire, sauf en mode économie de données.
export function prechargerMoteur(): () => void {
  const reseau = (navigator as Navigator & { connection?: Reseau }).connection;
  if (reseau?.saveData || reseau?.effectiveType?.includes("2g")) return () => {};
  const lancer = () => {
    chargerMoteur().catch(() => {});
  };
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(lancer, { timeout: 3000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(lancer, 1000);
  return () => clearTimeout(id);
}

export type Case = "X" | "O" | " ";

export type Plateau = Case[];

export const VIDE: Case = " ";
export const HUMAIN: Case = "X";
export const IA: Case = "O";

export type Niveau = "facile" | "moyen" | "difficile";

export const NIVEAUX: Niveau[] = ["facile", "moyen", "difficile"];
