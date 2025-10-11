/*
  Warnings:

  - You are about to drop the column `workloadInMinutes` on the `courseTeacherWorkloadData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courseTeacherWorkloadData" DROP COLUMN "workloadInMinutes",
ADD COLUMN     "workloadInHours" SMALLINT NOT NULL DEFAULT 0;
