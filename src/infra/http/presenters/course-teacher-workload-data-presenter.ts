import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';

export class CourseTeacherWorkloadDataPresenter {
  static toHTTP(courseTeacherWorkloadData: CourseTeacherWorkloadData) {
    return {
      id: courseTeacherWorkloadData.id.toString(),
      courseId: courseTeacherWorkloadData.courseId,
      teacherName: courseTeacherWorkloadData.teacher?.name,
      teacherId: courseTeacherWorkloadData.teacherId,
      year: courseTeacherWorkloadData.year,
      semester: courseTeacherWorkloadData.semester,
      workloadInMinutes: courseTeacherWorkloadData.workloadInMinutes,
      createdAt: courseTeacherWorkloadData.createdAt,
      updatedAt: courseTeacherWorkloadData.updatedAt,
    };
  }
}
