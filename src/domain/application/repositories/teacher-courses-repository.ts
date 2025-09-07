import { Pagination } from '@/core/pagination/pagination';
import { TeacherCourse } from '../../entities/teacher-course';

export type FindAllByCourseId = {
  teacherCourses: TeacherCourse[];
  totalItems: number;
  totalPages: number;
};

export abstract class TeacherCoursesRepository {
  abstract findById(id: string): Promise<TeacherCourse | null>;
  abstract findByTeacherAndCourseId(
    teacherId: string,
    courseId: string,
  ): Promise<TeacherCourse | null>;
  abstract findByUserAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<TeacherCourse | null>;
  abstract findAllByCourseId(
    courseId: string,
    pagination?: Pagination,
  ): Promise<FindAllByCourseId>;
  abstract findAllByTeacherId(teacherId: string): Promise<TeacherCourse[]>;
  abstract create(teacherCourse: TeacherCourse): Promise<void>;
  abstract save(teacherCourse: TeacherCourse): Promise<void>;
  abstract delete(teacherCourse: TeacherCourse): Promise<void>;
}
