/*
  Warnings:

  - Added the required column `dairyFree` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `glutenFree` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `healthy` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servings` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sustainable` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vegan` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vegetarian` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "dairyFree" BOOLEAN NOT NULL,
ADD COLUMN     "glutenFree" BOOLEAN NOT NULL,
ADD COLUMN     "healthy" BOOLEAN NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "servings" INTEGER NOT NULL,
ADD COLUMN     "sustainable" BOOLEAN NOT NULL,
ADD COLUMN     "vegan" BOOLEAN NOT NULL,
ADD COLUMN     "vegetarian" BOOLEAN NOT NULL;
