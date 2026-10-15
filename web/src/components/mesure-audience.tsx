"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { statistiquesRefusees } from "@/lib/statistiques";

// Statistiques de visite sans cookie (Vercel Analytics). Avant chaque envoi :
// - rien n'est envoyé si le visiteur a refusé (ou si son navigateur le demande via Global Privacy Control) ;
// - les codes de partie et les paramètres d'adresse sont retirés (« /en-ligne/[code] »).
export function nettoyer(evenement: BeforeSendEvent): BeforeSendEvent | null {
  if (statistiquesRefusees()) return null;
  const adresse = new URL(evenement.url);
  adresse.search = "";
  adresse.hash = "";
  adresse.pathname = adresse.pathname.replace(/^\/en-ligne\/[^/]+$/, "/en-ligne/[code]");
  return { ...evenement, url: adresse.toString() };
}

export default function MesureAudience() {
  return <Analytics beforeSend={nettoyer} />;
}
