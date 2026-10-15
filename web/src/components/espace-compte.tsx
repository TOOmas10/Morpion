"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconeBadge, IconePiece } from "@/components/icones-boutique";
import { Input } from "@/components/ui/input";
import { badgeDe } from "@/lib/apparence";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const CLASSE_BOUTON =
  "cursor-pointer rounded-sm px-3 py-1.5 text-sm font-semibold transition active:translate-y-px disabled:cursor-wait disabled:opacity-60";

function Rubrique({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="flex w-full flex-col gap-2">
      <h3 className="font-ecole text-lg text-encre">{titre}</h3>
      {children}
    </section>
  );
}

// Mon compte : résumé, téléchargement de ses données, déconnexion des autres appareils
// et suppression du compte (droits d'accès, de portabilité et d'effacement du RGPD).
export default function EspaceCompte() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [autresAppareils, setAutresAppareils] = useState<number | null>(null);
  const [motDePasse, setMotDePasse] = useState("");
  const [visible, setVisible] = useState(false);
  const [enCours, setEnCours] = useState<"appareils" | "suppression" | null>(null);
  const moi = session?.user.id;
  const sessionActuelle = session?.session.id;

  useEffect(() => {
    if (!isPending && !session) router.replace("/connexion?retour=/compte");
  }, [isPending, session, router]);

  useEffect(() => {
    if (!moi) return;
    let annule = false;
    authClient.listSessions().then(({ data }) => {
      if (!annule && data) setAutresAppareils(data.filter((s) => s.id !== sessionActuelle).length);
    });
    return () => {
      annule = true;
    };
  }, [moi, sessionActuelle]);

  if (!session) {
    return (
      <p className="text-graphite" role="status">
        Un instant…
      </p>
    );
  }

  const { points, pieces, createdAt } = session.user;
  const pseudo = session.user.displayUsername ?? session.user.username ?? session.user.name;
  const badge = badgeDe(session.user);
  const inscrit = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(createdAt));

  async function deconnecterAutres() {
    setEnCours("appareils");
    const { error } = await authClient.revokeOtherSessions();
    setEnCours(null);
    if (error) {
      toast.error("Ça n'a pas marché, réessaie");
      return;
    }
    setAutresAppareils(0);
    toast.success("Tes autres appareils sont déconnectés");
  }

  async function supprimer(evenement: React.FormEvent) {
    evenement.preventDefault();
    if (!motDePasse) return;
    setEnCours("suppression");
    const { error } = await authClient.deleteUser({ password: motDePasse });
    if (error) {
      setEnCours(null);
      toast.error(error.status === 429 ? "Trop d'essais : réessaie dans quelques minutes" : "Mot de passe incorrect");
      return;
    }
    toast.success("Ton compte et toutes tes données ont été supprimés");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      <div className="post-it bg-postit-jaune flex -rotate-1 flex-col items-center gap-1 px-5 py-3 text-center">
        <p className="text-lg font-semibold text-encre" data-mon-compte={session.user.username}>
          {pseudo}
          {badge && <IconeBadge badge={badge} className="ml-1" />}
        </p>
        <p className="flex items-center gap-2 text-sm text-graphite">
          {points} {points > 1 ? "pts" : "pt"} ·
          <span className="inline-flex items-center gap-1">
            <IconePiece /> {pieces}
          </span>
        </p>
        <p className="text-xs text-graphite">Inscrit le {inscrit}</p>
      </div>

      <Rubrique titre="Mes données">
        <p className="text-sm text-graphite">
          Tout ce que le Morpion garde sur toi, dans un fichier lisible (JSON).
        </p>
        <a
          href="/api/mes-donnees"
          download
          className={cn(CLASSE_BOUTON, "self-start bg-postit-bleu text-encre")}
        >
          Télécharger mes données
        </a>
      </Rubrique>

      <Rubrique titre="Mes appareils">
        <p className="text-sm text-graphite" data-autres-appareils={autresAppareils ?? undefined}>
          {autresAppareils === null
            ? "…"
            : autresAppareils === 0
              ? "Tu n'es connecté que sur cet appareil."
              : `Tu es aussi connecté sur ${autresAppareils} autre${autresAppareils > 1 ? "s" : ""} appareil${autresAppareils > 1 ? "s" : ""}.`}
        </p>
        {!!autresAppareils && (
          <button
            type="button"
            onClick={deconnecterAutres}
            disabled={enCours !== null}
            className={cn(CLASSE_BOUTON, "self-start bg-encre text-white")}
          >
            {enCours === "appareils" ? "…" : "Déconnecter mes autres appareils"}
          </button>
        )}
      </Rubrique>

      <Rubrique titre="Supprimer mon compte">
        <p className="text-sm text-graphite">
          Tes points, tes pièces, tes achats et tes parties seront effacés pour toujours.
        </p>
        <form onSubmit={supprimer} className="flex flex-col gap-2">
          <label htmlFor="motDePasseSuppression" className="font-ecole text-base text-graphite">
            Ton mot de passe pour confirmer
          </label>
          <Input
            id="motDePasseSuppression"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            value={motDePasse}
            onChange={(evenement) => setMotDePasse(evenement.target.value)}
            className="h-10 rounded-none border-0 border-b-2 border-graphite/40 bg-transparent px-1 text-lg text-encre focus-visible:border-rose-fonce focus-visible:ring-0 md:text-lg"
          />
          <label
            htmlFor="afficher-suppression"
            className="flex cursor-pointer items-center gap-2 self-start py-1 text-sm text-graphite"
          >
            <input
              id="afficher-suppression"
              type="checkbox"
              checked={visible}
              onChange={(evenement) => setVisible(evenement.target.checked)}
              className="size-4 cursor-pointer accent-rose-fonce"
            />
            Afficher le mot de passe
          </label>
          <button
            type="submit"
            disabled={!motDePasse || enCours !== null}
            className={cn(CLASSE_BOUTON, "self-start bg-rose-fonce text-white disabled:cursor-not-allowed")}
          >
            {enCours === "suppression" ? "Suppression…" : "Supprimer définitivement"}
          </button>
        </form>
      </Rubrique>

      <Link href="/confidentialite" className="py-1 text-sm text-graphite underline underline-offset-4">
        Comment tes données sont utilisées
      </Link>
    </div>
  );
}
