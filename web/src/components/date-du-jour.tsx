"use client";

import { useSyncExternalStore } from "react";

const abonner = () => () => {};
const jour = () => new Date().toDateString();

// Calculée dans le navigateur : la page reste statique (servie instantanément) et la date est la bonne.
export default function DateDuJour() {
  const aujourdhui = useSyncExternalStore(abonner, jour, () => null);
  const classe = "font-ecole shrink-0 text-xs whitespace-nowrap text-graphite sm:text-sm";
  if (!aujourdhui) return <p className={classe} aria-hidden />;

  const date = new Date(aujourdhui);
  const longue = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  const courte = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(date);
  return (
    <p className={classe}>
      <span className="hidden sm:inline">{longue.charAt(0).toUpperCase() + longue.slice(1)}</span>
      <span className="sm:hidden">{courte}</span>
    </p>
  );
}
