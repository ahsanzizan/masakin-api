/*
  Warnings:

  - You are about to drop the `ingredients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_recipeId_fkey";

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "ingredients" TEXT;

-- DropTable
DROP TABLE "ingredients";
