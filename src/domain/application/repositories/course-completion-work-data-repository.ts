import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';

export type FindAllCourseCompletionWorkDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseCompletionWorkData = {
  courseCompletionWorkData: CourseCompletionWorkData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseCompletionWorkDataRepository {
  abstract findById(id: string): Promise<CourseCompletionWorkData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseCompletionWorkData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseCompletionWorkDataFilter,
  ): Promise<FindAllCourseCompletionWorkData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseCompletionWorkData[]>;
  abstract create(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Promise<void>;
  abstract save(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Promise<void>;
  abstract delete(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Promise<void>;
}
