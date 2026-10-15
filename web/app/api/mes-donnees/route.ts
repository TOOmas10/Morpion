import { prisma } from "@/lib/prisma";
import { lireSession } from "@/lib/session";

// Droit d'accès et de portabilité (RGPD) : toutes les données du joueur connecté, en JSON.
// Le mot de passe (chiffré) et les jetons de session ne sont jamais renvoyés.
export async function GET() {
  const session = await lireSession();
  if (!session) return Response.json({ erreur: "Connecte-toi" }, { status: 401 });
  const moi = session.user.id;

  const [utilisateur, possessions, parties, partiesSolo, sessions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: moi },
      select: {
        username: true,
        displayUsername: true,
        createdAt: true,
        points: true,
        pieces: true,
        forme: true,
        couleur: true,
        trace: true,
        badge: true,
      },
    }),
    prisma.possession.findMany({
      where: { userId: moi },
      select: { article: true, acheteLe: true },
      orderBy: { acheteLe: "asc" },
    }),
    prisma.partie.findMany({
      where: { OR: [{ joueurXId: moi }, { joueurOId: moi }] },
      select: {
        code: true,
        statut: true,
        plateau: true,
        gagnant: true,
        finPar: true,
        joueurXId: true,
        creeLe: true,
        majLe: true,
      },
      orderBy: { creeLe: "asc" },
    }),
    prisma.partieLocale.findMany({
      where: { userId: moi },
      select: { mode: true, niveau: true, terminee: true, pieces: true, creeLe: true },
      orderBy: { creeLe: "asc" },
    }),
    prisma.session.findMany({
      where: { userId: moi },
      select: { createdAt: true, expiresAt: true, ipAddress: true, userAgent: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const donnees = {
    exporteLe: new Date().toISOString(),
    compte: utilisateur,
    achats: possessions,
    partiesEnLigne: parties.map(({ joueurXId, ...partie }) => ({
      ...partie,
      monSymbole: joueurXId === moi ? "X" : "O",
    })),
    partiesSolo,
    sessions,
  };
  return new Response(JSON.stringify(donnees, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mes-donnees-morpion.json"',
      "Cache-Control": "no-store",
    },
  });
}
