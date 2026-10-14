import Link from "next/link";
import BoutonDeconnexion from "@/components/bouton-deconnexion";
import { IconeBadge, IconePiece } from "@/components/icones-boutique";
import { badgeDe } from "@/lib/apparence";
import { lireSession, pseudoDe } from "@/lib/session";

export default async function EtiquetteCompte() {
  const session = await lireSession();

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
  const badge = badgeDe(session.user);
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 text-xs sm:text-sm">
      <span className="font-semibold whitespace-nowrap text-encre" data-compte={session.user.username}>
        {pseudoDe(session.user)}
        {badge && <IconeBadge badge={badge} className="ml-1" />}
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
