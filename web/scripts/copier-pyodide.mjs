// Copie Pyodide (le Python du navigateur) depuis node_modules vers public/pyodide/<version>/,
// pour le servir depuis notre propre site au lieu d'un CDN tiers. Lancé après chaque `npm install`.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const source = "node_modules/pyodide";
const { version } = JSON.parse(readFileSync(join(source, "package.json"), "utf8"));
const racine = "public/pyodide";
const cible = join(racine, version);
// pyodide.mjs : la version « module » du chargeur, la seule acceptée dans un Web Worker par Pyodide 314.
const FICHIERS = ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"];

// On repart d'un dossier propre : une seule version, et seulement les fichiers utiles.
if (existsSync(racine)) {
  for (const dossier of readdirSync(racine)) rmSync(join(racine, dossier), { recursive: true, force: true });
}
mkdirSync(cible, { recursive: true });
for (const fichier of FICHIERS) copyFileSync(join(source, fichier), join(cible, fichier));
console.log(`Pyodide ${version} copié dans ${cible}`);
