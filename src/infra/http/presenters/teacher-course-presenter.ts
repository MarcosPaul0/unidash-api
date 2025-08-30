import { TeacherCourse } from '@/domain/entities/teacher-course';

export class TeacherCoursePresenter {
  static toHTTP(teacherCourse: TeacherCourse) {
    return {
      id: teacherCourse.id.toString(),
      name: teacherCourse.teacher.name,
      email: teacherCourse.teacher.email,
      role: teacherCourse.teacher.role,
      isActive: teacherCourse.teacher.isActive,
      teacherId: teacherCourse.teacher.id.toString(),
      accountActivatedAt: teacherCourse.teacher.accountActivatedAt,
      teacherRole: teacherCourse.teacherRole,
      courseId: teacherCourse.courseId,
      createdAt: teacherCourse.createdAt,
      updatedAt: teacherCourse.updatedAt,
    };
  }
}
