import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { TeacherTechnicalScientificProductionsData } from '@/domain/entities/teacher-technical-scientific-productions-data';

export type FindAllTeacherTechnicalScientificProductionsDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllTeacherTechnicalScientificProductionsData = {
  teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData[];
  totalItems: number;
  totalPages: number;
};

export abstract class TeacherTechnicalScientificProductionsDataRepository {
  abstract findById(
    id: string,
  ): Promise<TeacherTechnicalScientificProductionsData | null>;
  abstract findByPeriod(
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<TeacherTechnicalScientificProductionsData | null>;
  abstract findAllForCourse(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherTechnicalScientificProductionsDataFilter,
  ): Promise<FindAllTeacherTechnicalScientificProductionsData>;
  abstract findAllForTeacher(
    teacherId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherTechnicalScientificProductionsDataFilter,
  ): Promise<FindAllTeacherTechnicalScientificProductionsData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<TeacherTechnicalScientificProductionsData[]>;
  abstract create(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Promise<void>;
  abstract save(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Promise<void>;
  abstract delete(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Promise<void>;
}
