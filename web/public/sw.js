const VERSION = "v1";
const CACHE_PAGES = `morpion-pages-${VERSION}`;
const CACHE_FICHIERS = `morpion-fichiers-${VERSION}`;

const FICHIERS_A_RAFRAICHIR = [
  "/morpion.py",
  "/icon.svg",
  "/favicon.ico",
  "/apple-icon.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    (async () => {
      const noms = await caches.keys();
      await Promise.all(
        noms
          .filter((nom) => nom.startsWith("morpion-") && nom !== CACHE_PAGES && nom !== CACHE_FICHIERS)
          .map((nom) => caches.delete(nom)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (evenement) => {
  const requete = evenement.request;
  if (requete.method !== "GET") return;
  const url = new URL(requete.url);

  if (estImmuable(url)) {
    evenement.respondWith(cacheDabord(requete));
  } else if (url.origin === self.location.origin && FICHIERS_A_RAFRAICHIR.includes(url.pathname)) {
    evenement.respondWith(cacheEtRafraichit(requete));
  } else if (
    requete.mode === "navigate" &&
    url.origin === self.location.origin &&
    !url.pathname.startsWith("/api/")
  ) {
    evenement.respondWith(reseauDabord(requete));
  }
});

function estImmuable(url) {
  if (url.origin === "https://cdn.jsdelivr.net") return url.pathname.startsWith("/pyodide/");
  if (url.origin !== self.location.origin) return false;
  return url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icones/");
}

async function cacheDabord(requete) {
  const cache = await caches.open(CACHE_FICHIERS);
  const enCache = await cache.match(requete);
  if (enCache) return enCache;
  const reponse = await fetch(requete);
  if (reponse.ok || reponse.type === "opaque") cache.put(requete, reponse.clone());
  return reponse;
}

async function cacheEtRafraichit(requete) {
  const cache = await caches.open(CACHE_FICHIERS);
  const enCache = await cache.match(requete);
  const miseAJour = fetch(requete)
    .then((reponse) => {
      if (reponse.ok) cache.put(requete, reponse.clone());
      return reponse;
    })
    .catch(() => enCache);
  return enCache ?? miseAJour;
}

async function reseauDabord(requete) {
  const cache = await caches.open(CACHE_PAGES);
  try {
    const reponse = await fetch(requete);
    if (reponse.ok) cache.put(requete, reponse.clone());
    return reponse;
  } catch {
    return (
      (await cache.match(requete)) ??
      (await cache.match("/")) ??
      new Response("Pas de connexion : rouvre le Morpion une fois en ligne.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}
