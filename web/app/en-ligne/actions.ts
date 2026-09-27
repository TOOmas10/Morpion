"use server";

import { randomInt } from "node:crypto";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { arbitrer } from "@/lib/arbitre";
import { CASES } from "@/lib/grille";
import {
  adversaire,
  codeValide,
  etatPourUtilisateur,
  expirerSiBesoin,
  genererCode,
  limiteAttente,
  normaliserCode,
  symboleDe,
  verserPoints,
} from "@/lib/parties";
import { prisma } from "@/lib/prisma";
import { lireSession } from "@/lib/session";
import type { ResultatCoup, ResultatRejoindre } from "@/lib/types-partie";

async function idConnecte(retour: string): Promise<string> {
  const session = await lireSession();
  if (!session) redirect(`/connexion?retour=${encodeURIComponent(retour)}`);
  return session.user.id;
}

export async function creerPartie(): Promise<void> {
  const moi = await idConnecte("/en-ligne");
  const enAttente = await prisma.partie.findFirst({
    where: { joueurXId: moi, statut: "ATTENTE", creeLe: { gt: limiteAttente() } },
    select: { code: true },
  });
  if (enAttente) redirect(`/en-ligne/${enAttente.code}`);

  let code: string | null = null;
  for (let essai = 0; essai < 3 && !code; essai++) {
    const candidat = genererCode();
    try {
      await prisma.partie.create({ data: { code: candidat, joueurXId: moi } });
      code = candidat;
    } catch (erreur) {
      const doublon =
        erreur instanceof Prisma.PrismaClientKnownRequestError &&
        erreur.code === "P2002";
      if (!doublon) throw erreur;
    }
  }
  if (!code) throw new Error("Impossible de créer la partie");
  redirect(`/en-ligne/${code}`);
}

export async function rejoindrePartie(
  _precedent: ResultatRejoindre,
  formulaire: FormData,
): Promise<ResultatRejoindre> {
  const code = normaliserCode(String(formulaire.get("code") ?? ""));
  const moi = await idConnecte(`/en-ligne/${code}`);
  if (!codeValide(code)) {
    return { erreur: "Le code fait 6 caractères" };
  }

  const trouvee = await prisma.partie.findUnique({ where: { code } });
  if (!trouvee) return { erreur: "Aucune partie avec ce code" };
  const partie = await expirerSiBesoin(trouvee);

  if (partie.joueurXId === moi) {
    return { erreur: "C'est ta partie : envoie le code à un ami !" };
  }
  if (partie.joueurOId === moi) redirect(`/en-ligne/${code}`);
  if (partie.statut === "EXPIREE") return { erreur: "Ce code a expiré" };
  if (partie.statut !== "ATTENTE") {
    return { erreur: "Cette partie est déjà complète" };
  }

  const createurCommence = randomInt(2) === 0;
  const { count } = await prisma.partie.updateMany({
    where: {
      id: partie.id,
      statut: "ATTENTE",
      joueurOId: null,
      creeLe: { gt: limiteAttente() },
    },
    data: createurCommence
      ? { joueurOId: moi, statut: "EN_COURS" }
      : { joueurXId: moi, joueurOId: partie.joueurXId, statut: "EN_COURS" },
  });
  if (count === 0) return { erreur: "Cette partie est déjà complète" };
  redirect(`/en-ligne/${code}`);
}

export async function jouerCoup(
  saisie: string,
  index: number,
): Promise<ResultatCoup> {
  const session = await lireSession();
  if (!session) return { ok: false, erreur: "Connecte-toi pour jouer", etat: null };
  const moi = session.user.id;
  const code = normaliserCode(String(saisie));

  const partie = await prisma.partie.findUnique({ where: { code } });
  const symbole = partie ? symboleDe(partie, moi) : null;
  if (!partie || !symbole) {
    return { ok: false, erreur: "Partie introuvable", etat: null };
  }

  const refus = (erreur: string) =>
    etatPourUtilisateur(code, moi).then(
      (etat): ResultatCoup => ({ ok: false, erreur, etat }),
    );

  if (partie.statut !== "EN_COURS") return refus("La partie n'est pas en cours");
  if (partie.tour !== symbole) return refus("Ce n'est pas ton tour");
  if (!Number.isInteger(index) || index < 0 || index >= CASES) {
    return refus("Case invalide");
  }
  if (partie.plateau[index] !== " ") return refus("Case déjà prise");

  const nouveau =
    partie.plateau.slice(0, index) + symbole + partie.plateau.slice(index + 1);
  const verdict = await arbitrer(nouveau);
  const gagnant = verdict.gagnant ?? (verdict.plein ? "nul" : null);

  const applique = await prisma.$transaction(async (tx) => {
    const { count } = await tx.partie.updateMany({
      where: {
        id: partie.id,
        statut: "EN_COURS",
        tour: symbole,
        plateau: partie.plateau,
      },
      data: {
        plateau: nouveau,
        tour: adversaire(symbole),
        ...(gagnant && {
          statut: "TERMINEE",
          gagnant,
          finPar: verdict.gagnant ? "ligne" : "plein",
        }),
      },
    });
    if (count === 0) return false;
    if (gagnant) await verserPoints(tx, partie, gagnant);
    return true;
  });

  if (!applique) return refus("La partie a changé");
  const etat = await etatPourUtilisateur(code, moi);
  if (!etat) return { ok: false, erreur: "Partie introuvable", etat: null };
  return { ok: true, etat };
}

export async function abandonner(saisie: string): Promise<ResultatCoup> {
  const session = await lireSession();
  if (!session) return { ok: false, erreur: "Connecte-toi", etat: null };
  const moi = session.user.id;
  const code = normaliserCode(String(saisie));

  const partie = await prisma.partie.findUnique({ where: { code } });
  const symbole = partie ? symboleDe(partie, moi) : null;
  if (!partie || !symbole) {
    return { ok: false, erreur: "Partie introuvable", etat: null };
  }

  if (partie.statut === "ATTENTE" && symbole === "X") {
    await prisma.partie.updateMany({
      where: { id: partie.id, statut: "ATTENTE" },
      data: { statut: "EXPIREE" },
    });
  } else if (partie.statut === "EN_COURS") {
    const vainqueur = adversaire(symbole);
    await prisma.$transaction(async (tx) => {
      const { count } = await tx.partie.updateMany({
        where: { id: partie.id, statut: "EN_COURS" },
        data: { statut: "TERMINEE", gagnant: vainqueur, finPar: "abandon" },
      });
      if (count > 0) await verserPoints(tx, partie, vainqueur);
    });
  }

  const etat = await etatPourUtilisateur(code, moi);
  if (!etat) return { ok: false, erreur: "Partie introuvable", etat: null };
  return { ok: true, etat };
}
