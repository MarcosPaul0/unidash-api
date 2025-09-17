import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  FindAllTeacherResearchAndExtensionProjectsData,
  FindAllTeacherResearchAndExtensionProjectsDataFilter,
  TeacherResearchAndExtensionProjectsDataRepository,
} from '@/domain/application/repositories/teacher-research-and-extension-projects-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';

export class InMemoryTeacherResearchAndExtensionProjectsDataRepository
  implements TeacherResearchAndExtensionProjectsDataRepository
{
  public teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData[] =
    [];

  async findById(
    id: string,
  ): Promise<TeacherResearchAndExtensionProjectsData | null> {
    const TeacherResearchAndExtensionProjectsData =
      this.teacherResearchAndExtensionProjectsData.find(
        (item) => item.id.toString() === id,
      );

    if (!TeacherResearchAndExtensionProjectsData) {
      return null;
    }

    return TeacherResearchAndExtensionProjectsData;
  }

  async findByPeriod(
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<TeacherResearchAndExtensionProjectsData | null> {
    const TeacherResearchAndExtensionProjectsData =
      this.teacherResearchAndExtensionProjectsData.find(
        (item) =>
          item.teacherId === teacherId &&
          item.year === year &&
          item.semester === semester,
      );

    if (!TeacherResearchAndExtensionProjectsData) {
      return null;
    }

    return TeacherResearchAndExtensionProjectsData;
  }

  async findAllForCourse(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllTeacherResearchAndExtensionProjectsDataFilter,
  ): Promise<FindAllTeacherResearchAndExtensionProjectsData> {
    const filteredTeacherResearchAndExtensionProjectsData =
      this.teacherResearchAndExtensionProjectsData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true),
        // TODO implementar busca pelo curso
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const teacherResearchAndExtensionProjectsData =
      filteredTeacherResearchAndExtensionProjectsData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems = filteredTeacherResearchAndExtensionProjectsData.length;
    const totalPages = Math.ceil(
      filteredTeacherResearchAndExtensionProjectsData.length / itemsPerPage,
    );

    return {
      teacherResearchAndExtensionProjectsData,
      totalItems,
      totalPages,
    };
  }

  async findAllForTeacher(
    teacherId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllTeacherResearchAndExtensionProjectsDataFilter,
  ): Promise<FindAllTeacherResearchAndExtensionProjectsData> {
    const filteredTeacherResearchAndExtensionProjectsData =
      this.teacherResearchAndExtensionProjectsData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true) &&
          departureData.teacherId === teacherId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const teacherResearchAndExtensionProjectsData =
      filteredTeacherResearchAndExtensionProjectsData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems = filteredTeacherResearchAndExtensionProjectsData.length;
    const totalPages = Math.ceil(
      filteredTeacherResearchAndExtensionProjectsData.length / itemsPerPage,
    );

    return {
      teacherResearchAndExtensionProjectsData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<TeacherResearchAndExtensionProjectsData[]> {
    const filteredTeacherResearchAndExtensionProjectsData =
      this.teacherResearchAndExtensionProjectsData.filter(
        (coordinationData) =>
          (filters?.semester
            ? coordinationData.semester === filters.semester
            : true) &&
          (filters?.year ? coordinationData.year === filters.year : true) &&
          (filters?.yearFrom
            ? coordinationData.year > filters.yearFrom
            : true) &&
          (filters?.yearTo ? coordinationData.year < filters.yearTo : true),
        // TODO implementar busca pelo curso
      );

    return filteredTeacherResearchAndExtensionProjectsData;
  }

  async save(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Promise<void> {
    const itemIndex = this.teacherResearchAndExtensionProjectsData.findIndex(
      (item) => item.id === teacherResearchAndExtensionProjectsData.id,
    );

    this.teacherResearchAndExtensionProjectsData[itemIndex] =
      teacherResearchAndExtensionProjectsData;
  }

  async create(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ) {
    this.teacherResearchAndExtensionProjectsData.push(
      teacherResearchAndExtensionProjectsData,
    );
  }

  async delete(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Promise<void> {
    const itemIndex = this.teacherResearchAndExtensionProjectsData.findIndex(
      (item) => item.id === teacherResearchAndExtensionProjectsData.id,
    );

    this.teacherResearchAndExtensionProjectsData.splice(itemIndex, 1);
  }
}
