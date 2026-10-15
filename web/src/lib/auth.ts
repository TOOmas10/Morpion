import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";
import { emailTechnique, pseudoAutorise, pseudoValide } from "@/lib/pseudo";

function https(domaine: string | undefined): string | undefined {
  return domaine ? `https://${domaine}` : undefined;
}

const adresseProduction = https(process.env.VERCEL_PROJECT_PRODUCTION_URL);

async function noterVisite(idUtilisateur: unknown) {
  if (typeof idUtilisateur !== "string") return;
  await prisma.user.updateMany({ where: { id: idUtilisateur }, data: { vuLe: new Date() } });
}

const adressesVercel = [
  adresseProduction,
  https(process.env.VERCEL_URL),
  https(process.env.VERCEL_BRANCH_URL),
].filter((adresse): adresse is string => !!adresse);

export const auth = betterAuth({
  baseURL: adresseProduction ?? process.env.BETTER_AUTH_URL,
  trustedOrigins: adressesVercel,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  databaseHooks: {
    // Date de dernière visite, mise à jour à la connexion puis au rafraîchissement quotidien de la session.
    session: {
      create: { after: async (session) => noterVisite(session.userId) },
      update: { after: async (session) => noterVisite(session.userId) },
    },
    user: {
      create: {
        before: async (utilisateur) => {
          const { username: pseudo, displayUsername } = utilisateur as {
            username?: unknown;
            displayUsername?: unknown;
          };
          if (typeof pseudo !== "string" || !pseudoValide(pseudo)) {
            throw new APIError("BAD_REQUEST", {
              message: "Pseudo obligatoire",
              code: "INVALID_USERNAME",
            });
          }
          // Seulement à l'inscription : un joueur déjà inscrit peut toujours se connecter.
          if (!pseudoAutorise(pseudo)) {
            throw new APIError("BAD_REQUEST", {
              message: "Ce pseudo n'est pas autorisé",
              code: "PSEUDO_INTERDIT",
            });
          }
          const affiche =
            typeof displayUsername === "string" ? displayUsername : pseudo;
          return {
            data: { ...utilisateur, name: affiche, email: emailTechnique(pseudo) },
          };
        },
      },
    },
  },
  // Compteurs en base : sur Vercel, chaque serveur a sa propre mémoire, un compteur en mémoire
  // ne freinerait donc presque rien. Les règles sont souples pour une classe entière derrière
  // la même adresse IP, mais bloquent les essais de mots de passe en rafale.
  rateLimit: {
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/*": { window: 60, max: 10 },
      "/sign-up/*": { window: 600, max: 15 },
      "/delete-user": { window: 300, max: 5 },
      // Lue à chaque ouverture de page : inutile de la compter (et ça éviterait une écriture en base).
      "/get-session": false,
    },
  },
  advanced: {
    // Adresse du visiteur fournie par Vercel (impossible à falsifier depuis le navigateur).
    ipAddress: { ipAddressHeaders: ["x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"] },
  },
  disabledPaths: [
    "/sign-in/email",
    "/update-user",
    "/change-email",
    "/request-password-reset",
    "/reset-password",
    "/send-verification-email",
    "/verify-email",
  ],
  user: {
    // « Supprimer mon compte » (page Mon compte) : le mot de passe est toujours redemandé.
    // Les sessions, achats, parties et jetons du joueur partent avec lui (suppression en cascade).
    deleteUser: { enabled: true },
    additionalFields: {
      points: {
        type: "number",
        required: true,
        defaultValue: 0,
        input: false,
      },
      pieces: {
        type: "number",
        required: true,
        defaultValue: 0,
        input: false,
      },
      forme: { type: "string", required: false, input: false },
      couleur: { type: "string", required: false, input: false },
      trace: { type: "string", required: false, input: false },
      badge: { type: "string", required: false, input: false },
    },
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 20,
      usernameValidator: pseudoValide,
      displayUsernameValidator: pseudoValide,
    }),
    nextCookies(),
  ],
});
