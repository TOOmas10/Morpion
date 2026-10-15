import { imageApercu, TAILLE_APERCU } from "@/lib/image-apercu";
import { lireInvitation, normaliserCode } from "@/lib/parties";

export const alt = "Invitation à une partie de Morpion 7×6";
export const size = TAILLE_APERCU;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const invitation = await lireInvitation(normaliserCode((await params).code));
  if (!invitation) {
    return imageApercu({ titre: "Morpion 7×6", sousTitre: "Une partie en ligne : 4 symboles alignés pour gagner." });
  }
  return imageApercu({
    surTitre: `${invitation.hote} t'invite à jouer !`,
    titre: "Morpion 7×6",
    sousTitre: "Rejoins la partie en un clic : le premier qui aligne 4 symboles gagne.",
  });
}
