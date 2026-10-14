"use server";

import { Prisma } from "@/generated/prisma/client";
import { CATEGORIES, trouverArticle, type Categorie } from "@/lib/boutique";
import { prisma } from "@/lib/prisma";
import { lireSession } from "@/lib/session";

export type ResultatBoutique = { ok: true; message: string } | { ok: false; erreur: string };

function champEquipement(categorie: Categorie, valeur: string | null): Prisma.UserUpdateInput {
  switch (categorie) {
    case "forme":
      return { forme: valeur };
    case "couleur":
      return { couleur: valeur };
    case "trace":
      return { trace: valeur };
    case "badge":
      return { badge: valeur };
  }
}

export async function acheter(idArticle: string): Promise<ResultatBoutique> {
  const session = await lireSession();
  if (!session) return { ok: false, erreur: "Connecte-toi pour acheter" };
  const article = trouverArticle(String(idArticle));
  if (!article || article.prix === 0) return { ok: false, erreur: "Article introuvable" };
  const moi = session.user.id;

  try {
    const issue = await prisma.$transaction(async (tx) => {
      const deja = await tx.possession.findUnique({
        where: { userId_article: { userId: moi, article: article.id } },
      });
      if (deja) return "deja";
      const { count } = await tx.user.updateMany({
        where: { id: moi, pieces: { gte: article.prix } },
        data: { pieces: { decrement: article.prix } },
      });
      if (count === 0) return "pauvre";
      await tx.possession.create({ data: { userId: moi, article: article.id } });
      await tx.user.update({
        where: { id: moi },
        data: champEquipement(article.categorie, article.valeur),
      });
      return "achete";
    });
    if (issue === "deja") return { ok: false, erreur: "Tu l'as déjà" };
    if (issue === "pauvre") return { ok: false, erreur: "Pas assez de pièces" };
    return { ok: true, message: `${article.nom} acheté et équipé !` };
  } catch (erreur) {
    if (erreur instanceof Prisma.PrismaClientKnownRequestError && erreur.code === "P2002") {
      return { ok: false, erreur: "Tu l'as déjà" };
    }
    throw erreur;
  }
}

export async function equiper(
  categorie: Categorie,
  valeur: string | null,
): Promise<ResultatBoutique> {
  const session = await lireSession();
  if (!session) return { ok: false, erreur: "Connecte-toi" };
  if (!CATEGORIES.some((c) => c.id === categorie)) {
    return { ok: false, erreur: "Catégorie inconnue" };
  }
  const moi = session.user.id;

  if (valeur !== null) {
    const article = trouverArticle(`${categorie}:${String(valeur)}`);
    if (!article) return { ok: false, erreur: "Article introuvable" };
    if (article.prix > 0) {
      const possede = await prisma.possession.findUnique({
        where: { userId_article: { userId: moi, article: article.id } },
      });
      if (!possede) return { ok: false, erreur: "Achète-le d'abord" };
    }
  }

  await prisma.user.update({ where: { id: moi }, data: champEquipement(categorie, valeur) });
  return { ok: true, message: "Équipé !" };
}
