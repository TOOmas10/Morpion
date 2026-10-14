import "server-only";
import type { Equipement } from "@/lib/apparence";
import { prisma } from "@/lib/prisma";
import { lireSession } from "@/lib/session";

export type DonneesVitrine = {
  connecte: boolean;
  pieces: number;
  possessions: string[];
  equipement: Equipement;
};

export async function lireVitrine(): Promise<DonneesVitrine> {
  const session = await lireSession();
  if (!session) {
    return { connecte: false, pieces: 0, possessions: [], equipement: {} };
  }
  const possessions = await prisma.possession.findMany({
    where: { userId: session.user.id },
    select: { article: true },
  });
  const { pieces, forme, couleur, trace, badge } = session.user;
  return {
    connecte: true,
    pieces,
    possessions: possessions.map((p) => p.article),
    equipement: { forme, couleur, trace, badge },
  };
}
