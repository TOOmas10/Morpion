export const MOTIF_PSEUDO = /^[a-zA-Z0-9_]{3,20}$/;

export function pseudoValide(pseudo: string): boolean {
  return MOTIF_PSEUDO.test(pseudo);
}

export function emailTechnique(pseudo: string): string {
  return `${pseudo.toLowerCase()}@joueurs.morpion.invalid`;
}

// Les pseudos s'affichent au classement : on refuse les insultes, les propos haineux et
// l'usurpation (« admin »…). Les chiffres déguisés en lettres (« c0nn4rd ») et les lettres
// répétées (« puuute ») sont ramenés à leur forme simple avant la comparaison.
const CHIFFRES_EN_LETTRES: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b" };

function simplifier(texte: string): string {
  return texte
    .toLowerCase()
    .replace(/[0-9]/g, (chiffre) => CHIFFRES_EN_LETTRES[chiffre] ?? "")
    .replace(/(.)\1+/g, "$1");
}

// Mots refusés seulement quand ils forment un morceau entier du pseudo (séparé par « _ ») :
// « con » est refusé, « Conan » ou « faucon » non.
const MOTS_ENTIERS = [
  "con", "cons", "conne", "conard", "pute", "putes", "bite", "cul", "pd", "fdp", "ntm", "tg",
  "nique", "merde", "chier", "salope", "salaud", "pede", "gouine", "negre", "nazi", "nazis",
  "hitler", "kkk", "porn", "porno", "sexe", "sex", "fuck", "shit", "bitch", "dick", "cock",
  "cunt", "admin", "administrateur", "moderateur", "modo", "officiel", "support", "staff",
].map(simplifier);

// Mots refusés où qu'ils apparaissent, même collés à autre chose (assez longs pour ne pas
// tomber par hasard dans un mot innocent).
const MORCEAUX = [
  "connard", "connasse", "salope", "salopard", "encule", "putain", "filsdepute", "tamere",
  "batard", "couille", "pouffiasse", "niquetamere", "pedophile", "pedophil", "negro", "hitler",
  "fuck", "bitch", "asshole", "motherfucker", "pussy", "porno",
].map(simplifier);

export function pseudoAutorise(pseudo: string): boolean {
  const morceaux = pseudo.split("_").filter(Boolean).map(simplifier);
  if (morceaux.some((morceau) => MOTS_ENTIERS.includes(morceau))) return false;
  const colle = simplifier(pseudo.replace(/_/g, ""));
  return !MORCEAUX.some((mot) => colle.includes(mot));
}
