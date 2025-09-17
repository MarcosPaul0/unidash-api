/*
  Warnings:

  - You are about to drop the column `courseId` on the `teacherResearchAndExtensionProjectsData` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `teacherTechnicalScientificProductionsData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "teacherResearchAndExtensionProjectsData" DROP CONSTRAINT "teacherResearchAndExtensionProjectsData_courseId_fkey";

-- DropForeignKey
ALTER TABLE "teacherTechnicalScientificProductionsData" DROP CONSTRAINT "teacherTechnicalScientificProductionsData_courseId_fkey";

-- AlterTable
ALTER TABLE "teacherResearchAndExtensionProjectsData" DROP COLUMN "courseId";

-- AlterTable
ALTER TABLE "teacherTechnicalScientificProductionsData" DROP COLUMN "courseId";
