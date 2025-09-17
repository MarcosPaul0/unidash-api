/*
  Warnings:

  - Added the required column `currentEducation` to the `studentIncomingData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishProficiencyLevel` to the `studentIncomingData` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CurrentEducation" AS ENUM ('technicalInField', 'technicalOutField', 'higherInField', 'higherOutField', 'none');

-- CreateEnum
CREATE TYPE "EnglishProficiencyLevel" AS ENUM ('low', 'intermediate', 'fluent');

-- AlterTable
ALTER TABLE "studentIncomingData" ADD COLUMN     "currentEducation" "CurrentEducation" NOT NULL,
ADD COLUMN     "englishProficiencyLevel" "EnglishProficiencyLevel" NOT NULL;
