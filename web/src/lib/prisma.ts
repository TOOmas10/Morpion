import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const memoire = globalThis as unknown as {
  prisma?: PrismaClient;
};

function creerClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = memoire.prisma ?? creerClient();

if (process.env.NODE_ENV !== "production") memoire.prisma = prisma;
