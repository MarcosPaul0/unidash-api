import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';

export class CourseRegistrationLockDataPresenter {
  static toHTTP(courseRegistrationLockData: CourseRegistrationLockData) {
    return {
      id: courseRegistrationLockData.id.toString(),
      courseId: courseRegistrationLockData.courseId,
      year: courseRegistrationLockData.year,
      semester: courseRegistrationLockData.semester,
      difficultyInDiscipline: courseRegistrationLockData.difficultyInDiscipline,
      workload: courseRegistrationLockData.workload,
      teacherMethodology: courseRegistrationLockData.teacherMethodology,
      incompatibilityWithWork:
        courseRegistrationLockData.incompatibilityWithWork,
      lossOfInterest: courseRegistrationLockData.lossOfInterest,
      other: courseRegistrationLockData.other,
      createdAt: courseRegistrationLockData.createdAt,
      updatedAt: courseRegistrationLockData.updatedAt,
    };
  }
}
