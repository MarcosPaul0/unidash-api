import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';

export type FindAllCourseActiveStudentsDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseActiveStudentsData = {
  courseActiveStudentsData: CourseActiveStudentsData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseActiveStudentsDataRepository {
  abstract findById(id: string): Promise<CourseActiveStudentsData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseActiveStudentsData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseActiveStudentsDataFilter,
  ): Promise<FindAllCourseActiveStudentsData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseActiveStudentsData[]>;
  abstract create(
    courseActiveStudentsData: CourseActiveStudentsData,
  ): Promise<void>;
  abstract save(
    courseActiveStudentsData: CourseActiveStudentsData,
  ): Promise<void>;
  abstract delete(
    courseActiveStudentsData: CourseActiveStudentsData,
  ): Promise<void>;
}
