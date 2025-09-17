-- CreateEnum
CREATE TYPE "ConclusionTime" AS ENUM ('bigger', 'medium', 'smaller');

-- CreateTable
CREATE TABLE "courseInternshipData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "studentMatriculation" VARCHAR(10) NOT NULL,
    "enterpriseCnpj" VARCHAR(14) NOT NULL,
    "role" VARCHAR(60) NOT NULL,
    "conclusionTime" "ConclusionTime" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,
    "advisorId" UUID NOT NULL,
    "cityId" UUID NOT NULL,

    CONSTRAINT "courseInternshipData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courseInternshipData_studentMatriculation_key" ON "courseInternshipData"("studentMatriculation");

-- AddForeignKey
ALTER TABLE "courseInternshipData" ADD CONSTRAINT "courseInternshipData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseInternshipData" ADD CONSTRAINT "courseInternshipData_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseInternshipData" ADD CONSTRAINT "courseInternshipData_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
