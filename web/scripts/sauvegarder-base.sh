#!/bin/bash
# Sauvegarde complète de la base du Morpion (structure + données) dans un fichier daté.
# Sur l'offre gratuite, Neon ne permet de revenir en arrière que de 6 heures : garde des copies.
#
# Utilisation (dans ton terminal ; l'adresse contient ton mot de passe, ne la colle nulle part ailleurs) :
#   BASE='postgresql://…adresse sans -pooler…' bash scripts/sauvegarder-base.sh
#
# Restaurer une sauvegarde dans une base VIDE :
#   pg_restore --list FICHIER.dump | grep -vE "SCHEMA - public |COMMENT - SCHEMA public " > liste
#   pg_restore --dbname="$BASE" --no-owner --no-acl --exit-on-error --use-list=liste FICHIER.dump
set -euo pipefail

: "${BASE:?Il manque BASE, adresse de la base à sauvegarder}"
PG_DUMP=$(command -v pg_dump || echo /Applications/Postgres.app/Contents/Versions/latest/bin/pg_dump)

DOSSIER="$(dirname "$0")/../sauvegardes"
mkdir -p "$DOSSIER"
FICHIER="$DOSSIER/morpion-$(date +%Y-%m-%d-%Hh%M).dump"

"$PG_DUMP" "$BASE" --schema=public --no-owner --no-acl --format=custom --file="$FICHIER"
echo "Sauvegarde faite : $FICHIER ($(du -h "$FICHIER" | cut -f1))"
echo "Elle contient des données personnelles : garde-la en lieu sûr, jamais sur GitHub."
