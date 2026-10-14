import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Shantell_Sans } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Bureau from "@/components/bureau";
import ServiceWorker from "@/components/service-worker";
import { FiltresTrace } from "@/components/symbole";

export const metadata: Metadata = {
  title: "Morpion",
  applicationName: "Morpion",
  description: "Morpion 7×6 contre une IA minimax écrite en Python",
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
      </body>
    </html>
  );
}
