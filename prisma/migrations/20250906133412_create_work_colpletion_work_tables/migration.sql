-- CreateTable
CREATE TABLE "courseCompletionWorkData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "enrollments" SMALLINT NOT NULL DEFAULT 0,
    "defenses" SMALLINT NOT NULL DEFAULT 0,
    "abandonments" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseCompletionWorkData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacherSupervisedCompletionWorkData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "approved" SMALLINT NOT NULL DEFAULT 0,
    "failed" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,
    "teacherId" UUID NOT NULL,

    CONSTRAINT "teacherSupervisedCompletionWorkData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "courseCompletionWorkData" ADD CONSTRAINT "courseCompletionWorkData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacherSupervisedCompletionWorkData" ADD CONSTRAINT "teacherSupervisedCompletionWorkData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacherSupervisedCompletionWorkData" ADD CONSTRAINT "teacherSupervisedCompletionWorkData_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
