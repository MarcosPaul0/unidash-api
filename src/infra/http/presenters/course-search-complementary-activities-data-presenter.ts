import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';

export class CourseSearchComplementaryActivitiesDataPresenter {
  static toHTTP(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ) {
    return {
      id: courseSearchComplementaryActivitiesData.id.toString(),
      courseId: courseSearchComplementaryActivitiesData.courseId,
      year: courseSearchComplementaryActivitiesData.year,
      semester: courseSearchComplementaryActivitiesData.semester,
      scientificInitiation:
        courseSearchComplementaryActivitiesData.scientificInitiation,
      developmentInitiation:
        courseSearchComplementaryActivitiesData.developmentInitiation,
      publishedArticles:
        courseSearchComplementaryActivitiesData.publishedArticles,
      fullPublishedArticles:
        courseSearchComplementaryActivitiesData.fullPublishedArticles,
      publishedAbstracts:
        courseSearchComplementaryActivitiesData.publishedAbstracts,
      presentationOfWork:
        courseSearchComplementaryActivitiesData.presentationOfWork,
      participationInEvents:
        courseSearchComplementaryActivitiesData.participationInEvents,
      createdAt: courseSearchComplementaryActivitiesData.createdAt,
      updatedAt: courseSearchComplementaryActivitiesData.updatedAt,
    };
  }
}
