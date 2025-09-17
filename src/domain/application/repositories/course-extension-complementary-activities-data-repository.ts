import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';

export type FindAllCourseExtensionComplementaryActivitiesDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseExtensionComplementaryActivitiesData = {
  courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseExtensionComplementaryActivitiesDataRepository {
  abstract findById(
    id: string,
  ): Promise<CourseExtensionComplementaryActivitiesData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseExtensionComplementaryActivitiesData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseExtensionComplementaryActivitiesDataFilter,
  ): Promise<FindAllCourseExtensionComplementaryActivitiesData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseExtensionComplementaryActivitiesData[]>;
  abstract create(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Promise<void>;
  abstract save(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Promise<void>;
  abstract delete(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Promise<void>;
}
