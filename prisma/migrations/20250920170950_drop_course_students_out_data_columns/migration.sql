/*
  Warnings:

  - You are about to drop the column `canceled` on the `courseStudentsData` table. All the data in the column will be lost.
  - You are about to drop the column `graduates` on the `courseStudentsData` table. All the data in the column will be lost.
  - You are about to drop the column `locks` on the `courseStudentsData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courseStudentsData" DROP COLUMN "canceled",
DROP COLUMN "graduates",
DROP COLUMN "locks";
