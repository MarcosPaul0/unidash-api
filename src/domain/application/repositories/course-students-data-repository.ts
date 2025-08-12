import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { CourseStudentsData } from '@/domain/entities/course-students-data';

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
    pagination?: Pagination,
    filters?: FindAllCourseStudentsDataFilter,
  ): Promise<FindAllCourseStudentsData>;
  abstract create(courseStudentsData: CourseStudentsData): Promise<void>;
  abstract save(courseStudentsData: CourseStudentsData): Promise<void>;
  abstract delete(courseStudentsData: CourseStudentsData): Promise<void>;
}
