import { Choix, ChoixPostIt } from "@/components/choix";
import PrechargerIA from "@/components/precharger-ia";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Choix>
        <ChoixPostIt href="/jouer" couleur="rose" rotation={-2}>
          Jouer
        </ChoixPostIt>
        <ChoixPostIt href="/credits" couleur="jaune" rotation={2}>
          Crédits
        </ChoixPostIt>
      </Choix>
      <PrechargerIA />
    </div>
  );
}
