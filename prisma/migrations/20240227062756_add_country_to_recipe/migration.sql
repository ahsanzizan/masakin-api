/*
  Warnings:

  - Added the required column `country` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "country" TEXT NOT NULL;
