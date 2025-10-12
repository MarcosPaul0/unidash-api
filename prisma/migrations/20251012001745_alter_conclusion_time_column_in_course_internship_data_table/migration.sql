/*
  Warnings:

  - You are about to drop the column `conclusionTime` on the `courseInternshipData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courseInternshipData" DROP COLUMN "conclusionTime",
ADD COLUMN     "conclusionTimeInDays" SMALLINT NOT NULL DEFAULT 0;
