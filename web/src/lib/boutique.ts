export const FORMES = [
  "croix",
  "rond",
  "triangle",
  "carre",
  "losange",
  "hexagone",
  "coeur",
  "lune",
  "goutte",
  "etoile",
  "eclair",
  "nuage",
  "fleur",
  "spirale",
] as const;
export const COULEURS = [
  "rose",
  "bleu",
  "vert",
  "orange",
  "rouge",
  "turquoise",
  "violet",
  "graphite",
  "or",
  "marine",
  "chocolat",
  "arc-en-ciel",
] as const;
export const TRACES = [
  "surligneur",
  "stylo",
  "feutre",
  "crayon",
  "pointilles",
  "double",
  "craie",
  "contour",
  "pinceau",
  "neon",
  "paillettes",
] as const;
export const BADGES = [
  "etoile",
  "coeur",
  "eclair",
  "trombone",
  "trefle",
  "flamme",
  "fusee",
  "medaille",
  "diamant",
  "couronne",
] as const;

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
  article("forme", "losange", "Losange", 8),
  article("forme", "hexagone", "Hexagone", 10),
  article("forme", "coeur", "Cœur", 12),
  article("forme", "lune", "Lune", 12),
  article("forme", "goutte", "Goutte", 12),
  article("forme", "etoile", "Étoile", 15),
  article("forme", "eclair", "Éclair", 15),
  article("forme", "nuage", "Nuage", 15),
  article("forme", "fleur", "Fleur", 18),
  article("forme", "spirale", "Spirale", 20),
  article("couleur", "rose", "Rose fluo", 0),
  article("couleur", "bleu", "Bleu fluo", 0),
  article("couleur", "vert", "Vert fluo", 5),
  article("couleur", "orange", "Orange fluo", 5),
  article("couleur", "rouge", "Rouge cerise", 6),
  article("couleur", "turquoise", "Turquoise", 6),
  article("couleur", "violet", "Violet", 6),
  article("couleur", "graphite", "Graphite", 6),
  article("couleur", "or", "Or", 8),
  article("couleur", "marine", "Bleu marine", 8),
  article("couleur", "chocolat", "Chocolat", 8),
  article("couleur", "arc-en-ciel", "Arc-en-ciel", 30),
  article("trace", "surligneur", "Surligneur", 0),
  article("trace", "stylo", "Stylo bille", 8),
  article("trace", "feutre", "Feutre", 10),
  article("trace", "crayon", "Crayon à papier", 10),
  article("trace", "pointilles", "Pointillés", 10),
  article("trace", "double", "Double trait", 12),
  article("trace", "craie", "Craie", 14),
  article("trace", "contour", "Contour", 14),
  article("trace", "pinceau", "Pinceau", 16),
  article("trace", "neon", "Néon", 20),
  article("trace", "paillettes", "Paillettes", 25),
  article("badge", "etoile", "Étoile", 6),
  article("badge", "coeur", "Cœur", 8),
  article("badge", "eclair", "Éclair", 10),
  article("badge", "trombone", "Trombone doré", 10),
  article("badge", "trefle", "Trèfle", 12),
  article("badge", "flamme", "Flamme", 14),
  article("badge", "fusee", "Fusée", 15),
  article("badge", "medaille", "Médaille", 18),
  article("badge", "diamant", "Diamant", 20),
  article("badge", "couronne", "Couronne", 25),
];

export const CATEGORIES: { id: Categorie; titre: string }[] = [
  { id: "forme", titre: "Formes" },
  { id: "couleur", titre: "Couleurs" },
  { id: "trace", titre: "Tracés" },
  { id: "badge", titre: "Badges" },
];

export const COULEURS_CSS: Record<Couleur, { trait: string; fond: string; texte: string }> = {
  rose: { trait: "#ff4fa3", fond: "#ff4fa3", texte: "#d6246e" },
  bleu: { trait: "#22b8f0", fond: "#22b8f0", texte: "#0b7bbf" },
  vert: { trait: "#3ccf6a", fond: "#3ccf6a", texte: "#2b8a3e" },
  orange: { trait: "#ff9a1f", fond: "#ff9a1f", texte: "#c25e00" },
  rouge: { trait: "#f03e3e", fond: "#f03e3e", texte: "#c92a2a" },
  turquoise: { trait: "#12b8a6", fond: "#12b8a6", texte: "#0b7a70" },
  violet: { trait: "#a36bff", fond: "#a36bff", texte: "#6f2fd0" },
  graphite: { trait: "#4a4e55", fond: "#4a4e55", texte: "#343a40" },
  or: { trait: "#e0a800", fond: "#e0a800", texte: "#9c6f00" },
  marine: { trait: "#3b5bdb", fond: "#3b5bdb", texte: "#2541b2" },
  chocolat: { trait: "#a0522d", fond: "#a0522d", texte: "#7a3b1a" },
  "arc-en-ciel": { trait: "url(#degrade-arc-en-ciel)", fond: "#ff9a1f", texte: "#c2410c" },
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
