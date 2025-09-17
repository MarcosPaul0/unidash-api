import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';

export type FindAllCourseSearchComplementaryActivitiesDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseSearchComplementaryActivitiesData = {
  courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseSearchComplementaryActivitiesDataRepository {
  abstract findById(
    id: string,
  ): Promise<CourseSearchComplementaryActivitiesData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseSearchComplementaryActivitiesData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseSearchComplementaryActivitiesDataFilter,
  ): Promise<FindAllCourseSearchComplementaryActivitiesData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseSearchComplementaryActivitiesData[]>;
  abstract create(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Promise<void>;
  abstract save(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Promise<void>;
  abstract delete(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Promise<void>;
}
