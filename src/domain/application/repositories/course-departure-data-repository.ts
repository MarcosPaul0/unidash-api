import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';

export type FindAllCourseDepartureDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseDepartureData = {
  courseDepartureData: CourseDepartureData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseDepartureDataRepository {
  abstract findById(id: string): Promise<CourseDepartureData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseDepartureData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseDepartureDataFilter,
  ): Promise<FindAllCourseDepartureData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseDepartureData[]>;
  abstract create(courseDepartureData: CourseDepartureData): Promise<void>;
  abstract save(courseDepartureData: CourseDepartureData): Promise<void>;
  abstract delete(courseDepartureData: CourseDepartureData): Promise<void>;
}
