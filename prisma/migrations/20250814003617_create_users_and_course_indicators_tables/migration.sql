-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'teacher', 'student');

-- CreateEnum
CREATE TYPE "TeacherRole" AS ENUM ('internshipManagerTeacher', 'courseManagerTeacher', 'workCompletionManagerTeacher', 'complementaryActivitiesManagerTeacher', 'extensionsActivitiesManagerTeacher', 'normalTeacher');

-- CreateEnum
CREATE TYPE "StudentType" AS ENUM ('incomingStudent', 'outgoingStudent');

-- CreateEnum
CREATE TYPE "UserActionTokenType" AS ENUM ('accountConfirmation', 'passwordReset');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('first', 'second');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "accountActivatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" UUID NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "matriculation" VARCHAR(10) NOT NULL,
    "type" "StudentType" NOT NULL DEFAULT 'incomingStudent',
    "courseId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacherCourse" (
    "id" UUID NOT NULL,
    "teacherRole" "TeacherRole" NOT NULL DEFAULT 'normalTeacher',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,
    "teacherId" UUID NOT NULL,

    CONSTRAINT "teacherCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userActionTokens" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "actionType" "UserActionTokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "userActionTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" UUID NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courseDepartureData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "completed" SMALLINT NOT NULL DEFAULT 0,
    "maximumDuration" SMALLINT NOT NULL DEFAULT 0,
    "dropouts" SMALLINT NOT NULL DEFAULT 0,
    "transfers" SMALLINT NOT NULL DEFAULT 0,
    "withdrawals" SMALLINT NOT NULL DEFAULT 0,
    "removals" SMALLINT NOT NULL DEFAULT 0,
    "newExams" SMALLINT NOT NULL DEFAULT 0,
    "deaths" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseDepartureData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courseRegistrationLockData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "difficultyInDiscipline" SMALLINT NOT NULL DEFAULT 0,
    "workload" SMALLINT NOT NULL DEFAULT 0,
    "teacherMethodology" SMALLINT NOT NULL DEFAULT 0,
    "incompatibilityWithWork" SMALLINT NOT NULL DEFAULT 0,
    "lossOfInterest" SMALLINT NOT NULL DEFAULT 0,
    "other" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseRegistrationLockData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courseStudentsData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "entrants" SMALLINT NOT NULL DEFAULT 0,
    "actives" SMALLINT NOT NULL DEFAULT 0,
    "locks" SMALLINT NOT NULL DEFAULT 0,
    "canceled" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseStudentsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courseCoordinationData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "servicesRequestsBySystem" SMALLINT NOT NULL DEFAULT 0,
    "servicesRequestsByEmail" SMALLINT NOT NULL DEFAULT 0,
    "resolutionActions" SMALLINT NOT NULL DEFAULT 0,
    "administrativeDecisionActions" SMALLINT NOT NULL DEFAULT 0,
    "meetingsByBoardOfDirectors" SMALLINT NOT NULL DEFAULT 0,
    "meetingsByUndergraduateChamber" SMALLINT NOT NULL DEFAULT 0,
    "meetingsByCourseCouncil" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseCoordinationData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_matriculation_key" ON "students"("matriculation");

-- CreateIndex
CREATE UNIQUE INDEX "students_courseId_key" ON "students"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teacherCourse_courseId_teacherId_key" ON "teacherCourse"("courseId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "userActionTokens_token_key" ON "userActionTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "courseDepartureData_year_semester_courseId_key" ON "courseDepartureData"("year", "semester", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "courseRegistrationLockData_year_semester_courseId_key" ON "courseRegistrationLockData"("year", "semester", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "courseStudentsData_year_semester_courseId_key" ON "courseStudentsData"("year", "semester", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "courseCoordinationData_year_semester_courseId_key" ON "courseCoordinationData"("year", "semester", "courseId");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacherCourse" ADD CONSTRAINT "teacherCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacherCourse" ADD CONSTRAINT "teacherCourse_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userActionTokens" ADD CONSTRAINT "userActionTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseDepartureData" ADD CONSTRAINT "courseDepartureData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseRegistrationLockData" ADD CONSTRAINT "courseRegistrationLockData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseStudentsData" ADD CONSTRAINT "courseStudentsData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseCoordinationData" ADD CONSTRAINT "courseCoordinationData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
