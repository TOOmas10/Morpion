// Moteur du Morpion : Pyodide et morpion.py tournent ici, dans un Web Worker « module »
// (le seul type de worker accepté par Pyodide 314), pour que le chargement de Python
// et la réflexion de l'IA ne figent jamais l'écran.
// Pyodide est servi par le site lui-même ; sa version arrive dans l'adresse du worker (?pyodide=…).
const version = new URL(self.location.href).searchParams.get("pyodide") ?? "";
if (!/^[0-9][0-9.a-z]*$/.test(version)) throw new Error("Version de Pyodide invalide");
const URL_PYODIDE = new URL(`/pyodide/${version}/`, self.location.origin).href;

const pret = (async () => {
  const { loadPyodide } = await import(URL_PYODIDE + "pyodide.mjs");
  const pyodide = await loadPyodide({ indexURL: URL_PYODIDE });
  const reponse = await fetch("/morpion.py");
  if (!reponse.ok) throw new Error("morpion.py introuvable");
  pyodide.FS.writeFile("/home/pyodide/morpion.py", await reponse.text());
  const morpion = pyodide.pyimport("morpion");
  const proxy = morpion.LIGNES_GAGNANTES;
  const lignes = proxy.toJs();
  proxy.destroy();
  return { pyodide, morpion, lignes };
})();
pret.catch(() => {});

function avecListe(moteur, plateau, calcul) {
  const liste = moteur.pyodide.toPy(plateau);
  try {
    return calcul(liste);
  } finally {
    liste.destroy();
  }
}

function analyser(moteur, plateau) {
  return avecListe(moteur, plateau, (liste) => {
    const gagnant = moteur.morpion.gagnant(liste) ?? null;
    const ligne = gagnant
      ? (moteur.lignes.find((l) => l.every((i) => plateau[i] === gagnant)) ?? null)
      : null;
    return { gagnant, plein: moteur.morpion.plein(liste), ligne };
  });
}

self.onmessage = async (evenement) => {
  const { id, type, plateau, niveau } = evenement.data;
  try {
    const moteur = await pret;
    let resultat = null;
    if (type === "analyser") resultat = analyser(moteur, plateau);
    else if (type === "jouer") {
      resultat = avecListe(moteur, plateau, (liste) => moteur.morpion.coup_ia(liste, niveau));
    }
    self.postMessage({ id, ok: true, resultat });
  } catch (erreur) {
    self.postMessage({ id, ok: false, erreur: String(erreur?.message ?? erreur) });
  }
};
