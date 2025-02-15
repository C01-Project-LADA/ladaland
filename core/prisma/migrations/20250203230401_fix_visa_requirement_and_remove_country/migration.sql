/*
  Warnings:

  - You are about to drop the column `destinationCountryId` on the `VisaRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `originCountryId` on the `VisaRequirement` table. All the data in the column will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[passport,destination]` on the table `VisaRequirement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `destination` to the `VisaRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passport` to the `VisaRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VisaRequirement" DROP CONSTRAINT "VisaRequirement_destinationCountryId_fkey";

-- DropForeignKey
ALTER TABLE "VisaRequirement" DROP CONSTRAINT "VisaRequirement_originCountryId_fkey";

-- DropIndex
DROP INDEX "VisaRequirement_originCountryId_destinationCountryId_key";

-- AlterTable
ALTER TABLE "VisaRequirement" DROP COLUMN "destinationCountryId",
DROP COLUMN "originCountryId",
ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "passport" TEXT NOT NULL;

-- DropTable
DROP TABLE "Country";

-- CreateIndex
CREATE UNIQUE INDEX "VisaRequirement_passport_destination_key" ON "VisaRequirement"("passport", "destination");
