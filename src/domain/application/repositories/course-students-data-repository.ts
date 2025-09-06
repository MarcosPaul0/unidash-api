import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { CourseStudentsData } from '@/domain/entities/course-students-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';

export type FindAllCourseStudentsDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseStudentsData = {
  courseStudentsData: CourseStudentsData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseStudentsDataRepository {
  abstract findById(id: string): Promise<CourseStudentsData | null>;
  abstract findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseStudentsData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseStudentsDataFilter,
  ): Promise<FindAllCourseStudentsData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseStudentsData[]>;
  abstract create(courseStudentsData: CourseStudentsData): Promise<void>;
  abstract save(courseStudentsData: CourseStudentsData): Promise<void>;
  abstract delete(courseStudentsData: CourseStudentsData): Promise<void>;
}
