/*
  Warnings:

  - Added the required column `cookDuration` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "cookDuration" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updatedAt" TIMESTAMP(3);
