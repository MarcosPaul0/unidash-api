import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';
import { TeacherSupervisedCompletionWorkData } from '@/domain/entities/teacher-supervised-completion-work-data';

interface CourseCompletionWorkIndicatorsParams {
  courseCompletionWorkData: CourseCompletionWorkData[];
  teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData[];
}

export class CourseCompletionWorkIndicatorsPresenter {
  static toHTTP({
    courseCompletionWorkData,
    teacherSupervisedCompletionWorkData,
  }: CourseCompletionWorkIndicatorsParams) {
    const worksStatus = {};

    courseCompletionWorkData.forEach((data) => {
      const yearData = worksStatus[data.year];

      if (yearData) {
        worksStatus[data.year] = [
          ...worksStatus[data.year],
          {
            semester: data.semester,
            enrollments: data.enrollments,
            defenses: data.defenses,
            abandonments: data.abandonments,
          },
        ];
      } else {
        worksStatus[data.year] = [
          {
            semester: data.semester,
            enrollments: data.enrollments,
            defenses: data.defenses,
            abandonments: data.abandonments,
          },
        ];
      }
    });

    const orientationsByTeacher = {};

    teacherSupervisedCompletionWorkData.forEach((data) => {
      const yearData = orientationsByTeacher[data.year];

      if (yearData) {
        const teacherOrientationsInYear = yearData.findIndex(
          (teacherOrientations) =>
            teacherOrientations.teacher === data.teacher?.name,
        );

        if (teacherOrientationsInYear !== -1) {
          const accumulatedTeacherOrientationsInYear = {
            approved:
              yearData[teacherOrientationsInYear].approved + data.approved,
            failed: yearData[teacherOrientationsInYear].failed + data.failed,
            teacher: data.teacher?.name,
          };

          orientationsByTeacher[data.year][teacherOrientationsInYear] =
            accumulatedTeacherOrientationsInYear;
        } else {
          orientationsByTeacher[data.year] = [
            ...yearData,
            {
              approved: data.approved,
              failed: data.failed,
              teacher: data.teacher?.name,
            },
          ];
        }
      } else {
        orientationsByTeacher[data.year] = [
          {
            approved: data.approved,
            failed: data.failed,
            teacher: data.teacher?.name,
          },
        ];
      }
    });

    return {
      worksStatus,
      orientationsByTeacher,
    };
  }
}
