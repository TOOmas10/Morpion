import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";
import { emailTechnique, pseudoValide } from "@/lib/pseudo";

function https(domaine: string | undefined): string | undefined {
  return domaine ? `https://${domaine}` : undefined;
}

const adresseProduction = https(process.env.VERCEL_PROJECT_PRODUCTION_URL);

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
          const affiche =
            typeof displayUsername === "string" ? displayUsername : pseudo;
          return {
            data: { ...utilisateur, name: affiche, email: emailTechnique(pseudo) },
          };
        },
      },
    },
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
    additionalFields: {
      points: {
        type: "number",
        required: true,
        defaultValue: 0,
        input: false,
      },
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
