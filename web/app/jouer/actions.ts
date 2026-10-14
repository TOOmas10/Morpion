"use server";

import { arbitrer } from "@/lib/arbitre";
import { PIECES_LOCALES, PLAFOND_LOCAL_24H } from "@/lib/boutique";
import { CASES } from "@/lib/grille";
import { NIVEAUX, type Niveau } from "@/lib/moteur";
import { prisma } from "@/lib/prisma";
import { lireSession } from "@/lib/session";

export type ModeLocal = "ia" | "duo";
export type GainLocal = { gain: number; plafond: boolean };

const DUREE_MINIMALE_MS = 3000;
const UNE_JOURNEE_MS = 24 * 60 * 60 * 1000;
const MAX_PARTIES_PAR_10_MIN = 40;

export async function commencerPartieLocale(
  mode: ModeLocal,
  niveau?: Niveau,
): Promise<string | null> {
  const session = await lireSession();
  if (!session) return null;
  if (mode !== "ia" && mode !== "duo") return null;
  if (mode === "ia" && !NIVEAUX.includes(niveau as Niveau)) return null;

  const recentes = await prisma.partieLocale.count({
    where: { userId: session.user.id, creeLe: { gt: new Date(Date.now() - 10 * 60 * 1000) } },
  });
  if (recentes >= MAX_PARTIES_PAR_10_MIN) return null;

  const partie = await prisma.partieLocale.create({
    data: { userId: session.user.id, mode, niveau: mode === "ia" ? niveau : null },
    select: { id: true },
  });
  return partie.id;
}

function plateauValide(plateau: unknown): plateau is string {
  return typeof plateau === "string" && plateau.length === CASES && /^[XO ]+$/.test(plateau);
}

export async function terminerPartieLocale(
  id: string,
  plateau: string,
): Promise<GainLocal | null> {
  const session = await lireSession();
  if (!session || typeof id !== "string" || !plateauValide(plateau)) return null;
  const moi = session.user.id;

  const partie = await prisma.partieLocale.findFirst({
    where: { id, userId: moi, terminee: false },
  });
  if (!partie) return null;
  if (Date.now() - partie.creeLe.getTime() < DUREE_MINIMALE_MS) return null;

  const x = plateau.split("X").length - 1;
  const o = plateau.split("O").length - 1;
  if (x !== o && x !== o + 1) return null;
  const verdict = await arbitrer(plateau);
  if (!verdict.gagnant && !verdict.plein) return null;
  if (verdict.gagnant === "X" && x !== o + 1) return null;
  if (verdict.gagnant === "O" && x !== o) return null;

  const base =
    partie.mode === "duo"
      ? PIECES_LOCALES.duo
      : PIECES_LOCALES[partie.niveau as Niveau] ?? 0;
  const dejaGagne = await prisma.partieLocale.aggregate({
    where: { userId: moi, terminee: true, creeLe: { gt: new Date(Date.now() - UNE_JOURNEE_MS) } },
    _sum: { pieces: true },
  });
  const restant = Math.max(0, PLAFOND_LOCAL_24H - (dejaGagne._sum.pieces ?? 0));
  const gain = Math.min(base, restant);

  const applique = await prisma.$transaction(async (tx) => {
    const { count } = await tx.partieLocale.updateMany({
      where: { id: partie.id, terminee: false },
      data: { terminee: true, pieces: gain },
    });
    if (count === 0) return false;
    if (gain > 0) {
      await tx.user.update({ where: { id: moi }, data: { pieces: { increment: gain } } });
    }
    return true;
  });
  if (!applique) return null;
  return { gain, plafond: gain < base };
}
