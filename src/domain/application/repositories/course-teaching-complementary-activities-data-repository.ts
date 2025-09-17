import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';

export type FindAllCourseTeachingComplementaryActivitiesDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseTeachingComplementaryActivitiesData = {
  courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseTeachingComplementaryActivitiesDataRepository {
  abstract findById(
    id: string,
  ): Promise<CourseTeachingComplementaryActivitiesData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseTeachingComplementaryActivitiesData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseTeachingComplementaryActivitiesDataFilter,
  ): Promise<FindAllCourseTeachingComplementaryActivitiesData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseTeachingComplementaryActivitiesData[]>;
  abstract create(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Promise<void>;
  abstract save(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Promise<void>;
  abstract delete(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Promise<void>;
}
