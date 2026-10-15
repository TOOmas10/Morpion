"use client";

import Link from "next/link";
import BoutonDeconnexion from "@/components/bouton-deconnexion";
import { IconeBadge, IconePiece } from "@/components/icones-boutique";
import { badgeDe } from "@/lib/apparence";
import { authClient } from "@/lib/auth-client";

// Lue dans le navigateur (et rafraîchie après un gain ou un achat) : aucune page n'a besoin
// d'interroger la base au rendu juste pour l'en-tête, elles peuvent donc être statiques.
export default function EtiquetteCompte() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending && !session) return <span aria-hidden />;

  if (!session) {
    return (
      <Link
        href="/connexion"
        className="inline-block py-1 text-xs text-graphite underline-offset-4 hover:underline sm:text-sm"
      >
        Se connecter
      </Link>
    );
  }

  const { points, pieces } = session.user;
  const pseudo = session.user.displayUsername ?? session.user.username ?? session.user.name;
  const badge = badgeDe(session.user);
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 text-xs sm:text-sm">
      <span className="font-semibold whitespace-nowrap text-encre" data-compte={session.user.username}>
        <Link
          href="/compte"
          aria-label={`${pseudo}, ouvrir mon compte`}
          className="py-1 underline-offset-4 hover:underline"
        >
          {pseudo}
          {badge && <IconeBadge badge={badge} className="ml-1" />}
        </Link>
        <span className="font-normal text-graphite">
          {" "}
          ·{" "}
          <span key={points} className="pop inline-block">
            {points} {points > 1 ? "pts" : "pt"}
          </span>
        </span>
      </span>
      <Link
        href="/boutique"
        data-pieces={pieces}
        aria-label={`${pieces} ${pieces > 1 ? "pièces" : "pièce"}, ouvrir la boutique`}
        className="inline-flex items-center gap-1 py-1 font-semibold whitespace-nowrap text-encre underline-offset-4 hover:underline"
      >
        <IconePiece />
        <span key={pieces} className="pop inline-block">
          {pieces}
        </span>
      </Link>
      <BoutonDeconnexion />
    </div>
  );
}
