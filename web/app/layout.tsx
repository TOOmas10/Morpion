import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Shantell_Sans } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Bureau from "@/components/bureau";
import MesureAudience from "@/components/mesure-audience";
import ServiceWorker from "@/components/service-worker";
import { FiltresTrace } from "@/components/symbole";
import { EDITEUR, NOM_DU_SITE, urlDuSite } from "@/lib/site";

const DESCRIPTION =
  "Jeu de morpion 7×6 gratuit : aligne 4 symboles contre une IA écrite en Python, à deux sur le même écran ou en ligne avec tes amis. Classement, boutique de styles, sans publicité.";

export const metadata: Metadata = {
  metadataBase: new URL(urlDuSite()),
  title: {
    default: "Morpion 7×6 : jeu de morpion gratuit en ligne, à 4 alignés",
    template: `%s · ${NOM_DU_SITE}`,
  },
  description: DESCRIPTION,
  applicationName: NOM_DU_SITE,
  authors: [{ name: EDITEUR.nom }],
  creator: EDITEUR.nom,
  keywords: ["morpion", "morpion 7x6", "4 alignés", "jeu de morpion en ligne", "morpion contre l'ordinateur", "jeu gratuit"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: NOM_DU_SITE,
    title: NOM_DU_SITE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: NOM_DU_SITE, description: DESCRIPTION },
  // Code fourni par Google Search Console, à mettre dans la variable GOOGLE_SITE_VERIFICATION sur Vercel.
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
  appleWebApp: {
    capable: true,
    title: "Morpion",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3e0bd",
};

const shantell = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-hand",
});

// Playwrite FR Trad (licence OFL) hébergée ici en graisse 400 seule : 43 Ko au lieu de 70 Ko,
// et préchargée, pour que les titres ne sautent pas quand la police arrive.
const ecole = localFont({
  src: "../src/fonts/playwrite-fr-trad-400.woff2",
  weight: "400",
  variable: "--font-ecole",
  display: "swap",
  preload: true,
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={cn("h-full", shantell.variable, ecole.variable)}>
      <body className="h-full antialiased">
        <FiltresTrace />
        <Bureau>{children}</Bureau>
        <Toaster />
        <ServiceWorker />
        {/* Uniquement sur Vercel : ailleurs (en local), le script de mesure n'existe pas. */}
        {process.env.VERCEL && <MesureAudience />}
      </body>
    </html>
  );
}
