-- CreateTable
CREATE TABLE "courseTeacherWorkloadData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "workloadInMinutes" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "teacherId" UUID NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseTeacherWorkloadData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "courseTeacherWorkloadData" ADD CONSTRAINT "courseTeacherWorkloadData_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseTeacherWorkloadData" ADD CONSTRAINT "courseTeacherWorkloadData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
