import { JOURS_CONSERVATION as DUREES } from "@/lib/conservation";
import { prisma } from "@/lib/prisma";

const JOUR = 24 * 60 * 60 * 1000;

// Lancé chaque nuit par Vercel (vercel.json → crons), qui envoie « Authorization: Bearer CRON_SECRET ».
export async function GET(requete: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || requete.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ erreur: "Non autorisé" }, { status: 401 });
  }
  const maintenant = Date.now();
  const avant = (jours: number) => new Date(maintenant - jours * JOUR);

  const [sessions, verifications, compteurs, partiesSolo, partiesNonTerminees, partiesTerminees, comptes] =
    await prisma.$transaction([
      prisma.session.deleteMany({ where: { expiresAt: { lt: new Date(maintenant) } } }),
      prisma.verification.deleteMany({ where: { expiresAt: { lt: new Date(maintenant) } } }),
      prisma.rateLimit.deleteMany({ where: { lastRequest: { lt: BigInt(maintenant - JOUR) } } }),
      prisma.partieLocale.deleteMany({ where: { creeLe: { lt: avant(DUREES.partiesSolo) } } }),
      prisma.partie.deleteMany({
        where: {
          statut: { in: ["ATTENTE", "EN_COURS", "EXPIREE"] },
          majLe: { lt: avant(DUREES.partiesNonTerminees) },
        },
      }),
      prisma.partie.deleteMany({
        where: { statut: "TERMINEE", majLe: { lt: avant(DUREES.partiesTerminees) } },
      }),
      // Supprimer le compte efface aussi ses sessions, achats et parties (cascade).
      prisma.user.deleteMany({ where: { vuLe: { lt: avant(DUREES.comptesInactifs) } } }),
    ]);

  const bilan = {
    sessionsExpirees: sessions.count,
    verifications: verifications.count,
    compteursAntiAbus: compteurs.count,
    partiesSolo: partiesSolo.count,
    partiesNonTerminees: partiesNonTerminees.count,
    partiesTerminees: partiesTerminees.count,
    comptesInactifs: comptes.count,
  };
  console.log("Nettoyage", bilan);
  return Response.json(bilan);
}
