// Moteur du Morpion : Pyodide et morpion.py tournent ici, dans un Web Worker,
// pour que le chargement de Python et la réflexion de l'IA ne figent jamais l'écran.
const URL_PYODIDE = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";

importScripts(URL_PYODIDE + "pyodide.js");

const pret = (async () => {
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
