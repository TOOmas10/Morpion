"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { abandonner, demanderRevanche, jouerCoup } from "@app/en-ligne/actions";
import BoutonGomme from "@/components/bouton-gomme";
import { IconeBadge, IconePiece } from "@/components/icones-boutique";
import { Symbole as DessinSymbole } from "@/components/symbole";
import { FormulaireNouvellePartie } from "@/components/formulaires-partie";
import PlateauJeu from "@/components/plateau";
import { rafraichirCompte } from "@/lib/auth-client";
import { COULEURS_CSS } from "@/lib/boutique";
import { ALIGNEMENT } from "@/lib/grille";
import type { EtatPartie, Symbole } from "@/lib/types-partie";

function Pseudo({
  etat,
  symbole,
  children,
}: {
  etat: EtatPartie;
  symbole: Symbole;
  children: ReactNode;
}) {
  const badge = etat.badges[symbole];
  return (
    <mark
      className="-rotate-1 rounded-sm px-1 text-encre box-decoration-clone"
      style={{
        backgroundColor: `color-mix(in srgb, ${COULEURS_CSS[etat.apparences[symbole].couleur].fond} 55%, transparent)`,
      }}
    >
      {children}
      {badge && <IconeBadge badge={badge} className="ml-1" />}
    </mark>
  );
}

function MiniSymbole({ etat, symbole }: { etat: EtatPartie; symbole: Symbole }) {
  return <DessinSymbole apparence={etat.apparences[symbole]} className="size-6 shrink-0" />;
}

function couleurTexte(etat: EtatPartie, symbole: Symbole): string {
  return COULEURS_CSS[etat.apparences[symbole].couleur].texte;
}

function autre(symbole: Symbole): Symbole {
  return symbole === "X" ? "O" : "X";
}

function nomDe(etat: EtatPartie, symbole: Symbole): string {
  return (symbole === "X" ? etat.joueurX : etat.joueurO) ?? "?";
}

function resultatDe(etat: EtatPartie): "gagne" | "perdu" | "nul" | undefined {
  if (etat.statut !== "TERMINEE") return undefined;
  if (etat.gagnant === "nul") return "nul";
  return etat.gagnant === etat.monSymbole ? "gagne" : "perdu";
}

function Statut({ etat, arbitreLent }: { etat: EtatPartie; arbitreLent: boolean }) {
  const moi = etat.monSymbole;
  const lui = autre(moi);
  const points = etat.pointsGagnes > 1 ? "pts" : "pt";

  if (etat.statut === "EN_COURS") {
    if (arbitreLent) return <>L&apos;arbitre se réveille…</>;
    return etat.tour === moi ? (
      <>
        <MiniSymbole etat={etat} symbole={moi} />
        <span>
          À toi, <Pseudo etat={etat} symbole={moi}>{nomDe(etat, moi)}</Pseudo> !
        </span>
      </>
    ) : (
      <>
        <MiniSymbole etat={etat} symbole={lui} />
        <span>
          Au tour de <Pseudo etat={etat} symbole={lui}>{nomDe(etat, lui)}</Pseudo>
        </span>
      </>
    );
  }

  const resultat = resultatDe(etat);
  if (resultat === "nul") return <>Égalité ! +{etat.pointsGagnes} {points}</>;
  if (resultat === "gagne") {
    return etat.finPar === "abandon" ? (
      <>
        <Pseudo etat={etat} symbole={lui}>{nomDe(etat, lui)}</Pseudo> abandonne : +{etat.pointsGagnes}{" "}
        {points}
      </>
    ) : (
      <>
        Gagné ! +{etat.pointsGagnes} {points}
      </>
    );
  }
  if (resultat === "perdu") {
    return etat.finPar === "abandon" ? (
      <>Tu as abandonné</>
    ) : (
      <>
        Perdu ! <Pseudo etat={etat} symbole={lui}>{nomDe(etat, lui)}</Pseudo> gagne
      </>
    );
  }
  return null;
}

