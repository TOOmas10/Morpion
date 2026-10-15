import { imageApercu, TAILLE_APERCU } from "@/lib/image-apercu";

export const alt = "Morpion 7×6 : aligne 4 symboles contre l'IA, à deux ou en ligne";
export const size = TAILLE_APERCU;
export const contentType = "image/png";

export default function Image() {
  return imageApercu({
    titre: "Morpion 7×6",
    sousTitre: "Aligne 4 symboles contre l'IA, à deux ou en ligne. Gratuit, sans pub.",
  });
}
