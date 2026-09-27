import Link from "next/link";
import BoutonDeconnexion from "@/components/bouton-deconnexion";
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

  const points = session.user.points;
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 text-xs sm:text-sm">
      <span className="font-semibold whitespace-nowrap text-encre" data-compte={session.user.username}>
        {pseudoDe(session.user)}
        <span className="font-normal text-graphite">
          {" "}
          ·{" "}
          <span key={points} className="pop inline-block">
            {points} {points > 1 ? "pts" : "pt"}
          </span>
        </span>
      </span>
      <BoutonDeconnexion />
    </div>
  );
}
