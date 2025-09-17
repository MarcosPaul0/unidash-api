-- CreateTable
CREATE TABLE "courseExtensionActivitiesData" (
    "id" UUID NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" "Semester" NOT NULL DEFAULT 'first',
    "specialProjects" SMALLINT NOT NULL DEFAULT 0,
    "participationInCompetitions" SMALLINT NOT NULL DEFAULT 0,
    "entrepreneurshipAndInnovation" SMALLINT NOT NULL DEFAULT 0,
    "eventOrganization" SMALLINT NOT NULL DEFAULT 0,
    "externalInternship" SMALLINT NOT NULL DEFAULT 0,
    "cultureAndExtensionProjects" SMALLINT NOT NULL DEFAULT 0,
    "semiannualProjects" SMALLINT NOT NULL DEFAULT 0,
    "workNonGovernmentalOrganization" SMALLINT NOT NULL DEFAULT 0,
    "juniorCompanies" SMALLINT NOT NULL DEFAULT 0,
    "provisionOfServicesWithSelfEmployedWorkers" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseExtensionActivitiesData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "courseExtensionActivitiesData" ADD CONSTRAINT "courseExtensionActivitiesData_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
