-- CreateEnum
CREATE TYPE "StatutPartie" AS ENUM ('ATTENTE', 'EN_COURS', 'TERMINEE', 'EXPIREE');

-- CreateTable
CREATE TABLE "partie" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "statut" "StatutPartie" NOT NULL DEFAULT 'ATTENTE',
    "plateau" TEXT NOT NULL DEFAULT '         ',
    "tour" TEXT NOT NULL DEFAULT 'X',
    "gagnant" TEXT,
    "finPar" TEXT,
    "joueurXId" TEXT NOT NULL,
    "joueurOId" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partie_code_key" ON "partie"("code");

-- CreateIndex
CREATE INDEX "partie_joueurXId_idx" ON "partie"("joueurXId");

-- CreateIndex
CREATE INDEX "partie_joueurOId_idx" ON "partie"("joueurOId");

-- AddForeignKey
ALTER TABLE "partie" ADD CONSTRAINT "partie_joueurXId_fkey" FOREIGN KEY ("joueurXId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partie" ADD CONSTRAINT "partie_joueurOId_fkey" FOREIGN KEY ("joueurOId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
