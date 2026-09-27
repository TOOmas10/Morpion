const ORIGINE_FICTIVE = "http://morpion.invalid";

export function retourSur(valeur: string | string[] | undefined): string {
  const chemin = Array.isArray(valeur) ? valeur[0] : valeur;
  if (!chemin || !chemin.startsWith("/")) return "/";
  try {
    const url = new URL(chemin, ORIGINE_FICTIVE);
    if (url.origin !== ORIGINE_FICTIVE) return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}
