import "server-only";
import { randomInt } from "node:crypto";
import type { Partie, Prisma } from "@/generated/prisma/client";
import { apparencesPartie, badgeDe } from "@/lib/apparence";
import { arbitrer } from "@/lib/arbitre";
import { PIECES_EN_LIGNE } from "@/lib/boutique";
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

function idDe(partie: Partie, symbole: Symbole): string | null {
  return symbole === "X" ? partie.joueurXId : partie.joueurOId;
}

export async function verserRecompenses(
  tx: Prisma.TransactionClient,
  partie: Partie,
  gagnant: Symbole | "nul",
  abandon = false,
): Promise<void> {
  if (gagnant === "nul") {
    await tx.user.updateMany({
      where: { id: { in: [partie.joueurXId, partie.joueurOId ?? ""] } },
      data: {
        points: { increment: POINTS_NUL },
        pieces: { increment: PIECES_EN_LIGNE.nul },
      },
    });
    return;
  }
  const idGagnant = idDe(partie, gagnant);
  const idPerdant = idDe(partie, adversaire(gagnant));
  if (idGagnant) {
    await tx.user.update({
      where: { id: idGagnant },
      data: {
        points: { increment: POINTS_VICTOIRE },
        pieces: { increment: PIECES_EN_LIGNE.victoire },
      },
    });
  }
  if (idPerdant && !abandon) {
    await tx.user.update({
      where: { id: idPerdant },
      data: { pieces: { increment: PIECES_EN_LIGNE.defaite } },
    });
  }
}

const PROFIL = {
  name: true,
  username: true,
  displayUsername: true,
  forme: true,
  couleur: true,
  trace: true,
  badge: true,
} as const;

const JOUEURS = {
  joueurX: { select: PROFIL },
  joueurO: { select: PROFIL },
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
  let piecesGagnees = 0;
  if (partie.statut === "TERMINEE") {
    if (gagnant === monSymbole) {
      pointsGagnes = POINTS_VICTOIRE;
      piecesGagnees = PIECES_EN_LIGNE.victoire;
    } else if (gagnant === "nul") {
      pointsGagnes = POINTS_NUL;
      piecesGagnees = PIECES_EN_LIGNE.nul;
    } else if (finPar !== "abandon") {
      piecesGagnees = PIECES_EN_LIGNE.defaite;
    }
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
    piecesGagnees,
    apparences: apparencesPartie(partie.joueurX, partie.joueurO),
    badges: { X: badgeDe(partie.joueurX), O: badgeDe(partie.joueurO) },
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
