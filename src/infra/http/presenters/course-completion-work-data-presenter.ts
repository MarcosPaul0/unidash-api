import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';

export class CourseCompletionWorkDataPresenter {
  static toHTTP(courseCompletionWorkData: CourseCompletionWorkData) {
    return {
      id: courseCompletionWorkData.id.toString(),
      courseId: courseCompletionWorkData.courseId,
      year: courseCompletionWorkData.year,
      semester: courseCompletionWorkData.semester,
      abandonments: courseCompletionWorkData.abandonments,
      defenses: courseCompletionWorkData.defenses,
      enrollments: courseCompletionWorkData.enrollments,
      createdAt: courseCompletionWorkData.createdAt,
      updatedAt: courseCompletionWorkData.updatedAt,
    };
  }
}
