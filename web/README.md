# Morpion 7×6

Morpion sur une grille de 7 colonnes × 6 rangées : il faut aligner 4 symboles.
On joue contre une IA (3 niveaux), à deux sur le même écran, ou en ligne avec un code d'invitation.

La logique du jeu est en Python (`public/morpion.py`) :

- dans le navigateur, via Pyodide, pour l'IA (minimax avec élagage alpha-bêta) ;
- sur le serveur, pour arbitrer les parties en ligne (`src/lib/arbitre.ts`).

## Prérequis

- Node 20 (`nvm use`)
- PostgreSQL en local (par exemple Postgres.app) avec une base `morpion`

## Installation

Crée un fichier `.env` :

```bash
DATABASE_URL="postgresql://<utilisateur>@localhost:5432/morpion"
BETTER_AUTH_SECRET="<secret aléatoire : openssl rand -base64 32>"
BETTER_AUTH_URL="http://localhost:3000"
```

Puis :

```bash
npm install
npx prisma migrate dev
npm run dev
```

Le site tourne sur [http://localhost:3000](http://localhost:3000).

## Après une modification du schéma Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

## Application installable (PWA)

Le site s'installe comme une application : sur Android (Chrome), menu ⋮ → « Installer l'application » ;
sur iPhone (Safari), bouton Partager → « Sur l'écran d'accueil ».
Après une première visite en ligne, les modes contre l'IA et à deux fonctionnent hors connexion
(`public/sw.js`, actif uniquement en production).

## Déploiement sur Vercel

- Root Directory : `web`
- Base de données : Neon (Vercel Marketplace), qui fournit `DATABASE_URL` et `DATABASE_URL_UNPOOLED`
- Variables à ajouter : `BETTER_AUTH_SECRET` et `BETTER_AUTH_URL` (l'adresse de production, en https)
- Le script `vercel-build` applique les migrations (`prisma migrate deploy`) avant `next build`
