import {
  CourseExtensionActivitiesData as PrismaCourseExtensionActivitiesData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';

export class PrismaCourseExtensionActivitiesDataMapper {
  static toDomain(
    raw: PrismaCourseExtensionActivitiesData,
  ): CourseExtensionActivitiesData {
    return CourseExtensionActivitiesData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        specialProjects: raw.specialProjects,
        participationInCompetitions: raw.participationInCompetitions,
        entrepreneurshipAndInnovation: raw.entrepreneurshipAndInnovation,
        eventOrganization: raw.eventOrganization,
        externalInternship: raw.externalInternship,
        cultureAndExtensionProjects: raw.cultureAndExtensionProjects,
        semiannualProjects: raw.semiannualProjects,
        workNonGovernmentalOrganization: raw.workNonGovernmentalOrganization,
        juniorCompanies: raw.juniorCompanies,
        provisionOfServicesWithSelfEmployedWorkers:
          raw.provisionOfServicesWithSelfEmployedWorkers,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Prisma.CourseExtensionActivitiesDataUncheckedCreateInput {
    return {
      courseId: courseExtensionActivitiesData.courseId,
      year: courseExtensionActivitiesData.year,
      semester: courseExtensionActivitiesData.semester,
      specialProjects: courseExtensionActivitiesData.specialProjects,
      participationInCompetitions:
        courseExtensionActivitiesData.participationInCompetitions,
      entrepreneurshipAndInnovation:
        courseExtensionActivitiesData.entrepreneurshipAndInnovation,
      eventOrganization: courseExtensionActivitiesData.eventOrganization,
      externalInternship: courseExtensionActivitiesData.externalInternship,
      cultureAndExtensionProjects:
        courseExtensionActivitiesData.cultureAndExtensionProjects,
      semiannualProjects: courseExtensionActivitiesData.semiannualProjects,
      workNonGovernmentalOrganization:
        courseExtensionActivitiesData.workNonGovernmentalOrganization,
      juniorCompanies: courseExtensionActivitiesData.juniorCompanies,
      provisionOfServicesWithSelfEmployedWorkers:
        courseExtensionActivitiesData.provisionOfServicesWithSelfEmployedWorkers,
      createdAt: courseExtensionActivitiesData.createdAt,
      updatedAt: courseExtensionActivitiesData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Prisma.CourseExtensionActivitiesDataUncheckedUpdateInput {
    return {
      id: courseExtensionActivitiesData.id.toString(),
      year: courseExtensionActivitiesData.year,
      semester: courseExtensionActivitiesData.semester,
      specialProjects: courseExtensionActivitiesData.specialProjects,
      participationInCompetitions:
        courseExtensionActivitiesData.participationInCompetitions,
      entrepreneurshipAndInnovation:
        courseExtensionActivitiesData.entrepreneurshipAndInnovation,
      eventOrganization: courseExtensionActivitiesData.eventOrganization,
      externalInternship: courseExtensionActivitiesData.externalInternship,
      cultureAndExtensionProjects:
        courseExtensionActivitiesData.cultureAndExtensionProjects,
      semiannualProjects: courseExtensionActivitiesData.semiannualProjects,
      workNonGovernmentalOrganization:
        courseExtensionActivitiesData.workNonGovernmentalOrganization,
      juniorCompanies: courseExtensionActivitiesData.juniorCompanies,
      provisionOfServicesWithSelfEmployedWorkers:
        courseExtensionActivitiesData.provisionOfServicesWithSelfEmployedWorkers,
      createdAt: courseExtensionActivitiesData.createdAt,
      updatedAt: courseExtensionActivitiesData.updatedAt,
    };
  }
}
