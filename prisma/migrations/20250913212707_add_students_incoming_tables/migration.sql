-- CreateEnum
CREATE TYPE "WorkExpectation" AS ENUM ('employmentContract', 'independentContractor', 'undecided', 'publicSector', 'academicCareer');

-- CreateEnum
CREATE TYPE "HighSchoolDiscipline" AS ENUM ('history', 'geography', 'portuguese', 'biology', 'chemical', 'mathematics', 'physical', 'english', 'technology');

-- CreateEnum
CREATE TYPE "AffinityLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "HobbyOrHabit" AS ENUM ('videoGames', 'physicalActivity', 'listeningMusic', 'teamSports', 'moviesOrSeries', 'reading', 'internetBrowsing', 'playingInstrument', 'socialMedia', 'traveling', 'individualSports', 'handcrafting', 'other');

-- CreateEnum
CREATE TYPE "Asset" AS ENUM ('car', 'motorcycle', 'virtualAssistant', 'payTv', 'printer', 'internet', 'tablet', 'desktopComputer', 'laptop', 'smartphone');

-- CreateEnum
CREATE TYPE "CourseChoiceReason" AS ENUM ('hobbyRelation', 'financialReasons', 'courseQuality', 'sisuPreference', 'notFirstChoice', 'higherEducationDesire', 'professionalUpdate', 'other');

-- CreateEnum
CREATE TYPE "UniversityChoiceReason" AS ENUM ('reputation', 'closePeople', 'publicEducation', 'professionalReasons', 'financialReasons', 'notFirstChoice', 'other');

-- CreateEnum
CREATE TYPE "Technology" AS ENUM ('internetNavigation', 'softwareInstallation', 'programmingAndLanguages', 'spreadsheets', 'operatingSystemSetup');

