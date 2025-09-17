import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';

export class CourseExtensionActivitiesDataPresenter {
  static toHTTP(courseExtensionActivitiesData: CourseExtensionActivitiesData) {
    return {
      id: courseExtensionActivitiesData.id.toString(),
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
}
