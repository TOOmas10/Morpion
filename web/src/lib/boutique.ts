export const FORMES = ["croix", "rond", "triangle", "carre", "coeur", "etoile", "eclair"] as const;
export const COULEURS = ["rose", "bleu", "vert", "orange", "violet", "graphite"] as const;
export const TRACES = ["surligneur", "feutre", "crayon", "craie", "neon"] as const;
export const BADGES = ["etoile", "trombone", "fusee", "couronne"] as const;

export type Forme = (typeof FORMES)[number];
export type Couleur = (typeof COULEURS)[number];
export type Trace = (typeof TRACES)[number];
export type Badge = (typeof BADGES)[number];
export type Categorie = "forme" | "couleur" | "trace" | "badge";

export type Article = {
  id: string;
  categorie: Categorie;
  valeur: string;
  nom: string;
  prix: number;
};

function article(categorie: Categorie, valeur: string, nom: string, prix: number): Article {
  return { id: `${categorie}:${valeur}`, categorie, valeur, nom, prix };
}

export const ARTICLES: Article[] = [
  article("forme", "croix", "Croix", 0),
  article("forme", "rond", "Rond", 0),
  article("forme", "triangle", "Triangle", 8),
  article("forme", "carre", "Carré", 8),
  article("forme", "coeur", "Cœur", 12),
  article("forme", "etoile", "Étoile", 15),
  article("forme", "eclair", "Éclair", 15),
  article("couleur", "rose", "Rose fluo", 0),
  article("couleur", "bleu", "Bleu fluo", 0),
  article("couleur", "vert", "Vert fluo", 5),
  article("couleur", "orange", "Orange fluo", 5),
  article("couleur", "violet", "Violet", 6),
  article("couleur", "graphite", "Graphite", 6),
  article("trace", "surligneur", "Surligneur", 0),
  article("trace", "feutre", "Feutre", 10),
  article("trace", "crayon", "Crayon à papier", 10),
  article("trace", "craie", "Craie", 14),
  article("trace", "neon", "Néon", 20),
  article("badge", "etoile", "Étoile", 6),
  article("badge", "trombone", "Trombone doré", 10),
  article("badge", "fusee", "Fusée", 15),
  article("badge", "couronne", "Couronne", 25),
];

export const CATEGORIES: { id: Categorie; titre: string }[] = [
  { id: "forme", titre: "Formes" },
  { id: "couleur", titre: "Couleurs" },
  { id: "trace", titre: "Tracés" },
  { id: "badge", titre: "Badges" },
];

export const COULEURS_CSS: Record<Couleur, { trait: string; texte: string }> = {
  rose: { trait: "#ff4fa3", texte: "#d6246e" },
  bleu: { trait: "#22b8f0", texte: "#0b7bbf" },
  vert: { trait: "#3ccf6a", texte: "#2b8a3e" },
  orange: { trait: "#ff9a1f", texte: "#c25e00" },
  violet: { trait: "#a36bff", texte: "#6f2fd0" },
  graphite: { trait: "#4a4e55", texte: "#343a40" },
};

export function trouverArticle(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}

export function estGratuit(id: string): boolean {
  return trouverArticle(id)?.prix === 0;
}

export function valeurValide<T extends string>(liste: readonly T[], valeur: unknown): T | null {
  return typeof valeur === "string" && (liste as readonly string[]).includes(valeur)
    ? (valeur as T)
    : null;
}

export const PIECES_EN_LIGNE = { victoire: 3, nul: 1, defaite: 1 } as const;
export const PIECES_LOCALES = { facile: 1, moyen: 2, difficile: 3, duo: 1 } as const;
export const PLAFOND_LOCAL_24H = 30;
