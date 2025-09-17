import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';

export type FindAllCourseExtensionActivitiesDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseExtensionActivitiesData = {
  courseExtensionActivitiesData: CourseExtensionActivitiesData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseExtensionActivitiesDataRepository {
  abstract findById(id: string): Promise<CourseExtensionActivitiesData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseExtensionActivitiesData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseExtensionActivitiesDataFilter,
  ): Promise<FindAllCourseExtensionActivitiesData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseExtensionActivitiesData[]>;
  abstract create(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Promise<void>;
  abstract save(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Promise<void>;
  abstract delete(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Promise<void>;
}
