import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { CourseInternshipData } from '@/domain/entities/course-internship-data';

export type FindAllCourseInternshipDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseInternshipData = {
  courseInternshipData: CourseInternshipData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseInternshipDataRepository {
  abstract findById(id: string): Promise<CourseInternshipData | null>;
  abstract findByMatriculation(
    matriculation: string,
  ): Promise<CourseInternshipData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseInternshipDataFilter,
  ): Promise<FindAllCourseInternshipData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseInternshipData[]>;
  abstract create(courseInternshipData: CourseInternshipData): Promise<void>;
  abstract save(courseInternshipData: CourseInternshipData): Promise<void>;
  abstract delete(courseInternshipData: CourseInternshipData): Promise<void>;
}
