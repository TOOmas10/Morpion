"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { acheter, equiper, type ResultatBoutique } from "@app/boutique/actions";
import { IconeBadge, IconePiece } from "@/components/icones-boutique";
import { Symbole } from "@/components/symbole";
import { apparenceDe, badgeDe, type Apparence, type Equipement } from "@/lib/apparence";
import {
  ARTICLES,
  BADGES,
  CATEGORIES,
  COULEURS,
  FORMES,
  TRACES,
  valeurValide,
  type Categorie,
} from "@/lib/boutique";
import { cn } from "@/lib/utils";

type Mode = "boutique" | "collection";

type Carte = {
  id: string;
  categorie: Categorie;
  valeur: string | null;
  nom: string;
  prix: number;
};

const NOMS_PAR_DEFAUT: Record<Categorie, string> = {
  forme: "Par défaut",
  couleur: "Par défaut",
  trace: "Par défaut",
  badge: "Aucun",
};

function Apercu({ carte, actuelle }: { carte: Carte; actuelle: Apparence }) {
  if (carte.categorie === "badge") {
    const badge = valeurValide(BADGES, carte.valeur);
    return badge ? (
      <IconeBadge badge={badge} className="size-10" />
    ) : (
      <span className="text-2xl text-graphite/50" aria-hidden>
        —
      </span>
    );
  }
  const apparence: Apparence = {
    forme: carte.categorie === "forme" ? (valeurValide(FORMES, carte.valeur) ?? "croix") : actuelle.forme,
    couleur:
      carte.categorie === "couleur" ? (valeurValide(COULEURS, carte.valeur) ?? "rose") : actuelle.couleur,
    trace:
      carte.categorie === "trace" ? (valeurValide(TRACES, carte.valeur) ?? "surligneur") : actuelle.trace,
  };
  return <Symbole apparence={apparence} className="size-12" />;
}

type PropsVitrine = {
  mode: Mode;
  connecte: boolean;
  pieces: number;
  possessions: string[];
  equipement: Equipement;
};