-- CreateTable
CREATE TABLE "studentIncomingData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "workExpectation" "WorkExpectation" NOT NULL,
    "nocturnalPreference" BOOLEAN NOT NULL,
    "knowRelatedCourseDifference" BOOLEAN NOT NULL,
    "readPedagogicalProject" BOOLEAN NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" UUID NOT NULL,

    CONSTRAINT "studentIncomingData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentAffinityByDisciplineData" (
    "id" UUID NOT NULL,
    "discipline" "HighSchoolDiscipline" NOT NULL,
    "affinityLevel" "AffinityLevel" NOT NULL,
    "studentIncomingDataId" UUID NOT NULL,

    CONSTRAINT "studentAffinityByDisciplineData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentHobbyOrHabit" (
    "id" UUID NOT NULL,
    "hobbyOrHabit" "HobbyOrHabit" NOT NULL,
    "description" VARCHAR(200) NOT NULL,

    CONSTRAINT "studentHobbyOrHabit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentHobbyOrHabitData" (
    "id" UUID NOT NULL,
    "studentIncomingDataId" UUID NOT NULL,
    "studentHobbyOrHabitId" UUID NOT NULL,

    CONSTRAINT "studentHobbyOrHabitData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentAsset" (
    "id" UUID NOT NULL,
    "asset" "Asset" NOT NULL,
    "description" VARCHAR(200) NOT NULL,

    CONSTRAINT "studentAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentAssetData" (
    "id" UUID NOT NULL,
    "studentIncomingDataId" UUID NOT NULL,
    "studentAssetId" UUID NOT NULL,

    CONSTRAINT "studentAssetData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentCourseChoiceReason" (
    "id" UUID NOT NULL,
    "choiceReason" "CourseChoiceReason" NOT NULL,
    "description" VARCHAR(200) NOT NULL,

    CONSTRAINT "studentCourseChoiceReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentCourseChoiceReasonData" (
    "id" UUID NOT NULL,
    "studentIncomingDataId" UUID NOT NULL,
    "studentCourseChoiceReasonId" UUID NOT NULL,

    CONSTRAINT "studentCourseChoiceReasonData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentUniversityChoiceReason" (
    "id" UUID NOT NULL,
    "choiceReason" "UniversityChoiceReason" NOT NULL,
    "description" VARCHAR(200) NOT NULL,

    CONSTRAINT "studentUniversityChoiceReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentUniversityChoiceReasonData" (
    "id" UUID NOT NULL,
    "studentIncomingDataId" UUID NOT NULL,
    "studentUniversityChoiceReasonId" UUID NOT NULL,

    CONSTRAINT "studentUniversityChoiceReasonData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentTechnology" (
    "id" UUID NOT NULL,
    "technology" "Technology" NOT NULL,
    "description" VARCHAR(200) NOT NULL,

    CONSTRAINT "studentTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentStudentTechnologyData" (
    "id" UUID NOT NULL,
    "studentIncomingDataId" UUID NOT NULL,
    "studentTechnologyId" UUID NOT NULL,

    CONSTRAINT "studentStudentTechnologyData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "studentIncomingData_studentId_key" ON "studentIncomingData"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "studentHobbyOrHabit_hobbyOrHabit_key" ON "studentHobbyOrHabit"("hobbyOrHabit");

-- CreateIndex
CREATE UNIQUE INDEX "studentAsset_asset_key" ON "studentAsset"("asset");

-- CreateIndex
CREATE UNIQUE INDEX "studentCourseChoiceReason_choiceReason_key" ON "studentCourseChoiceReason"("choiceReason");

-- CreateIndex
CREATE UNIQUE INDEX "studentUniversityChoiceReason_choiceReason_key" ON "studentUniversityChoiceReason"("choiceReason");

-- CreateIndex
CREATE UNIQUE INDEX "studentTechnology_technology_key" ON "studentTechnology"("technology");

-- AddForeignKey
ALTER TABLE "studentIncomingData" ADD CONSTRAINT "studentIncomingData_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAffinityByDisciplineData" ADD CONSTRAINT "studentAffinityByDisciplineData_studentIncomingDataId_fkey" FOREIGN KEY ("studentIncomingDataId") REFERENCES "studentIncomingData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentHobbyOrHabitData" ADD CONSTRAINT "studentHobbyOrHabitData_studentIncomingDataId_fkey" FOREIGN KEY ("studentIncomingDataId") REFERENCES "studentIncomingData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentHobbyOrHabitData" ADD CONSTRAINT "studentHobbyOrHabitData_studentHobbyOrHabitId_fkey" FOREIGN KEY ("studentHobbyOrHabitId") REFERENCES "studentHobbyOrHabit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAssetData" ADD CONSTRAINT "studentAssetData_studentIncomingDataId_fkey" FOREIGN KEY ("studentIncomingDataId") REFERENCES "studentIncomingData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAssetData" ADD CONSTRAINT "studentAssetData_studentAssetId_fkey" FOREIGN KEY ("studentAssetId") REFERENCES "studentAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentCourseChoiceReasonData" ADD CONSTRAINT "studentCourseChoiceReasonData_studentIncomingDataId_fkey" FOREIGN KEY ("studentIncomingDataId") REFERENCES "studentIncomingData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentCourseChoiceReasonData" ADD CONSTRAINT "studentCourseChoiceReasonData_studentCourseChoiceReasonId_fkey" FOREIGN KEY ("studentCourseChoiceReasonId") REFERENCES "studentCourseChoiceReason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentUniversityChoiceReasonData" ADD CONSTRAINT "studentUniversityChoiceReasonData_studentIncomingDataId_fkey" FOREIGN KEY ("studentIncomingDataId") REFERENCES "studentIncomingData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentUniversityChoiceReasonData" ADD CONSTRAINT "studentUniversityChoiceReasonData_studentUniversityChoiceR_fkey" FOREIGN KEY ("studentUniversityChoiceReasonId") REFERENCES "studentUniversityChoiceReason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentStudentTechnologyData" ADD CONSTRAINT "studentStudentTechnologyData_studentIncomingDataId_fkey" FOREIGN KEY ("studentIncomingDataId") REFERENCES "studentIncomingData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentStudentTechnologyData" ADD CONSTRAINT "studentStudentTechnologyData_studentTechnologyId_fkey" FOREIGN KEY ("studentTechnologyId") REFERENCES "studentTechnology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
