import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';

export type FindAllCourseTeacherWorkloadDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllCourseTeacherWorkloadData = {
  courseTeacherWorkloadData: CourseTeacherWorkloadData[];
  totalItems: number;
  totalPages: number;
};

export abstract class CourseTeacherWorkloadDataRepository {
  abstract findById(id: string): Promise<CourseTeacherWorkloadData | null>;
  abstract findByPeriod(
    courseId: string,
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseTeacherWorkloadData | null>;
  abstract findAllForCourse(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseTeacherWorkloadDataFilter,
  ): Promise<FindAllCourseTeacherWorkloadData>;
  abstract findAllForTeacher(
    teacherId: string,
    pagination?: Pagination,
    filters?: FindAllCourseTeacherWorkloadDataFilter,
  ): Promise<FindAllCourseTeacherWorkloadData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseTeacherWorkloadData[]>;
  abstract create(
    courseTeacherWorkloadData: CourseTeacherWorkloadData,
  ): Promise<void>;
  abstract save(
    courseTeacherWorkloadData: CourseTeacherWorkloadData,
  ): Promise<void>;
  abstract delete(
    courseTeacherWorkloadData: CourseTeacherWorkloadData,
  ): Promise<void>;
}