export default function Vitrine({ mode, connecte, pieces, possessions, equipement }: PropsVitrine) {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const [cible, setCible] = useState<string | null>(null);
  const [aConfirmer, setAConfirmer] = useState<string | null>(null);
  const actuelle = apparenceDe(equipement, "X");
  const badge = badgeDe(equipement);

  function lancer(id: string, action: () => Promise<ResultatBoutique>) {
    setCible(id);
    demarrer(async () => {
      const resultat = await action();
      if (resultat.ok) toast.success(resultat.message);
      else toast.error(resultat.erreur);
      setCible(null);
      setAConfirmer(null);
      router.refresh();
    });
  }

  function cliquerAchat(carte: Carte) {
    if (aConfirmer !== carte.id) {
      setAConfirmer(carte.id);
      setTimeout(() => setAConfirmer((actuel) => (actuel === carte.id ? null : actuel)), 4000);
      return;
    }
    lancer(carte.id, () => acheter(carte.id));
  }

  function bouton(carte: Carte) {
    const possede = carte.prix === 0 || possessions.includes(carte.id);
    const equipe =
      carte.valeur === null ? !equipement[carte.categorie] : equipement[carte.categorie] === carte.valeur;
    const occupe = enCours && cible === carte.id;
    const classe = "min-h-6 w-full cursor-pointer rounded-sm px-2 py-1 text-xs font-semibold transition active:translate-y-px disabled:cursor-not-allowed";

    if (equipe) {
      return <span className="min-h-6 py-1 text-xs font-semibold text-vert-fonce">Équipé ✓</span>;
    }
    if (possede) {
      if (!connecte) return <span className="min-h-6 py-1 text-xs text-graphite">Gratuit</span>;
      return (
        <button
          type="button"
          disabled={occupe}
          onClick={() => lancer(carte.id, () => equiper(carte.categorie, carte.valeur))}
          className={cn(classe, "bg-encre text-white disabled:opacity-60")}
        >
          {occupe ? "…" : "Équiper"}
        </button>
      );
    }
    if (!connecte) {
      return (
        <Link
          href="/connexion?retour=/boutique"
          className={cn(classe, "inline-flex items-center justify-center gap-1 bg-postit-jaune text-encre")}
        >
          {carte.prix} <IconePiece />
        </Link>
      );
    }
    const manque = carte.prix - pieces;
    if (manque > 0) {
      return (
        <button
          type="button"
          disabled
          title={`Il te manque ${manque} ${manque > 1 ? "pièces" : "pièce"}`}
          aria-label={`${carte.prix} pièces, il te manque ${manque}`}
          className={cn(classe, "inline-flex items-center justify-center gap-1 bg-graphite/10 text-graphite")}
        >
          {carte.prix} <IconePiece className="opacity-60" />
        </button>
      );
    }
    const confirmer = aConfirmer === carte.id;
    return (
      <button
        type="button"
        disabled={occupe}
        onClick={() => cliquerAchat(carte)}
        aria-label={confirmer ? `Confirmer l'achat de ${carte.nom}` : `Acheter ${carte.nom} pour ${carte.prix} pièces`}
        className={cn(
          classe,
          "inline-flex items-center justify-center gap-1",
          confirmer ? "bg-rose-fonce text-white" : "bg-postit-jaune text-encre",
        )}
      >
        {occupe ? "…" : confirmer ? "Confirmer ?" : (
          <>
            {carte.prix} <IconePiece />
          </>
        )}
      </button>
    );
  }

  const cartesPar = (categorie: Categorie): Carte[] => {
    const articles: Carte[] = ARTICLES.filter((a) => a.categorie === categorie);
    if (mode === "boutique") return articles;
    const possedes = articles.filter((a) => a.prix === 0 || possessions.includes(a.id));
    return [
      { id: `${categorie}:defaut`, categorie, valeur: null, nom: NOMS_PAR_DEFAUT[categorie], prix: 0 },
      ...possedes,
    ];
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="post-it bg-postit-bleu flex -rotate-1 items-center gap-4 px-5 py-3">
        <Symbole apparence={actuelle} anime className="size-14" />
        <div className="flex flex-col gap-1">
          <span className="font-ecole text-base whitespace-nowrap text-encre sm:text-lg">Ton symbole</span>
          {connecte ? (
            <span className="flex items-center gap-1 text-sm font-semibold text-encre" data-solde={pieces}>
              <IconePiece /> {pieces} {pieces > 1 ? "pièces" : "pièce"}
              {badge && <IconeBadge badge={badge} className="ml-1" />}
            </span>
          ) : (
            <Link href="/connexion?retour=/boutique" className="text-sm text-graphite underline underline-offset-4">
              Connecte-toi pour acheter
            </Link>
          )}
        </div>
      </div>

      {connecte && (
        <nav className="flex gap-1" aria-label="Boutique ou collection">
          {(["boutique", "collection"] as const).map((onglet) => (
            <Link
              key={onglet}
              href={onglet === "boutique" ? "/boutique" : "/boutique/collection"}
              aria-current={mode === onglet ? "page" : undefined}
              className={cn(
                "rounded-t-md border border-b-0 px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition sm:px-4",
                mode === onglet
                  ? "border-graphite/30 bg-white text-encre"
                  : "border-transparent bg-graphite/10 text-graphite hover:bg-graphite/15",
              )}
            >
              {onglet === "boutique" ? "Boutique" : "Ma collection"}
            </Link>
          ))}
        </nav>
      )}

      {CATEGORIES.map(({ id, titre }) => (
        <section key={id} className="flex w-full flex-col gap-2" aria-labelledby={`titre-${id}`}>
          <h2 id={`titre-${id}`} className="font-ecole text-xl text-encre">
            {titre}
          </h2>
          <ul className="grid grid-cols-2 gap-3 min-[400px]:grid-cols-3 sm:grid-cols-4">
            {cartesPar(id).map((carte, index) => (
              <li
                key={carte.id}
                data-article={carte.id}
                className="entree-ligne flex flex-col items-center gap-1 rounded-md border border-graphite/15 bg-white/85 p-2 text-center shadow-sm"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                <div className="flex size-12 items-center justify-center">
                  <Apercu carte={carte} actuelle={actuelle} />
                </div>
                <span className="text-xs text-encre sm:text-sm">{carte.nom}</span>
                {bouton(carte)}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
