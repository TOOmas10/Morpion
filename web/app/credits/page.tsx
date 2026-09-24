import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Retour } from "@/components/choix";

export const metadata: Metadata = {
  title: "Crédits",
};

function Techno({ children }: { children: ReactNode }) {
  return <span className="rounded-sm bg-[var(--fluo-jaune)]/40 px-1">{children}</span>;
}

export default function CreditsPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Retour href="/" />
      <p className="font-ecole text-2xl text-encre">Crédits</p>
      <ul className="flex flex-col gap-2 text-lg text-encre">
        <li>— Réalisé par Thomas Berthaud</li>
        <li>
          — IA : algorithme <Techno>minimax</Techno>, écrit en <Techno>Python</Techno>
        </li>
        <li>
          — Python dans le navigateur : <Techno>Pyodide</Techno>
        </li>
        <li>
          — Site : <Techno>Next.js</Techno>, <Techno>React</Techno>, <Techno>Tailwind CSS</Techno>
        </li>
        <li>
          — Polices : <Techno>Shantell Sans</Techno>, <Techno>Playwrite FR</Techno>
        </li>
        <li>— Cours A2 — 2026</li>
      </ul>
    </div>
  );
}