const DUREE_ATTENTE_REVANCHE_MS = 3 * 60 * 1000;

function ZoneRevanche({
  etat,
  enCours,
  surClic,
}: {
  etat: EtatPartie;
  enCours: boolean;
  surClic: () => void;
}) {
  const lui = autre(etat.monSymbole);
  const nom = nomDe(etat, lui);
  if (etat.codeRevanche) {
    // On revient sur une partie dont la revanche est déjà lancée (bouton Retour, vieux lien…).
    return (
      <Link
        href={`/en-ligne/${etat.codeRevanche}`}
        data-revanche="lancee"
        className="py-1 text-sm font-semibold text-encre underline underline-offset-4"
      >
        Aller à la revanche →
      </Link>
    );
  }
  if (etat.revanche === "moi") {
    return (
      <p className="text-sm font-semibold text-graphite" data-revanche="moi">
        Revanche proposée, en attente de {nom}
        <span className="points-attente" aria-hidden>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    );
  }
  if (etat.revanche === "adversaire") {
    return (
      <div className="flex flex-col items-center gap-1" data-revanche="adversaire">
        <p className="pop text-sm font-semibold text-encre">
          <Pseudo etat={etat} symbole={lui}>
            {nom}
          </Pseudo>{" "}
          veut une revanche !
        </p>
        <BoutonGomme texte={enCours ? "Un instant…" : "Accepter"} onClick={surClic} disabled={enCours} autoFocus />
      </div>
    );
  }
  return (
    <BoutonGomme texte={enCours ? "Un instant…" : "Revanche"} onClick={surClic} disabled={enCours} autoFocus />
  );
}

