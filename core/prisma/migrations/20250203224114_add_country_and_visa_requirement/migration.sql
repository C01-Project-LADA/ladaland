-- CreateTable
CREATE TABLE "Country" (
    "cid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "VisaRequirement" (
    "id" SERIAL NOT NULL,
    "requirement" TEXT NOT NULL,
    "originCountryId" INTEGER NOT NULL,
    "destinationCountryId" INTEGER NOT NULL,

    CONSTRAINT "VisaRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VisaRequirement_originCountryId_destinationCountryId_key" ON "VisaRequirement"("originCountryId", "destinationCountryId");

-- AddForeignKey
ALTER TABLE "VisaRequirement" ADD CONSTRAINT "VisaRequirement_originCountryId_fkey" FOREIGN KEY ("originCountryId") REFERENCES "Country"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaRequirement" ADD CONSTRAINT "VisaRequirement_destinationCountryId_fkey" FOREIGN KEY ("destinationCountryId") REFERENCES "Country"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;
