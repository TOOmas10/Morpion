import type { Metadata } from "next";
import "./globals.css";
import { Playwrite_FR_Trad, Shantell_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Bureau from "@/components/bureau";

export const metadata: Metadata = {
  title: "Morpion",
  description: "Morpion contre une IA minimax écrite en Python",
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
    <html
      lang="fr"
      className={cn("h-full", shantell.variable, ecole.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={cn("antialiased", "h-full")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <Bureau>{children}</Bureau>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
