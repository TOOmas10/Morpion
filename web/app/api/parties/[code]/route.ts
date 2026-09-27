import { etatPourUtilisateur, normaliserCode } from "@/lib/parties";
import { lireSession } from "@/lib/session";

export async function GET(
  _requete: Request,
  contexte: RouteContext<"/api/parties/[code]">,
) {
  const session = await lireSession();
  if (!session) {
    return Response.json({ erreur: "Connecte-toi" }, { status: 401 });
  }
  const { code } = await contexte.params;
  const etat = await etatPourUtilisateur(normaliserCode(code), session.user.id);
  if (!etat) {
    return Response.json({ erreur: "Partie introuvable" }, { status: 404 });
  }
  return Response.json(etat, { headers: { "Cache-Control": "no-store" } });
}
