import { Pagination } from '@/core/pagination/pagination';
import { Student } from '../../entities/student';

export type FindAllStudents = {
  students: Student[];
  totalItems: number;
  totalPages: number;
};

export type FindAllStudentsFilters = {
  courseId?: string;
};

export abstract class StudentsRepository {
  abstract findById(id: string): Promise<Student | null>;
  abstract findByStudentId(studentId: string): Promise<Student | null>;
  abstract findByMatriculation(matriculation: string): Promise<Student | null>;
  abstract findAll(
    pagination?: Pagination,
    filters?: FindAllStudentsFilters,
  ): Promise<FindAllStudents>;
  abstract create(student: Student): Promise<void>;
  abstract save(student: Student): Promise<void>;
  abstract delete(student: Student): Promise<void>;
}
