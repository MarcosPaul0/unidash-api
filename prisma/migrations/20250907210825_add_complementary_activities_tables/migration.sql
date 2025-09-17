-- CreateTable
CREATE TABLE "courseTeachingComplementaryActivitiesData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "subjectMonitoring" SMALLINT NOT NULL DEFAULT 0,
    "sponsorshipOfNewStudents" SMALLINT NOT NULL DEFAULT 0,
    "providingTraining" SMALLINT NOT NULL DEFAULT 0,
    "coursesInTheArea" SMALLINT NOT NULL DEFAULT 0,
    "coursesOutsideTheArea" SMALLINT NOT NULL DEFAULT 0,
    "electivesDisciplines" SMALLINT NOT NULL DEFAULT 0,
    "complementaryCoursesInTheArea" SMALLINT NOT NULL DEFAULT 0,
    "preparationForTest" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseTeachingComplementaryActivitiesData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courseSearchComplementaryActivitiesData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "scientificInitiation" SMALLINT NOT NULL DEFAULT 0,
    "developmentInitiation" SMALLINT NOT NULL DEFAULT 0,
    "publishedArticles" SMALLINT NOT NULL DEFAULT 0,
    "fullPublishedArticles" SMALLINT NOT NULL DEFAULT 0,
    "publishedAbstracts" SMALLINT NOT NULL DEFAULT 0,
    "presentationOfWork" SMALLINT NOT NULL DEFAULT 0,
    "participationInEvents" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseSearchComplementaryActivitiesData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courseExtensionComplementaryActivitiesData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "culturalActivities" SMALLINT NOT NULL DEFAULT 0,
    "sportsCompetitions" SMALLINT NOT NULL DEFAULT 0,
    "awardsAtEvents" SMALLINT NOT NULL DEFAULT 0,
    "studentRepresentation" SMALLINT NOT NULL DEFAULT 0,
    "participationInCollegiateBodies" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseExtensionComplementaryActivitiesData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "courseTeachingComplementaryActivitiesData" ADD CONSTRAINT "courseTeachingComplementaryActivitiesData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseSearchComplementaryActivitiesData" ADD CONSTRAINT "courseSearchComplementaryActivitiesData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseExtensionComplementaryActivitiesData" ADD CONSTRAINT "courseExtensionComplementaryActivitiesData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
