import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';

export class CourseExtensionComplementaryActivitiesDataPresenter {
  static toHTTP(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ) {
    return {
      id: courseExtensionComplementaryActivitiesData.id.toString(),
      courseId: courseExtensionComplementaryActivitiesData.courseId,
      year: courseExtensionComplementaryActivitiesData.year,
      semester: courseExtensionComplementaryActivitiesData.semester,
      culturalActivities:
        courseExtensionComplementaryActivitiesData.culturalActivities,
      sportsCompetitions:
        courseExtensionComplementaryActivitiesData.sportsCompetitions,
      awardsAtEvents: courseExtensionComplementaryActivitiesData.awardsAtEvents,
      studentRepresentation:
        courseExtensionComplementaryActivitiesData.studentRepresentation,
      participationInCollegiateBodies:
        courseExtensionComplementaryActivitiesData.participationInCollegiateBodies,
      createdAt: courseExtensionComplementaryActivitiesData.createdAt,
      updatedAt: courseExtensionComplementaryActivitiesData.updatedAt,
    };
  }
}
