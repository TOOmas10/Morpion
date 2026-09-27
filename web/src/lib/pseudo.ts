export const MOTIF_PSEUDO = /^[a-zA-Z0-9_]{3,20}$/;

export function pseudoValide(pseudo: string): boolean {
  return MOTIF_PSEUDO.test(pseudo);
}

export function emailTechnique(pseudo: string): string {
  return `${pseudo.toLowerCase()}@joueurs.morpion.invalid`;
}
