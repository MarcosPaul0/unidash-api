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
      workloadInHours: courseTeacherWorkloadData.workloadInHours,
      createdAt: courseTeacherWorkloadData.createdAt,
      updatedAt: courseTeacherWorkloadData.updatedAt,
    };
  }
}
