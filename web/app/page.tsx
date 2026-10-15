import { Choix, ChoixPostIt } from "@/components/choix";
import TransitionPage from "@/components/transition-page";
import { EDITEUR, NOM_DU_SITE, urlDuSite } from "@/lib/site";

// Description du jeu lisible par les moteurs de recherche (données structurées schema.org).
const DONNEES_STRUCTUREES = {
  "@context": "https://schema.org",
  "@type": ["VideoGame", "WebApplication"],
  name: NOM_DU_SITE,
  url: urlDuSite(),
  description:
    "Jeu de morpion sur une grille de 7 colonnes et 6 lignes : aligne 4 symboles contre une IA, à deux ou en ligne.",
  inLanguage: "fr",
  genre: ["Jeu de réflexion", "Jeu de plateau"],
  gamePlatform: "Navigateur web",
  applicationCategory: "GameApplication",
  operatingSystem: "Tous",
  playMode: ["SinglePlayer", "MultiPlayer"],
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  author: { "@type": "Person", name: EDITEUR.nom },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(DONNEES_STRUCTUREES).replace(/</g, "\\u003c") }}
      />
      <TransitionPage>
        <div className="flex flex-col items-center gap-6">
          <Choix>
            <ChoixPostIt href="/jouer" couleur="rose" rotation={-2}>
              Jouer
            </ChoixPostIt>
            <ChoixPostIt href="/boutique" couleur="bleu" rotation={-1}>
              Boutique
            </ChoixPostIt>
            <ChoixPostIt href="/classement" couleur="vert" rotation={1}>
              Classement
            </ChoixPostIt>
            <ChoixPostIt href="/credits" couleur="jaune" rotation={2}>
              Crédits
            </ChoixPostIt>
          </Choix>
        </div>
      </TransitionPage>
    </>
  );
}
