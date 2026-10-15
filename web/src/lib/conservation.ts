// Durées de conservation des données (RGPD). Appliquées chaque nuit par app/api/nettoyage
// et annoncées telles quelles dans la politique de confidentialité.
export const JOURS_CONSERVATION = {
  partiesSolo: 30, // jetons anti-triche des parties contre l'IA ou à deux
  partiesNonTerminees: 30, // parties en ligne abandonnées en cours de route
  partiesTerminees: 365, // historique des parties en ligne
  comptesInactifs: 3 * 365, // comptes sans aucune visite
} as const;

export const JOURS_SESSION = 7; // durée d'une connexion sans visite (réglage par défaut de Better Auth)
