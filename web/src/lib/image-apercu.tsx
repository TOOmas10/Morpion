import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Images d'aperçu (Open Graph) affichées quand un lien du site est partagé
// (WhatsApp, Discord, réseaux sociaux…) : une feuille de cahier sur le bureau, dans le style du jeu.

export const TAILLE_APERCU = { width: 1200, height: 630 };

const ROSE = "#ff4fa3";
const BLEU = "#22b8f0";
const ENCRE = "#2b2d33";

async function polices() {
  const [ecole, main] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/playwrite-fr-trad-400.ttf")),
    readFile(join(process.cwd(), "src/fonts/shantell-sans-600.ttf")),
  ]);
  return [
    { name: "Ecole", data: ecole, style: "normal" as const, weight: 400 as const },
    { name: "Main", data: main, style: "normal" as const, weight: 600 as const },
  ];
}

function Croix({ taille }: { taille: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 100 100">
      <path d="M 22 22 C 40 38, 60 62, 78 78" stroke={ROSE} strokeWidth={15} strokeLinecap="round" fill="none" />
      <path d="M 78 22 C 60 38, 40 62, 22 78" stroke={ROSE} strokeWidth={15} strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Rond({ taille }: { taille: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={28} stroke={BLEU} strokeWidth={15} fill="none" />
    </svg>
  );
}

export async function imageApercu({
  surTitre,
  titre,
  sousTitre,
}: {
  surTitre?: string;
  titre: string;
  sousTitre: string;
}) {
  const lignes = Array.from({ length: 14 }, (_, i) => 70 + i * 38);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#e9c893", padding: 36 }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "#fffefa",
            borderRadius: 6,
            boxShadow: "0 18px 40px -12px rgba(90,60,20,0.45)",
            paddingLeft: 150,
            paddingRight: 60,
          }}
        >
          {lignes.map((haut) => (
            <div
              key={haut}
              style={{ position: "absolute", left: 0, right: 0, top: haut, height: 2, background: "#c9d6f5" }}
            />
          ))}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 110, width: 3, background: "#f2a1a8" }} />
          {surTitre && (
            <div style={{ display: "flex", fontFamily: "Main", fontSize: 40, color: "#55595f", marginBottom: 6 }}>
              {surTitre}
            </div>
          )}
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Ecole",
                fontSize: 78,
                color: ENCRE,
                background: "rgba(255,230,0,0.75)",
                padding: "0 18px",
                borderRadius: 6,
                transform: "rotate(-1deg)",
              }}
            >
              {titre}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Main", fontSize: 40, color: ENCRE, marginTop: 28, maxWidth: 940 }}>
            {sousTitre}
          </div>
          <div style={{ display: "flex", gap: 4, marginTop: 22, marginLeft: -10 }}>
            <Croix taille={76} />
            <Rond taille={76} />
            <Croix taille={76} />
            <Croix taille={76} />
          </div>
        </div>
      </div>
    ),
    { ...TAILLE_APERCU, fonts: await polices() },
  );
}
