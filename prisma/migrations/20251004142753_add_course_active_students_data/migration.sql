/*
  Warnings:

  - You are about to drop the column `actives` on the `courseStudentsData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courseStudentsData" DROP COLUMN "actives";

-- CreateTable
CREATE TABLE "courseActiveStudentsData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseActiveStudentsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activeStudentsByIngress" (
    "id" UUID NOT NULL,
    "ingressYear" SMALLINT NOT NULL,
    "numberOfStudents" SMALLINT NOT NULL DEFAULT 0,
    "courseActiveStudentsDataId" UUID NOT NULL,

    CONSTRAINT "activeStudentsByIngress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courseActiveStudentsData_year_semester_courseId_key" ON "courseActiveStudentsData"("year", "semester", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "activeStudentsByIngress_ingressYear_courseActiveStudentsDat_key" ON "activeStudentsByIngress"("ingressYear", "courseActiveStudentsDataId");

-- AddForeignKey
ALTER TABLE "courseActiveStudentsData" ADD CONSTRAINT "courseActiveStudentsData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activeStudentsByIngress" ADD CONSTRAINT "activeStudentsByIngress_courseActiveStudentsDataId_fkey" FOREIGN KEY ("courseActiveStudentsDataId") REFERENCES "courseActiveStudentsData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
