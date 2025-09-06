import { Pagination } from '@/core/pagination/pagination';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';
import { Semester } from '@/domain/entities/course-data';

export type FindAllCourseCoordinationDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindForIndicatorsFilter = {
  semester?: Semester;
  year?: number;
  yearFrom?: number;
  yearTo?: number;
};

export type FindAllCourseCoordinationData = {
  courseCoordinationData: CourseCoordinationData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseCoordinationDataRepository {
  abstract findById(id: string): Promise<CourseCoordinationData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseCoordinationData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseCoordinationDataFilter,
  ): Promise<FindAllCourseCoordinationData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseCoordinationData[]>;
  abstract create(
    courseCoordinationData: CourseCoordinationData,
  ): Promise<void>;
  abstract save(courseCoordinationData: CourseCoordinationData): Promise<void>;
  abstract delete(
    courseCoordinationData: CourseCoordinationData,
  ): Promise<void>;
}
