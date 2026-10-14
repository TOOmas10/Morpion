# Boutique, pièces et personnalisation

Le jeu a une monnaie (les **pièces**), une **boutique** et une personnalisation qui suit le joueur dans
tous les modes : contre l'IA, à deux sur le même écran et en ligne.

## Ce que voit le joueur

- Le menu compte 4 post-its : Jouer, **Boutique**, Classement, Crédits.
- L'en-tête de la feuille affiche le pseudo, le badge, les points et les pièces : `thomas ⭐ · 42 pts · 🪙 17`.
  Un clic sur les pièces ouvre la boutique.
- Il gagne des pièces en jouant, les dépense dans la boutique, et l'article acheté est **équipé tout de suite**.
- L'onglet **Ma collection** liste ce qu'il possède et permet de changer d'équipement
  (« Par défaut » revient au style d'origine).
- Son symbole apparaît partout : son adversaire en ligne le voit, et son badge s'affiche au classement.

## Deux compteurs séparés

| Compteur | Sert à | Se dépense ? |
|---|---|---|
| `points` | le classement (en ligne uniquement) | non, jamais |
| `pieces` | la boutique | oui |

Acheter ne fait donc jamais reculer au classement.

## Gagner des pièces

Il faut être connecté.

| Partie | Pièces |
|---|---|
| En ligne | victoire 3, nul 1, défaite 1, **abandon 0** |
| Contre l'IA (par partie terminée) | facile 1, moyen 2, difficile 3 |
| À deux sur le même écran | 1 |

- Les parties **en solo** (IA et à deux) sont plafonnées à **30 pièces par tranche de 24 h**.
- Les parties **en ligne** ne sont pas plafonnées : elles sont arbitrées par le serveur.
- Celui qui abandonne ne gagne rien, pour qu'on ne puisse pas abandonner en boucle.

## Le catalogue

| Catégorie | Articles (prix en pièces) |
|---|---|
| Formes | Croix 0, Rond 0, Triangle 8, Carré 8, Cœur 12, Étoile 15, Éclair 15 |
| Couleurs | Rose fluo 0, Bleu fluo 0, Vert fluo 5, Orange fluo 5, Violet 6, Graphite 6 |
| Tracés | Surligneur 0, Feutre 10, Crayon à papier 10, Craie 14, Néon 20 |
| Badges | Étoile 6, Trombone doré 10, Fusée 15, Couronne 25 |

Il faut 190 pièces pour tout posséder. Les articles à 0 sont gratuits pour tout le monde.

**Changer un prix ou ajouter un article** : tout se passe dans `src/lib/boutique.ts` (le tableau `ARTICLES`).
Une nouvelle forme se dessine dans `src/components/symbole.tsx` (le tableau `TRAITS`), une nouvelle couleur
dans `COULEURS_CSS`, un nouveau badge dans `src/components/icones-boutique.tsx`.

## Règle d'apparence

- Par défaut, X est une **croix rose** et O un **rond bleu**, avec le tracé surligneur.
- Contre l'IA et à deux, le joueur connecté joue les X avec son style ; l'IA et le joueur 2 gardent le rond bleu.
- En ligne, chaque joueur garde son style, quel que soit le camp tiré au sort.
- Si les deux joueurs ont **la même forme dans la même couleur**, le joueur O reprend une apparence
  par défaut différente, pour qu'on distingue toujours les deux camps.

## Base de données

Migration `prisma/migrations/…_boutique` (uniquement des ajouts, aucune donnée existante modifiée) :

- **Table `user`** : `pieces` (0 par défaut) et 4 champs d'équipement `forme`, `couleur`, `trace`, `badge`
  (vide = par défaut).
- **Table `possession`** : une ligne par article acheté. Un même joueur ne peut pas posséder deux fois
  le même article (contrainte d'unicité).
- **Table `partie_locale`** : une ligne par partie en solo. Elle sert de jeton anti-triche et au calcul
  du plafond sur 24 h.

## Comment ça marche

### Un achat

1. Le joueur clique deux fois (« 8 » puis « Confirmer ? »).
2. L'action serveur `acheter` fait tout dans **une seule transaction** : elle vérifie que l'article n'est pas
   déjà possédé, retire les pièces seulement s'il y en a assez, enregistre l'achat et équipe l'article.
3. Si quoi que ce soit échoue, rien n'est fait. Deux achats simultanés du même article ne passent qu'une fois,
   et le solde ne peut jamais devenir négatif.

### Les pièces en solo

1. Au début d'une partie, le serveur crée un jeton (`commencerPartieLocale`).
2. À la fin, le navigateur envoie le jeton et la grille finale (`terminerPartieLocale`).
3. Le serveur vérifie que le jeton appartient au joueur, n'a pas déjà servi et a été émis il y a au moins 3 s ;
   `morpion.py` confirme que la grille est une vraie partie terminée.
4. Le plafond est appliqué, puis les pièces sont créditées.

Une personne très motivée pourrait fabriquer une fausse grille finale, mais elle ne gagnerait jamais
plus que le plafond de 30 pièces par jour.

### Les pièces en ligne

Elles sont versées par le serveur au même moment que les points, dans la même transaction
(`verserRecompenses` dans `src/lib/parties.ts`).

### Sécurité

- Le navigateur ne décide jamais du nombre de pièces.
- On ne peut équiper qu'un article acheté (ou gratuit) : le serveur le vérifie.
- Les champs `pieces` et d'équipement ne peuvent pas être modifiés par le joueur via Better Auth
  (`input: false`, et la route `/update-user` est désactivée).

## Fichiers créés

| Fichier | Rôle |
|---|---|
| `prisma/migrations/…_boutique/` | La migration de la base |
| `src/lib/boutique.ts` | Le catalogue, les prix, les couleurs et le barème des pièces |
| `src/lib/apparence.ts` | La règle d'apparence (défauts, conflit d'allure, badge) |
| `src/lib/boutique-serveur.ts` | La lecture du solde, des possessions et de l'équipement |
| `src/components/symbole.tsx` | Le dessin de tous les symboles (7 formes × 6 couleurs × 5 tracés) et les filtres crayon/craie |
| `src/components/icones-boutique.tsx` | Les icônes des badges et de la pièce |
| `src/components/vitrine.tsx` | L'interface de la boutique et de la collection |
| `app/boutique/page.tsx` | La page Boutique (visible sans compte) |
| `app/boutique/collection/page.tsx` | La page Ma collection (compte obligatoire) |
| `app/boutique/actions.ts` | Les actions serveur `acheter` et `equiper` |
| `app/jouer/actions.ts` | Les actions serveur des pièces en solo |

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `prisma/schema.prisma` | Les nouveaux champs et les 2 nouvelles tables |
| `src/lib/auth.ts` | Better Auth connaît les nouveaux champs, non modifiables par le joueur |
| `src/lib/session.ts` | `equipementConnecte()` : l'équipement du joueur connecté |
| `src/lib/types-partie.ts` | L'état d'une partie en ligne contient apparences, badges et pièces gagnées |
| `src/lib/parties.ts` | `verserRecompenses` (points + pièces) et lecture de l'équipement des joueurs |
| `app/en-ligne/actions.ts` | Utilise `verserRecompenses` (fin de partie et abandon) |
| `src/components/plateau.tsx` | Chaque camp est dessiné avec son apparence |
| `src/components/morpion.tsx` | Style du joueur, statuts à sa couleur, demande de pièces en fin de partie |
| `src/components/salle-en-ligne.tsx` | Pseudos à la couleur de chacun avec leur badge, pièces gagnées |
| `src/components/etiquette-compte.tsx` | Badge et solde de pièces dans l'en-tête |
| `app/jouer/ia/[niveau]/page.tsx`, `app/jouer/duo/page.tsx` | Transmettent l'équipement du joueur |
| `app/classement/page.tsx` | Badge à côté du pseudo |
| `app/en-ligne/[code]/page.tsx` | Badge de l'hôte sur l'invitation |
| `app/layout.tsx` | Charge les filtres de tracé une seule fois pour tout le site |
| `app/page.tsx` | Post-it « Boutique » dans le menu |

`morpion.py` n'a pas changé : il sert en plus à valider les grilles des parties en solo.

## Tester en local

Après une modification du schéma, redémarre `npm run dev` (le serveur garde l'ancien client Prisma en mémoire).

Pour se donner des pièces sans jouer :

```sql
update "user" set pieces = 100 where username = 'thomas';
```

## En production (Vercel)

Rien à faire à la main : le script `vercel-build` exécute `prisma migrate deploy` avant `next build`,
ce qui applique la migration à la base Neon à chaque déploiement. Les comptes existants commencent à 0 pièce.
