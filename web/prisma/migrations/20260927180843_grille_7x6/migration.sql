-- AlterTable
ALTER TABLE "partie" ALTER COLUMN "plateau" SET DEFAULT '                                          ';

-- Les parties en 3×3 ne sont pas compatibles avec la grille 7×6
DELETE FROM "partie" WHERE length("plateau") <> 42;
