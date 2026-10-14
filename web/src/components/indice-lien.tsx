"use client";

import { useLinkStatus } from "next/link";
import { cn } from "@/lib/utils";

// Petits points qui s'allument sur le lien cliqué tant que la page suivante se prépare
// (classement, en ligne…). Toujours présents, seule l'opacité change : rien ne bouge.
export default function IndiceLien({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={cn(
        "points-attente pointer-events-none text-xl leading-none text-graphite transition-opacity duration-150",
        pending ? "opacity-100 delay-100" : "opacity-0",
        className,
      )}
    >
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  );
}
