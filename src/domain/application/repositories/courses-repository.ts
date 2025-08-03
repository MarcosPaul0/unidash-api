import { Course } from '../../entities/course';
import { TeacherCourse } from '../../entities/teacher-course';

export type FindWithTeachers = {
  course: Course;
  teacherCourse: TeacherCourse[];
};

export abstract class CoursesRepository {
  abstract findByName(name: string): Promise<Course | null>;
  abstract findById(id: string): Promise<Course | null>;
  abstract findByIdWithTeachers(id: string): Promise<FindWithTeachers | null>;
  abstract create(course: Course): Promise<void>;
  abstract save(course: Course): Promise<void>;
  abstract delete(course: Course): Promise<void>;
}
