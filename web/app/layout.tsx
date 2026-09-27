import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Playwrite_FR_Trad, Shantell_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Bureau from "@/components/bureau";
import ServiceWorker from "@/components/service-worker";

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

const ecole = Playwrite_FR_Trad({
  variable: "--font-ecole",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={cn("h-full", shantell.variable, ecole.variable)}>
      <body className="h-full antialiased">
        <Bureau>{children}</Bureau>
        <Toaster />
        <ServiceWorker />
      </body>
    </html>
  );
}
