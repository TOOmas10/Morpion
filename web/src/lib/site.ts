// Informations du site, au même endroit pour les pages légales et le référencement.

export const NOM_DU_SITE = "Morpion 7×6";

export const EDITEUR = {
  nom: "Thomas Berthaud",
  // Adresse de contact affichée sur les pages légales (demandes RGPD, signalements).
  email: "thomas.berthaud2a@gmail.com",
};

export const HEBERGEUR = {
  nom: "Vercel Inc.",
  adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  site: "https://vercel.com",
};

export const BASE_DE_DONNEES = {
  nom: "Neon (groupe Databricks)",
  lieu: "serveurs Amazon Web Services en Virginie (États-Unis)",
  site: "https://neon.com",
};

export const DERNIERE_MISE_A_JOUR = "14 octobre 2026";

// Adresse publique du site : NEXT_PUBLIC_SITE_URL si tu prends un nom de domaine,
// sinon l'adresse de production donnée par Vercel.
export function urlDuSite(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL)
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
