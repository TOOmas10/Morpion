"use client";

import { useState, useSyncExternalStore } from "react";
import { choisirStatistiques, statistiquesRefusees } from "@/lib/statistiques";

const abonner = () => () => {};

// Case de la politique de confidentialité : refuser (ou accepter de nouveau) d'être compté.
export default function ChoixStatistiques() {
  const refusInitial = useSyncExternalStore(abonner, statistiquesRefusees, () => null);
  const [refus, setRefus] = useState<boolean | null>(null);
  const actuel = refus ?? refusInitial;
  if (actuel === null) return <p className="min-h-8" aria-hidden />;

  return (
    <label className="flex min-h-8 cursor-pointer items-center gap-2 text-sm text-encre">
      <input
        type="checkbox"
        checked={actuel}
        onChange={(evenement) => {
          choisirStatistiques(!evenement.target.checked);
          setRefus(evenement.target.checked);
        }}
        className="size-4 cursor-pointer accent-rose-fonce"
        data-refus-statistiques
      />
      Ne pas compter mes visites dans les statistiques
    </label>
  );
}
