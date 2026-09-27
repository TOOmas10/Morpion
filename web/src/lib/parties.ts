import "server-only";
import { randomInt } from "node:crypto";
import type { Partie, Prisma } from "@/generated/prisma/client";
import { arbitrer } from "@/lib/arbitre";
import { prisma } from "@/lib/prisma";
import { pseudoDe } from "@/lib/session";
import type { EtatPartie, Symbole } from "@/lib/types-partie";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const LONGUEUR_CODE = 6;
const DUREE_ATTENTE_MS = 10 * 60 * 1000;
const POINTS_VICTOIRE = 3;
const POINTS_NUL = 1;

export function genererCode(): string {
  let code = "";
  for (let i = 0; i < LONGUEUR_CODE; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

export function normaliserCode(saisie: string): string {
  return saisie.slice(0, 32).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function codeValide(code: string): boolean {
  return new RegExp(`^[${ALPHABET}]{${LONGUEUR_CODE}}$`).test(code);
}

export function limiteAttente(): Date {
  return new Date(Date.now() - DUREE_ATTENTE_MS);
}

export function symboleDe(partie: Partie, idUtilisateur: string): Symbole | null {
  if (partie.joueurXId === idUtilisateur) return "X";
  if (partie.joueurOId === idUtilisateur) return "O";
  return null;
}

export function adversaire(symbole: Symbole): Symbole {
  return symbole === "X" ? "O" : "X";
}

export async function expirerSiBesoin(partie: Partie): Promise<Partie> {
  if (partie.statut !== "ATTENTE" || partie.creeLe > limiteAttente()) {
    return partie;
  }
  await prisma.partie.updateMany({
    where: { id: partie.id, statut: "ATTENTE" },
    data: { statut: "EXPIREE" },
  });
  return (await prisma.partie.findUnique({ where: { id: partie.id } })) ?? partie;
}

export async function verserPoints(
  tx: Prisma.TransactionClient,
  partie: Partie,
  gagnant: Symbole | "nul",
): Promise<void> {
  if (gagnant === "nul") {
    await tx.user.updateMany({
      where: { id: { in: [partie.joueurXId, partie.joueurOId ?? ""] } },
      data: { points: { increment: POINTS_NUL } },
    });
    return;
  }
  const idGagnant = gagnant === "X" ? partie.joueurXId : partie.joueurOId;
  if (!idGagnant) return;
  await tx.user.update({
    where: { id: idGagnant },
    data: { points: { increment: POINTS_VICTOIRE } },
  });
}

const JOUEURS = {
  joueurX: { select: { name: true, username: true, displayUsername: true } },
  joueurO: { select: { name: true, username: true, displayUsername: true } },
} as const;

export async function chargerPartie(code: string) {
  const partie = await prisma.partie.findUnique({ where: { code } });
  if (!partie) return null;
  await expirerSiBesoin(partie);
  return prisma.partie.findUnique({ where: { code }, include: JOUEURS });
}

export type PartieAvecJoueurs = NonNullable<
  Awaited<ReturnType<typeof chargerPartie>>
>;

export async function etatPour(
  partie: PartieAvecJoueurs,
  monSymbole: Symbole,
): Promise<EtatPartie> {
  const gagnant = partie.gagnant as EtatPartie["gagnant"];
  const finPar = partie.finPar as EtatPartie["finPar"];
  const ligne =
    partie.statut === "TERMINEE" && finPar === "ligne"
      ? (await arbitrer(partie.plateau)).ligne
      : null;
  let pointsGagnes = 0;
  if (partie.statut === "TERMINEE") {
    if (gagnant === monSymbole) pointsGagnes = POINTS_VICTOIRE;
    else if (gagnant === "nul") pointsGagnes = POINTS_NUL;
  }
  return {
    code: partie.code,
    statut: partie.statut,
    plateau: partie.plateau,
    tour: partie.tour as Symbole,
    gagnant,
    finPar,
    ligne,
    monSymbole,
    joueurX: pseudoDe(partie.joueurX),
    joueurO: partie.joueurO ? pseudoDe(partie.joueurO) : null,
    pointsGagnes,
  };
}

export async function etatPourUtilisateur(
  code: string,
  idUtilisateur: string,
): Promise<EtatPartie | null> {
  const partie = await chargerPartie(code);
  if (!partie) return null;
  const symbole = symboleDe(partie, idUtilisateur);
  if (!symbole) return null;
  return etatPour(partie, symbole);
}
