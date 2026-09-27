import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function lireSession() {
  return auth.api.getSession({ headers: await headers() });
}

export function pseudoDe(utilisateur: {
  displayUsername?: string | null;
  username?: string | null;
  name: string;
}): string {
  return utilisateur.displayUsername ?? utilisateur.username ?? utilisateur.name;
}
