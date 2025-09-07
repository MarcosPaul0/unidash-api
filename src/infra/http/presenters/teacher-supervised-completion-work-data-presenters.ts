import { TeacherSupervisedCompletionWorkData } from '@/domain/entities/teacher-supervised-completion-work-data';

export class TeacherSupervisedCompletionWorkDataPresenter {
  static toHTTP(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ) {
    console.log({ teacherData: teacherSupervisedCompletionWorkData?.teacher });

    const teacherData = Boolean(teacherSupervisedCompletionWorkData?.teacher)
      ? {
          teacherName: teacherSupervisedCompletionWorkData.teacher!.name,
          teacherEmail:
            teacherSupervisedCompletionWorkData.teacher!.email ?? null,
        }
      : {};

    return {
      id: teacherSupervisedCompletionWorkData.id.toString(),
      courseId: teacherSupervisedCompletionWorkData.courseId,
      teacherId: teacherSupervisedCompletionWorkData.teacherId,
      year: teacherSupervisedCompletionWorkData.year,
      semester: teacherSupervisedCompletionWorkData.semester,
      approved: teacherSupervisedCompletionWorkData.approved,
      failed: teacherSupervisedCompletionWorkData.failed,
      createdAt: teacherSupervisedCompletionWorkData.createdAt,
      updatedAt: teacherSupervisedCompletionWorkData.updatedAt,
      ...teacherData,
    };
  }
}
