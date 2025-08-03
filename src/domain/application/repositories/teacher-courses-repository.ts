import { TeacherCourse } from '../../entities/teacher-course';

export abstract class TeacherCoursesRepository {
  abstract findByTeacherAndCourseId(
    teacherId: string,
    courseId: string,
  ): Promise<TeacherCourse | null>;
  abstract findByUserAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<TeacherCourse | null>;
  abstract create(teacherCourse: TeacherCourse): Promise<void>;
  abstract save(teacherCourse: TeacherCourse): Promise<void>;
  abstract delete(teacherCourse: TeacherCourse): Promise<void>;
}
