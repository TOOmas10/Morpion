import "server-only";
import { headers } from "next/headers";
import type { Equipement } from "@/lib/apparence";
import { auth } from "@/lib/auth";

export async function lireSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function equipementConnecte(): Promise<Equipement | null> {
  const session = await lireSession();
  if (!session) return null;
  const { forme, couleur, trace, badge } = session.user;
  return { forme, couleur, trace, badge };
}

export function pseudoDe(utilisateur: {
  displayUsername?: string | null;
  username?: string | null;
  name: string;
}): string {
  return utilisateur.displayUsername ?? utilisateur.username ?? utilisateur.name;
}
