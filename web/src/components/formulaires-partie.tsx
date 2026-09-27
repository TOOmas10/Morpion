"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { creerPartie, rejoindrePartie } from "@app/en-ligne/actions";
import BoutonGomme from "@/components/bouton-gomme";
import { BoutonPostIt, CartePostIt } from "@/components/choix";
import { Croix } from "@/components/croquis";
import type { ResultatRejoindre } from "@/lib/types-partie";

const AUCUNE_ERREUR: ResultatRejoindre = { erreur: null };

function ContenuCreer() {
  const { pending } = useFormStatus();
  return (
    <BoutonPostIt couleur="vert" rotation={-2} disabled={pending}>
      <Croix className="size-8 text-rose-fonce" />
      {pending ? "Création…" : "Créer une partie"}
    </BoutonPostIt>
  );
}

export function FormulaireCreer() {
  return (
    <form action={creerPartie}>
      <ContenuCreer />
    </form>
  );
}

function BoutonRejoindre({ texte }: { texte: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded-sm bg-encre px-3 py-1 text-base font-semibold text-white transition active:translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "…" : texte}
    </button>
  );
}

export function FormulaireRejoindre() {
  const [etat, action] = useActionState(rejoindrePartie, AUCUNE_ERREUR);
  return (
    <div className="flex flex-col items-center gap-2">
      <CartePostIt couleur="bleu" rotation={2}>
        <form action={action} className="flex flex-col items-center gap-2">
          <label htmlFor="code" className="text-2xl font-semibold">
            Rejoindre
          </label>
          <input
            id="code"
            name="code"
            placeholder="CODE"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={8}
            aria-invalid={!!etat.erreur}
            aria-describedby={etat.erreur ? "code-erreur" : undefined}
            className="w-24 border-0 border-b-2 border-graphite/50 bg-transparent text-center text-lg font-semibold tracking-[0.2em] uppercase outline-none placeholder:text-graphite/50 focus:border-bleu-fonce"
          />
          <BoutonRejoindre texte="OK" />
        </form>
      </CartePostIt>
      {etat.erreur && (
        <p id="code-erreur" role="alert" className="max-w-40 text-center text-sm font-semibold text-rose-fonce">
          {etat.erreur}
        </p>
      )}
    </div>
  );
}

function BoutonGommeFormulaire({ texte }: { texte: string }) {
  const { pending } = useFormStatus();
  return (
    <BoutonGomme
      type="submit"
      texte={pending ? "Un instant…" : texte}
      disabled={pending}
      autoFocus
    />
  );
}

export function InvitationRejoindre({ code }: { code: string }) {
  const [etat, action] = useActionState(rejoindrePartie, AUCUNE_ERREUR);
  return (
    <form action={action} className="flex flex-col items-center gap-3">
      <input type="hidden" name="code" value={code} />
      <BoutonGommeFormulaire texte="Rejoindre" />
      {etat.erreur && (
        <p role="alert" className="text-center font-semibold text-rose-fonce">
          {etat.erreur}
        </p>
      )}
    </form>
  );
}

export function FormulaireNouvellePartie() {
  return (
    <form action={creerPartie}>
      <BoutonGommeFormulaire texte="Nouvelle partie" />
    </form>
  );
}
