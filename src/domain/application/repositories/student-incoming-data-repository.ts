import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { StudentIncomingData } from '@/domain/entities/student-incoming-data';

export type FindAllStudentIncomingDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllStudentIncomingData = {
  studentIncomingData: StudentIncomingData[];
  totalItems: number;
  totalPages: number;
};

export abstract class StudentIncomingDataRepository {
  abstract findById(id: string): Promise<StudentIncomingData | null>;
  abstract findByStudentId(
    studentId: string,
  ): Promise<StudentIncomingData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllStudentIncomingDataFilter,
  ): Promise<FindAllStudentIncomingData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<StudentIncomingData[]>;
  abstract create(
    studentIncomingData: StudentIncomingData,
  ): Promise<StudentIncomingData>;
  abstract delete(studentIncomingData: StudentIncomingData): Promise<void>;
}
