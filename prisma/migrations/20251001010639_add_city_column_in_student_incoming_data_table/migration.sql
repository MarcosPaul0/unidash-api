/*
  Warnings:

  - Added the required column `cityId` to the `studentIncomingData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "studentIncomingData" ADD COLUMN     "cityId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "studentIncomingData" ADD CONSTRAINT "studentIncomingData_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
