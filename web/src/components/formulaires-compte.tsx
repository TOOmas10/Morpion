"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import BoutonGomme from "@/components/bouton-gomme";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { emailTechnique, MOTIF_PSEUDO } from "@/lib/pseudo";

const MESSAGES_ERREUR: Record<string, string> = {
  USER_ALREADY_EXISTS: "Ce pseudo est déjà pris",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Ce pseudo est déjà pris",
  USERNAME_IS_ALREADY_TAKEN: "Ce pseudo est déjà pris",
  INVALID_USERNAME: "Pseudo invalide : lettres, chiffres et _ seulement",
  USERNAME_TOO_SHORT: "Pseudo trop court (3 caractères minimum)",
  USERNAME_TOO_LONG: "Pseudo trop long (20 caractères maximum)",
  INVALID_USERNAME_OR_PASSWORD: "Pseudo ou mot de passe incorrect",
  PASSWORD_TOO_SHORT: "Mot de passe trop court (8 caractères minimum)",
  PASSWORD_TOO_LONG: "Mot de passe trop long",
};

function traduire(erreur: { code?: string; status: number }): string {
  if (erreur.status === 429) {
    return "Trop de tentatives : attends quelques secondes";
  }
  return (
    (erreur.code && MESSAGES_ERREUR[erreur.code]) ||
    "Oups, ça n'a pas marché. Réessaie."
  );
}

const CLASSE_CHAMP =
  "h-10 rounded-none border-0 border-b-2 border-graphite/40 bg-transparent px-1 text-lg text-encre transition-colors duration-300 focus-visible:border-rose-fonce focus-visible:ring-0 aria-invalid:border-rose-fonce aria-invalid:ring-0 md:text-lg";

const REGLES_PSEUDO = {
  required: "Choisis un pseudo",
  minLength: { value: 3, message: "3 caractères minimum" },
  maxLength: { value: 20, message: "20 caractères maximum" },
  pattern: { value: MOTIF_PSEUDO, message: "Lettres, chiffres et _ seulement" },
};

function Champ({
  id,
  libelle,
  erreur,
  children,
}: {
  id: string;
  libelle: string;
  erreur?: FieldError;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-ecole text-base text-graphite">
        {libelle}
      </label>
      {children}
      {erreur && (
        <p
          id={`${id}-erreur`}
          className="animate-in fade-in slide-in-from-top-1 text-sm text-rose-fonce duration-200"
        >
          {erreur.message}
        </p>
      )}
    </div>
  );
}

function ErreurServeur({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="animate-in fade-in zoom-in-95 text-center font-semibold text-rose-fonce duration-200"
    >
      {message}
    </p>
  );
}

type ValeursInscription = {
  pseudo: string;
  motDePasse: string;
  confirmation: string;
};

export function FormulaireInscription({ retour }: { retour: string }) {
  const router = useRouter();
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ValeursInscription>();

  async function envoyer(valeurs: ValeursInscription) {
    setErreurServeur(null);
    const { error } = await authClient.signUp.email({
      name: valeurs.pseudo,
      username: valeurs.pseudo,
      email: emailTechnique(valeurs.pseudo),
      password: valeurs.motDePasse,
    });
    if (error) {
      setErreurServeur(traduire(error));
      return;
    }
    router.push(retour);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(envoyer)}
      noValidate
      className="flex w-full max-w-xs flex-col gap-5"
    >
      <Champ id="pseudo" libelle="Pseudo" erreur={errors.pseudo}>
        <Input
          id="pseudo"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={!!errors.pseudo}
          aria-describedby={errors.pseudo ? "pseudo-erreur" : undefined}
          className={CLASSE_CHAMP}
          {...register("pseudo", REGLES_PSEUDO)}
        />
      </Champ>
      <Champ id="motDePasse" libelle="Mot de passe" erreur={errors.motDePasse}>
        <Input
          id="motDePasse"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.motDePasse}
          aria-describedby={errors.motDePasse ? "motDePasse-erreur" : undefined}
          className={CLASSE_CHAMP}
          {...register("motDePasse", {
            required: "Choisis un mot de passe",
            minLength: { value: 8, message: "8 caractères minimum" },
            maxLength: { value: 128, message: "128 caractères maximum" },
          })}
        />
      </Champ>
      <Champ id="confirmation" libelle="Confirme le mot de passe" erreur={errors.confirmation}>
        <Input
          id="confirmation"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmation}
          aria-describedby={errors.confirmation ? "confirmation-erreur" : undefined}
          className={CLASSE_CHAMP}
          {...register("confirmation", {
            required: "Recopie ton mot de passe",
            validate: (valeur) =>
              valeur === getValues("motDePasse") || "Les deux mots de passe sont différents",
          })}
        />
      </Champ>
      <p className="text-center text-sm text-graphite">
        Pas d&apos;email : note bien ton mot de passe, il ne pourra pas être récupéré.
      </p>
      <ErreurServeur message={erreurServeur} />
      <div className="flex justify-center pt-2">
        <BoutonGomme
          type="submit"
          texte={isSubmitting ? "Un instant…" : "Je m'inscris"}
          disabled={isSubmitting}
        />
      </div>
      <p className="text-center text-graphite">
        Déjà un compte ?{" "}
        <Link
          href={`/connexion?retour=${encodeURIComponent(retour)}`}
          className="inline-block py-1 text-encre underline underline-offset-4"
        >
          Connecte-toi
        </Link>
      </p>
    </form>
  );
}

type ValeursConnexion = {
  pseudo: string;
  motDePasse: string;
};

export function FormulaireConnexion({ retour }: { retour: string }) {
  const router = useRouter();
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ValeursConnexion>();

  async function envoyer(valeurs: ValeursConnexion) {
    setErreurServeur(null);
    const { error } = await authClient.signIn.username({
      username: valeurs.pseudo,
      password: valeurs.motDePasse,
    });
    if (error) {
      setErreurServeur(traduire(error));
      return;
    }
    router.push(retour);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(envoyer)}
      noValidate
      className="flex w-full max-w-xs flex-col gap-5"
    >
      <Champ id="pseudo" libelle="Pseudo" erreur={errors.pseudo}>
        <Input
          id="pseudo"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={!!errors.pseudo}
          aria-describedby={errors.pseudo ? "pseudo-erreur" : undefined}
          className={CLASSE_CHAMP}
          {...register("pseudo", { required: "Ton pseudo est obligatoire" })}
        />
      </Champ>
      <Champ id="motDePasse" libelle="Mot de passe" erreur={errors.motDePasse}>
        <Input
          id="motDePasse"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.motDePasse}
          aria-describedby={errors.motDePasse ? "motDePasse-erreur" : undefined}
          className={CLASSE_CHAMP}
          {...register("motDePasse", {
            required: "Ton mot de passe est obligatoire",
          })}
        />
      </Champ>
      <ErreurServeur message={erreurServeur} />
      <div className="flex justify-center pt-2">
        <BoutonGomme
          type="submit"
          texte={isSubmitting ? "Un instant…" : "Je me connecte"}
          disabled={isSubmitting}
        />
      </div>
      <p className="text-center text-graphite">
        Pas encore de compte ?{" "}
        <Link
          href={`/inscription?retour=${encodeURIComponent(retour)}`}
          className="inline-block py-1 text-encre underline underline-offset-4"
        >
          Inscris-toi
        </Link>
      </p>
    </form>
  );
}
