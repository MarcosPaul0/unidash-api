-- CreateTable
CREATE TABLE "teacherTechnicalScientificProductionsData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "periodicals" SMALLINT NOT NULL DEFAULT 0,
    "congress" SMALLINT NOT NULL DEFAULT 0,
    "booksChapter" SMALLINT NOT NULL DEFAULT 0,
    "programs" SMALLINT NOT NULL DEFAULT 0,
    "abstracts" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,
    "teacherId" UUID NOT NULL,

    CONSTRAINT "teacherTechnicalScientificProductionsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacherResearchAndExtensionProjectsData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "extensionProjects" SMALLINT NOT NULL DEFAULT 0,
    "researchProjects" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,
    "teacherId" UUID NOT NULL,

    CONSTRAINT "teacherResearchAndExtensionProjectsData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "teacherTechnicalScientificProductionsData" ADD CONSTRAINT "teacherTechnicalScientificProductionsData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacherTechnicalScientificProductionsData" ADD CONSTRAINT "teacherTechnicalScientificProductionsData_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacherResearchAndExtensionProjectsData" ADD CONSTRAINT "teacherResearchAndExtensionProjectsData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacherResearchAndExtensionProjectsData" ADD CONSTRAINT "teacherResearchAndExtensionProjectsData_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
