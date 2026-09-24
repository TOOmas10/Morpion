import random

HUMAIN = "X"
IA = "O"
VIDE = " "

LIGNES_GAGNANTES = (
    (0, 1, 2), (3, 4, 5), (6, 7, 8),
    (0, 3, 6), (1, 4, 7), (2, 5, 8),
    (0, 4, 8), (2, 4, 6),
)


def afficher_plateau(plateau):
    print()
    cases = []
    for i in range(9): 
        if plateau[i] == VIDE:
            cases.append(str(i + 1))
        else: 
            cases.append(plateau[i])
    for debut in range(0,9,3):
        print(f" {cases[debut]} | {cases[debut + 1]} | {cases[debut + 2]} ")
        if debut != 6: 
            print("---+---+---")
    print()


def coups_possibles(plateau) : 
    liste = []
    for i in range(9):
        if plateau[i] == VIDE:
            liste.append(i)  
    return liste

def plein(plateau):
    return VIDE not in plateau


def adversaire(joueur):
    if joueur == "X":
        return "O"
    else:
        return "X"

def jouer(plateau, case, joueur): 
    nouveau = plateau.copy()
    nouveau[case] = joueur
    return nouveau


def gagnant(plateau):
    for a,b,c in LIGNES_GAGNANTES: 
        if plateau[a] != VIDE and plateau[a] == plateau[b] == plateau[c]:
            return plateau[a]
    return None


def minimax(plateau, profondeur, tour_ia):
    g = gagnant(plateau)
    if g == IA:
        return 10 - profondeur
    if g == HUMAIN: 
        return profondeur - 10
    if plein(plateau):
        return 0

    if tour_ia: 
        meilleur = -float("inf")
        for case in coups_possibles(plateau):
            nouveau_plateau = jouer(plateau, case, IA)
            score = minimax(nouveau_plateau, profondeur + 1, False)
            meilleur = max(meilleur,score)
        return meilleur
    else: 
        meilleur = float("inf")
        for case in coups_possibles(plateau):
            nouveau_plateau = jouer(plateau, case, HUMAIN)
            score = minimax(nouveau_plateau, profondeur + 1, True)
            meilleur = min(meilleur,score)
        return meilleur


def meilleur_coup(plateau): 
    meilleur_score = -float("inf")
    meilleur_case = None
    for case in coups_possibles(plateau):
        nouveau_plateau = jouer(plateau,case, IA)
        score = minimax(nouveau_plateau, 1, False)
        if score > meilleur_score:
            meilleur_score = score
            meilleur_case = case
    return meilleur_case


def coup_aleatoire(plateau):
    return random.choice(coups_possibles(plateau))


def coup_malin(plateau):
    for case in coups_possibles(plateau):
        if gagnant(jouer(plateau, case, IA)) == IA:
            return case
    for case in coups_possibles(plateau):
        if gagnant(jouer(plateau, case, HUMAIN)) == HUMAIN:
            return case
    return coup_aleatoire(plateau)


def coup_ia(plateau, niveau):
    if niveau == "facile":
        return coup_aleatoire(plateau)
    if niveau == "moyen":
        return coup_malin(plateau)
    return meilleur_coup(plateau)


def demander_coup(plateau):
    while True:
        saisie= input("Ta case (1-9) : ")
        if not saisie.isdigit():
            print("Erreur, la saisie doit être un chiffre")
            continue
        numero = int(saisie)
        if numero < 1 or numero > 9: 
            print("Le chiffre doit être entre 1 et 9")
            continue
        case = numero - 1 
        if plateau[case] != VIDE:
            print("Cette case est déjà prise")
            continue
        return case


def partie():
    print()
    plateau = [VIDE] * 9
    tour = HUMAIN
    while gagnant(plateau) is None and not plein(plateau):
        afficher_plateau(plateau)
        if tour == HUMAIN: 
            case = demander_coup(plateau)
        else: 
            case = meilleur_coup(plateau)
            print(f"L'IA joue en {case + 1}")
        plateau = jouer(plateau, case, tour)
        tour = adversaire(tour)
    afficher_plateau(plateau)
    g = gagnant(plateau)
    if g == HUMAIN:
        print("Tu as gagné !")
    elif g == IA:
        print("Tu as perdu !")
    else:
        print("Match nul !")
    print()


def demander_rejouer():
    while True:
        reponse = input("Rejouer ? (o/n) : ").strip().lower()
        if reponse == "o":
            return True
        if reponse == "n": 
            return False
        print("Réponds par o ou n")


if __name__ == "__main__":
    encore = True
    while encore: 
        partie()
        encore = demander_rejouer()
    print()
    print("À bientôt !")
    print()
    