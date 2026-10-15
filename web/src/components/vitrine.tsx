"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { acheter, equiper, lirePossessions, type ResultatBoutique } from "@app/boutique/actions";
import { IconeBadge, IconePiece } from "@/components/icones-boutique";
import { Symbole } from "@/components/symbole";
import { apparenceDe, badgeDe, type Apparence, type Equipement } from "@/lib/apparence";
import { authClient } from "@/lib/auth-client";
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

const PAR_PAGE = 6;

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

type Possessions = { pour: string; liste: string[] };

// La page est statique : le catalogue s'affiche tout de suite, et ce qui dépend du joueur
// (solde, équipement, articles possédés) est lu dans le navigateur.
export default function Vitrine({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const moi = session?.user.id ?? null;
  const connecte = moi !== null;
  const pieces = session?.user.pieces ?? 0;
  const { forme, couleur, trace, badge: badgeEquipe } = session?.user ?? {};
  const equipement = useMemo<Equipement>(
    () => ({ forme, couleur, trace, badge: badgeEquipe }),
    [forme, couleur, trace, badgeEquipe],
  );
  const [possedes, setPossedes] = useState<Possessions | null>(null);
  const possessions = possedes && possedes.pour === moi ? possedes.liste : null;
  const pret = !isPending && (!connecte || possessions !== null);
  const [enCours, demarrer] = useTransition();
  const [cible, setCible] = useState<string | null>(null);
  const [aConfirmer, setAConfirmer] = useState<string | null>(null);
  const [categorie, setCategorie] = useState<Categorie>("forme");
  const [page, setPage] = useState(0);
  const actuelle = apparenceDe(equipement, "X");
  const badge = badgeDe(equipement);

  useEffect(() => {
    if (!moi) return;
    let annule = false;
    lirePossessions()
      .catch(() => [])
      .then((liste) => {
        if (!annule) setPossedes({ pour: moi, liste });
      });
    return () => {
      annule = true;
    };
  }, [moi]);

  useEffect(() => {
    if (mode === "collection" && !isPending && !connecte) {
      router.replace("/connexion?retour=/boutique/collection");
    }
  }, [mode, isPending, connecte, router]);

  function lancer(id: string, action: () => Promise<ResultatBoutique>) {
    setCible(id);
    demarrer(async () => {
      try {
        const resultat = await action();
        // Solde, équipement et possessions à jour avant de rendre la main (l'en-tête suit aussi).
        const [liste] = await Promise.all([lirePossessions(), refetch()]);
        if (moi) setPossedes({ pour: moi, liste });
        if (resultat.ok) toast.success(resultat.message);
        else toast.error(resultat.erreur);
      } catch {
        toast.error("Ça n'est pas passé, réessaie");
      }
      setCible(null);
      setAConfirmer(null);
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
    const classe = "min-h-6 w-full cursor-pointer rounded-sm px-2 py-1 text-xs font-semibold transition active:translate-y-px disabled:cursor-not-allowed";
    if (!pret) {
      return (
        <span className={cn(classe, "cursor-default bg-graphite/5 text-graphite/50")} aria-hidden data-attente>
          …
        </span>
      );
    }
    const possede = carte.prix === 0 || (possessions ?? []).includes(carte.id);
    const equipe =
      carte.valeur === null ? !equipement[carte.categorie] : equipement[carte.categorie] === carte.valeur;
    const occupe = enCours && cible === carte.id;

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
    const achetes = articles.filter((a) => a.prix === 0 || (possessions ?? []).includes(a.id));
    return [
      { id: `${categorie}:defaut`, categorie, valeur: null, nom: NOMS_PAR_DEFAUT[categorie], prix: 0 },
      ...achetes,
    ];
  };

  const cartes = cartesPar(categorie);
  const pages = Math.max(1, Math.ceil(cartes.length / PAR_PAGE));
  const pageSure = Math.min(page, pages - 1);
  const visibles = cartes.slice(pageSure * PAR_PAGE, (pageSure + 1) * PAR_PAGE);

  function choisirCategorie(nouvelle: Categorie) {
    setCategorie(nouvelle);
    setPage(0);
    setAConfirmer(null);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="post-it bg-postit-bleu flex -rotate-1 items-center gap-3 px-4 py-2">
        <Symbole apparence={actuelle} anime className="size-11" />
        <div className="flex flex-col gap-1">
          <span className="font-ecole text-base whitespace-nowrap text-encre sm:text-lg">Ton symbole</span>
          {!pret ? (
            <span className="text-sm text-graphite/50" aria-hidden>
              …
            </span>
          ) : connecte ? (
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

      <nav className="flex gap-1" aria-label="Boutique ou collection">
        {(["boutique", "collection"] as const).map((onglet) => (
          <Link
            key={onglet}
            href={
              onglet === "boutique"
                ? "/boutique"
                : connecte || !pret
                  ? "/boutique/collection"
                  : "/connexion?retour=/boutique/collection"
            }
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

      <div role="tablist" aria-label="Catégories" className="flex flex-wrap justify-center gap-1 min-[380px]:gap-1.5">
        {CATEGORIES.map(({ id, titre }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`onglet-${id}`}
            aria-selected={categorie === id}
            aria-controls="articles"
            onClick={() => choisirCategorie(id)}
            className={cn(
              "min-h-8 cursor-pointer rounded-full border px-2 text-xs font-semibold transition min-[380px]:px-2.5 min-[400px]:px-3 min-[400px]:text-sm",
              categorie === id
                ? "border-encre bg-encre text-white"
                : "border-graphite/30 bg-white/70 text-graphite hover:border-graphite/60",
            )}
          >
            {titre}
          </button>
        ))}
      </div>

      <section
        id="articles"
        role="tabpanel"
        aria-labelledby={`onglet-${categorie}`}
        className="flex w-full flex-col items-center gap-3"
      >
        <ul
          key={`${categorie}-${pageSure}`}
          className="grid w-full grid-cols-2 gap-3 min-[360px]:grid-cols-3"
        >
          {visibles.map((carte, index) => (
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
        {pages > 1 && (
          <nav className="flex items-center gap-3" aria-label="Pages d'articles">
            <button
              type="button"
              onClick={() => setPage(pageSure - 1)}
              disabled={pageSure === 0}
              aria-label="Articles précédents"
              className="size-9 cursor-pointer rounded-full border border-graphite/30 bg-white/70 text-lg text-encre transition hover:border-graphite/60 disabled:cursor-default disabled:opacity-30"
            >
              ‹
            </button>
            <span className="min-w-12 text-center text-sm text-graphite" data-page={pageSure + 1}>
              {pageSure + 1} / {pages}
            </span>
            <button
              type="button"
              onClick={() => setPage(pageSure + 1)}
              disabled={pageSure >= pages - 1}
              aria-label="Articles suivants"
              className="size-9 cursor-pointer rounded-full border border-graphite/30 bg-white/70 text-lg text-encre transition hover:border-graphite/60 disabled:cursor-default disabled:opacity-30"
            >
              ›
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
