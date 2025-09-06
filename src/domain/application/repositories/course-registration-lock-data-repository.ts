import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';

export type FindAllCourseRegistrationLockDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseRegistrationLockData = {
  courseRegistrationLockData: CourseRegistrationLockData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseRegistrationLockDataRepository {
  abstract findById(id: string): Promise<CourseRegistrationLockData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseRegistrationLockData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseRegistrationLockDataFilter,
  ): Promise<FindAllCourseRegistrationLockData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseRegistrationLockData[]>;
  abstract create(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Promise<void>;
  abstract save(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Promise<void>;
  abstract delete(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Promise<void>;
}
