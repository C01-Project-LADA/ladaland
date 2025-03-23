/*
  Warnings:

  - Added the required column `location` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "location" TEXT NOT NULL;
