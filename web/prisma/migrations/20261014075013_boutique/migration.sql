-- AlterTable
ALTER TABLE "user" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "couleur" TEXT,
ADD COLUMN     "forme" TEXT,
ADD COLUMN     "pieces" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trace" TEXT;

-- CreateTable
CREATE TABLE "possession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "acheteLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "possession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partie_locale" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "niveau" TEXT,
    "terminee" BOOLEAN NOT NULL DEFAULT false,
    "pieces" INTEGER NOT NULL DEFAULT 0,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partie_locale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "possession_userId_article_key" ON "possession"("userId", "article");

-- CreateIndex
CREATE INDEX "partie_locale_userId_creeLe_idx" ON "partie_locale"("userId", "creeLe");

-- AddForeignKey
ALTER TABLE "possession" ADD CONSTRAINT "possession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partie_locale" ADD CONSTRAINT "partie_locale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
