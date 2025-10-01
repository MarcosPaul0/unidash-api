-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('employmentContract', 'independentContractor', 'internship');

-- AlterTable
ALTER TABLE "courseInternshipData" ADD COLUMN     "employmentType" "EmploymentType" NOT NULL DEFAULT 'internship';
