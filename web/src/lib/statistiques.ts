// Choix du visiteur de ne pas être compté dans les statistiques de visite (Vercel Analytics).
// Gardé dans son navigateur uniquement : rien n'est envoyé au serveur.
const CLE = "morpion-sans-statistiques";

export function statistiquesRefusees(): boolean {
  const signal = typeof navigator !== "undefined" && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
  if (signal) return true;
  try {
    return localStorage.getItem(CLE) === "1";
  } catch {
    return false;
  }
}

export function choisirStatistiques(accepte: boolean) {
  try {
    if (accepte) localStorage.removeItem(CLE);
    else localStorage.setItem(CLE, "1");
  } catch {
    // Stockage indisponible (navigation privée stricte…) : on ne peut pas retenir le choix.
  }
}