export default function SalleEnLigne({ etatInitial }: { etatInitial: EtatPartie }) {
  const router = useRouter();
  const [etat, setEtat] = useState<EtatPartie>(etatInitial);
  const [horsLigne, setHorsLigne] = useState(false);
  const [enAttente, setEnAttente] = useState(false);
  const [arbitreLent, setArbitreLent] = useState(false);
  const actionEnCours = useRef(false);
  const statutPrecedent = useRef(etatInitial.statut);
  // On n'est emmené d'office dans la revanche que si on l'a demandée depuis cet écran :
  // revenir sur une vieille partie (bouton Retour, vieux lien) ne doit jamais renvoyer ailleurs.
  const jaiDemande = useRef(false);
  const parti = useRef(false);

  const [revancheEnCours, setRevancheEnCours] = useState(false);

  const actif = etat.statut === "ATTENTE" || etat.statut === "EN_COURS";
  const attenteRevanche = etat.statut === "TERMINEE" && !etat.codeRevanche;
  const sonder = actif || attenteRevanche;
  const intervalle = actif ? 1000 : 2000;

  useEffect(() => {
    if (!sonder) return;
    let annule = false;
    let echecs = 0;
    let minuteur: ReturnType<typeof setTimeout>;
    const debut = Date.now();

    async function interroger() {
      if (!actif && Date.now() - debut > DUREE_ATTENTE_REVANCHE_MS) return;
      if (!document.hidden && !actionEnCours.current) {
        try {
          const reponse = await fetch(`/api/parties/${etat.code}`, {
            cache: "no-store",
          });
          if (!reponse.ok) throw new Error(String(reponse.status));
          const nouvelEtat = (await reponse.json()) as EtatPartie;
          echecs = 0;
          if (!annule && !actionEnCours.current) {
            // Rien n'a bougé : on garde l'ancien objet, React ne redessine pas la grille.
            setEtat((precedent) =>
              JSON.stringify(precedent) === JSON.stringify(nouvelEtat) ? precedent : nouvelEtat,
            );
            setHorsLigne(false);
          }
        } catch {
          echecs += 1;
          if (!annule) setHorsLigne(true);
        }
      }
      if (!annule) {
        minuteur = setTimeout(interroger, Math.min(intervalle * 2 ** echecs, 8000));
      }
    }

    minuteur = setTimeout(interroger, intervalle);
    return () => {
      annule = true;
      clearTimeout(minuteur);
    };
  }, [sonder, actif, intervalle, etat.code]);

  const allerALaRevanche = useCallback(
    (code: string) => {
      if (parti.current) return;
      parti.current = true;
      router.push(`/en-ligne/${code}`);
    },
    [router],
  );

  useEffect(() => {
    if (!etat.codeRevanche) {
      if (etat.revanche === "moi") jaiDemande.current = true;
      return;
    }
    if (jaiDemande.current) allerALaRevanche(etat.codeRevanche);
  }, [etat.revanche, etat.codeRevanche, allerALaRevanche]);

  async function revanche() {
    if (actionEnCours.current) return;
    actionEnCours.current = true;
    jaiDemande.current = true;
    setRevancheEnCours(true);
    try {
      const resultat = await demanderRevanche(etat.code);
      if (!resultat.ok) toast.error(resultat.erreur);
      else if (resultat.code) allerALaRevanche(resultat.code);
      else if (resultat.etat) setEtat(resultat.etat);
    } catch {
      toast.error("La revanche n'est pas partie, réessaie");
    } finally {
      actionEnCours.current = false;
      setRevancheEnCours(false);
    }
  }

  useEffect(() => {
    const avant = statutPrecedent.current;
    statutPrecedent.current = etat.statut;
    if (avant === "ATTENTE" && etat.statut === "EN_COURS") {
      const adverse = etat.monSymbole === "X" ? etat.joueurO : etat.joueurX;
      toast.success(`${adverse} a rejoint la partie !`);
    }
    if (avant !== "TERMINEE" && etat.statut === "TERMINEE") rafraichirCompte();
  }, [etat.statut, etat.monSymbole, etat.joueurO, etat.joueurX]);

  async function cliquer(index: number) {
    if (
      etat.statut !== "EN_COURS" ||
      etat.tour !== etat.monSymbole ||
      etat.plateau[index] !== " " ||
      actionEnCours.current
    ) {
      return;
    }
    const avant = etat;
    actionEnCours.current = true;
    setEnAttente(true);
    setEtat({
      ...etat,
      plateau:
        etat.plateau.slice(0, index) + etat.monSymbole + etat.plateau.slice(index + 1),
      tour: autre(etat.monSymbole),
    });
    const lent = setTimeout(() => setArbitreLent(true), 400);
    try {
      const resultat = await jouerCoup(etat.code, index);
      setEtat(resultat.etat ?? avant);
      if (!resultat.ok && resultat.erreur !== "La partie a changé") {
        toast.error(resultat.erreur);
      }
    } catch {
      setEtat(avant);
      toast.error("Le coup n'est pas parti, réessaie");
    } finally {
      clearTimeout(lent);
      setArbitreLent(false);
      setEnAttente(false);
      actionEnCours.current = false;
    }
  }

  async function quitter() {
    const message =
      etat.statut === "ATTENTE"
        ? "Annuler cette partie ?"
        : "Abandonner ? Ton adversaire gagnera 3 points.";
    if (!window.confirm(message)) return;
    actionEnCours.current = true;
    try {
      const resultat = await abandonner(etat.code);
      if (resultat.etat) setEtat(resultat.etat);
    } finally {
      actionEnCours.current = false;
    }
  }

  async function copierLien() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/en-ligne/${etat.code}`,
      );
      toast.success("Lien copié !");
    } catch {
      toast.error("Copie impossible : recopie le code à la main");
    }
  }

  if (etat.statut === "ATTENTE") {
    return (
      <div className="flex flex-col items-center gap-5" data-statut="ATTENTE">
        <p aria-live="polite" className="text-lg font-semibold text-graphite sm:text-2xl">
          En attente d&apos;un adversaire
          <span className="points-attente" aria-hidden>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
        <div className="post-it bg-postit-jaune flotter flex -rotate-2 flex-col items-center gap-1 px-4 py-4 sm:px-6">
          <span className="text-sm text-graphite">Donne-lui ce code</span>
          <span
            data-code={etat.code}
            className="text-3xl font-bold tracking-[0.15em] text-encre sm:text-4xl sm:tracking-[0.25em]"
          >
            {etat.code}
          </span>
        </div>
        <button
          type="button"
          onClick={copierLien}
          className="cursor-pointer text-lg text-encre underline underline-offset-4"
        >
          Copier le lien d&apos;invitation
        </button>
        <button
          type="button"
          onClick={quitter}
          className="cursor-pointer px-2 py-1.5 text-sm text-graphite underline-offset-4 hover:underline"
        >
          Annuler la partie
        </button>
        {horsLigne && (
          <p className="text-sm text-graphite">Connexion perdue… on réessaie</p>
        )}
      </div>
    );
  }

  if (etat.statut === "EXPIREE") {
    return (
      <div className="flex flex-col items-center gap-5" data-statut="EXPIREE">
        <p className="text-lg font-semibold text-graphite sm:text-2xl">
          Cette partie a expiré
        </p>
        <FormulaireNouvellePartie />
      </div>
    );
  }

  const resultat = resultatDe(etat);
  const monTour =
    etat.statut === "EN_COURS" && etat.tour === etat.monSymbole && !enAttente;

  return (
    <div
      data-moi={etat.monSymbole}
      className="flex w-full max-w-[400px] flex-col items-center gap-3"
    >
      <p className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-graphite">
        <Pseudo etat={etat} symbole="X">{etat.joueurX}</Pseudo>
        contre
        <Pseudo etat={etat} symbole="O">{etat.joueurO}</Pseudo>
      </p>
      <p
        key={`${etat.statut}-${etat.tour}-${arbitreLent}`}
        aria-live="polite"
        data-statut={etat.statut}
        data-resultat={resultat}
        data-tour={etat.statut === "EN_COURS" ? etat.tour : undefined}
        className="pop flex min-h-9 items-center justify-center gap-x-2 text-center text-base font-semibold sm:text-2xl"
        style={{
          color:
            resultat === "gagne"
              ? couleurTexte(etat, etat.monSymbole)
              : resultat === "perdu"
                ? couleurTexte(etat, autre(etat.monSymbole))
                : resultat === "nul"
                  ? "var(--vert-fonce)"
                  : "var(--encre)",
        }}
      >
        <Statut etat={etat} arbitreLent={arbitreLent} />
      </p>
      <PlateauJeu
        cases={etat.plateau.split("")}
        estJouable={(index) => monTour && etat.plateau[index] === " "}
        surClic={cliquer}
        fantome={etat.monSymbole}
        apparences={etat.apparences}
        ligne={etat.ligne}
        attenue={resultat === "nul"}
        fete={resultat === "gagne"}
      />
      <p className="-mt-2 text-xs text-graphite sm:text-sm">
        Aligne {ALIGNEMENT} symboles pour gagner
      </p>
      {horsLigne && (
        <p className="text-sm text-graphite">Connexion perdue… on réessaie</p>
      )}
      <div className="flex min-h-14 flex-col items-center justify-center gap-2">
        {etat.statut === "EN_COURS" && (
          <button
            type="button"
            onClick={quitter}
            className="cursor-pointer px-2 py-1.5 text-sm text-graphite underline-offset-4 hover:underline"
          >
            Abandonner
          </button>
        )}
        {etat.statut === "TERMINEE" && (
          <>
            {etat.piecesGagnees > 0 && (
              <p className="pop flex items-center gap-1 text-sm font-semibold text-encre" data-gain={etat.piecesGagnees}>
                +{etat.piecesGagnees} <IconePiece /> {etat.piecesGagnees > 1 ? "pièces" : "pièce"}
              </p>
            )}
            <ZoneRevanche etat={etat} enCours={revancheEnCours} surClic={revanche} />
            <div className="flex items-center gap-4">
              <FormulaireNouvellePartie discret />
              <Link
                href="/classement"
                className="inline-block py-1 text-sm text-graphite underline-offset-4 hover:underline"
              >
                Classement
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
