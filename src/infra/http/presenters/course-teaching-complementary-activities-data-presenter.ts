import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';

export class CourseTeachingComplementaryActivitiesDataPresenter {
  static toHTTP(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ) {
    return {
      id: courseTeachingComplementaryActivitiesData.id.toString(),
      courseId: courseTeachingComplementaryActivitiesData.courseId,
      year: courseTeachingComplementaryActivitiesData.year,
      semester: courseTeachingComplementaryActivitiesData.semester,
      subjectMonitoring:
        courseTeachingComplementaryActivitiesData.subjectMonitoring,
      sponsorshipOfNewStudents:
        courseTeachingComplementaryActivitiesData.sponsorshipOfNewStudents,
      providingTraining:
        courseTeachingComplementaryActivitiesData.providingTraining,
      coursesInTheArea:
        courseTeachingComplementaryActivitiesData.coursesInTheArea,
      coursesOutsideTheArea:
        courseTeachingComplementaryActivitiesData.coursesOutsideTheArea,
      electivesDisciplines:
        courseTeachingComplementaryActivitiesData.electivesDisciplines,
      complementaryCoursesInTheArea:
        courseTeachingComplementaryActivitiesData.complementaryCoursesInTheArea,
      preparationForTest:
        courseTeachingComplementaryActivitiesData.preparationForTest,
      createdAt: courseTeachingComplementaryActivitiesData.createdAt,
      updatedAt: courseTeachingComplementaryActivitiesData.updatedAt,
    };
  }
}
