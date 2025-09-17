import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { FindForIndicatorsFilter } from './course-coordination-data-repository';
import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';

export type FindAllTeacherResearchAndExtensionProjectsDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllTeacherResearchAndExtensionProjectsData = {
  teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData[];
  totalItems: number;
  totalPages: number;
};

export abstract class TeacherResearchAndExtensionProjectsDataRepository {
  abstract findById(
    id: string,
  ): Promise<TeacherResearchAndExtensionProjectsData | null>;
  abstract findByPeriod(
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<TeacherResearchAndExtensionProjectsData | null>;
  abstract findAllForCourse(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherResearchAndExtensionProjectsDataFilter,
  ): Promise<FindAllTeacherResearchAndExtensionProjectsData>;
  abstract findAllForTeacher(
    teacherId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherResearchAndExtensionProjectsDataFilter,
  ): Promise<FindAllTeacherResearchAndExtensionProjectsData>;
  abstract findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<TeacherResearchAndExtensionProjectsData[]>;
  abstract create(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Promise<void>;
  abstract save(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Promise<void>;
  abstract delete(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Promise<void>;
}
