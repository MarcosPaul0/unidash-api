import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { TeacherSupervisedCompletionWorkData } from '@/domain/entities/teacher-supervised-completion-work-data';

export type FindAllTeacherSupervisedCompletionWorkDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllTeacherSupervisedCompletionWorkData = {
  teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData[];
  totalItems: number;
  totalPages: number;
};

export abstract class TeacherSupervisedCompletionWorkDataRepository {
  abstract findById(
    id: string,
  ): Promise<TeacherSupervisedCompletionWorkData | null>;
  abstract findByCourseTeacherAndPeriod(
    courseId: string,
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<TeacherSupervisedCompletionWorkData | null>;
  abstract findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherSupervisedCompletionWorkDataFilter,
  ): Promise<FindAllTeacherSupervisedCompletionWorkData>;
  abstract findAllForTeacher(
    teacherId: string,
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherSupervisedCompletionWorkDataFilter,
  ): Promise<FindAllTeacherSupervisedCompletionWorkData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<TeacherSupervisedCompletionWorkData[]>;
  abstract create(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Promise<void>;
  abstract save(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Promise<void>;
  abstract delete(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Promise<void>;
}
