import random
import time

HUMAIN = "X"
IA = "O"
VIDE = " "

COLONNES = 7
RANGEES = 6
CASES = COLONNES * RANGEES
ALIGNEMENT = 4
CENTRE = (RANGEES // 2) * COLONNES + COLONNES // 2

GAIN = 100000
POIDS = (0, 1, 8, 64, 0)
POIDS_ADVERSE = (0, 2, 12, 96, 0)
TEMPS_DIFFICILE = 0.6
LARGEUR = 12


class TempsEcoule(Exception):
    pass


def calculer_lignes_gagnantes():
    lignes = []
    for rang in range(RANGEES):
        for colonne in range(COLONNES):
            for dr, dc in ((0, 1), (1, 0), (1, 1), (1, -1)):
                fin_rang = rang + dr * (ALIGNEMENT - 1)
                fin_colonne = colonne + dc * (ALIGNEMENT - 1)
                if 0 <= fin_rang < RANGEES and 0 <= fin_colonne < COLONNES:
                    lignes.append(tuple(
                        (rang + dr * k) * COLONNES + colonne + dc * k
                        for k in range(ALIGNEMENT)
                    ))
    return tuple(lignes)


def calculer_voisines():
    voisines = []
    for case in range(CASES):
        rang, colonne = divmod(case, COLONNES)
        liste = []
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                r, c = rang + dr, colonne + dc
                if (dr or dc) and 0 <= r < RANGEES and 0 <= c < COLONNES:
                    liste.append(r * COLONNES + c)
        voisines.append(tuple(liste))
    return tuple(voisines)


LIGNES_GAGNANTES = calculer_lignes_gagnantes()
LIGNES_PAR_CASE = tuple(
    tuple(ligne for ligne in LIGNES_GAGNANTES if case in ligne)
    for case in range(CASES)
)
VOISINES = calculer_voisines()


def coups_possibles(plateau):
    return [case for case in range(CASES) if plateau[case] == VIDE]


def plein(plateau):
    return VIDE not in plateau


def adversaire(joueur):
    return HUMAIN if joueur == IA else IA


def gagnant(plateau):
    for ligne in LIGNES_GAGNANTES:
        premier = plateau[ligne[0]]
        if premier != VIDE and all(plateau[case] == premier for case in ligne):
            return premier
    return None


def gagne_en(plateau, case, joueur):
    for ligne in LIGNES_PAR_CASE[case]:
        if all(autre == case or plateau[autre] == joueur for autre in ligne):
            return True
    return False


def coups_candidats(plateau):
    candidats = set()
    for case in range(CASES):
        if plateau[case] != VIDE:
            for voisine in VOISINES[case]:
                if plateau[voisine] == VIDE:
                    candidats.add(voisine)
    if not candidats:
        return [CENTRE] if plateau[CENTRE] == VIDE else coups_possibles(plateau)
    return list(candidats)


def interet(plateau, case):
    total = 0
    for ligne in LIGNES_PAR_CASE[case]:
        ia = humain = 0
        for autre in ligne:
            if plateau[autre] == IA:
                ia += 1
            elif plateau[autre] == HUMAIN:
                humain += 1
        if not humain:
            total += POIDS[ia + 1]
        if not ia:
            total += POIDS[humain + 1]
    return total


def coups_tries(plateau):
    candidats = coups_candidats(plateau)
    candidats.sort(key=lambda case: interet(plateau, case), reverse=True)
    return candidats


def evaluation(plateau):
    score = 0
    for ligne in LIGNES_GAGNANTES:
        ia = humain = 0
        for case in ligne:
            if plateau[case] == IA:
                ia += 1
            elif plateau[case] == HUMAIN:
                humain += 1
        if ia and not humain:
            score += POIDS[ia]
        elif humain and not ia:
            score -= POIDS_ADVERSE[humain]
    return score


def minimax(plateau, profondeur, restante, alpha, beta, tour_ia, fin):
    if time.perf_counter() > fin:
        raise TempsEcoule
    joueur = IA if tour_ia else HUMAIN
    candidats = coups_tries(plateau)
    if not candidats:
        return 0

    for case in candidats:
        if gagne_en(plateau, case, joueur):
            return GAIN - profondeur if tour_ia else profondeur - GAIN

    menaces = [case for case in candidats if gagne_en(plateau, case, adversaire(joueur))]
    if len(menaces) >= 2:
        return profondeur + 1 - GAIN if tour_ia else GAIN - profondeur - 1
    if restante == 0:
        return evaluation(plateau)
    if menaces:
        candidats = menaces
    else:
        candidats = candidats[:LARGEUR]

    meilleur = -float("inf") if tour_ia else float("inf")
    for case in candidats:
        plateau[case] = joueur
        try:
            score = minimax(plateau, profondeur + 1, restante - 1, alpha, beta, not tour_ia, fin)
        finally:
            plateau[case] = VIDE
        if tour_ia:
            meilleur = max(meilleur, score)
            alpha = max(alpha, score)
        else:
            meilleur = min(meilleur, score)
            beta = min(beta, score)
        if alpha >= beta:
            break
    return meilleur


def meilleur_coup(plateau, budget=TEMPS_DIFFICILE):
    plateau = list(plateau)
    fin = time.perf_counter() + budget
    candidats = coups_tries(plateau)
    for case in candidats:
        if gagne_en(plateau, case, IA):
            return case
    for case in candidats:
        if gagne_en(plateau, case, HUMAIN):
            return case

    candidats = candidats[:LARGEUR]
    choix = candidats[0]
    for restante in range(1, CASES):
        try:
            meilleur_score = -float("inf")
            meilleur_case = candidats[0]
            alpha = -float("inf")
            for case in candidats:
                plateau[case] = IA
                try:
                    score = minimax(plateau, 1, restante - 1, alpha, float("inf"), False, fin)
                finally:
                    plateau[case] = VIDE
                if score > meilleur_score:
                    meilleur_score = score
                    meilleur_case = case
                alpha = max(alpha, score)
        except TempsEcoule:
            break
        choix = meilleur_case
        if abs(meilleur_score) > GAIN - CASES:
            break
        candidats.remove(choix)
        candidats.insert(0, choix)
    return choix


def coup_aleatoire(plateau):
    return random.choice(coups_candidats(plateau))


def coup_malin(plateau):
    candidats = coups_tries(plateau)
    for case in candidats:
        if gagne_en(plateau, case, IA):
            return case
    for case in candidats:
        if gagne_en(plateau, case, HUMAIN):
            return case
    return random.choice(candidats[:3])


def coup_ia(plateau, niveau):
    if niveau == "facile":
        return coup_aleatoire(plateau)
    if niveau == "moyen":
        return coup_malin(plateau)
    return meilleur_coup(plateau)
