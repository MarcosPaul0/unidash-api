import { Pagination } from '@/core/pagination/pagination';
import { Teacher } from '../../entities/teacher';
import { TeacherCourse, TeacherRole } from '../../entities/teacher-course';

export type FindAllTeachers = {
  teachers: Teacher[];
  totalItems: number;
  totalPages: number;
};

export type FindAllTeachersFilter = {
  name?: string;
  isActive?: boolean;
};

export type FindWithCourses = {
  teacher: Teacher;
  teacherCourse: TeacherCourse[];
};

export abstract class TeachersRepository {
  abstract findById(id: string): Promise<Teacher | null>;
  abstract findByIdWithCourses(id: string): Promise<FindWithCourses | null>;
  abstract create(teacher: Teacher): Promise<void>;
  abstract save(teacher: Teacher): Promise<void>;
  abstract delete(teacher: Teacher): Promise<void>;
  abstract findAll(): Promise<Teacher[]>;
  abstract findAllWithPagination(
    pagination?: Pagination,
    filters?: FindAllTeachersFilter,
  ): Promise<FindAllTeachers>;
}
