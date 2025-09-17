import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  FindAllTeacherTechnicalScientificProductionsData,
  FindAllTeacherTechnicalScientificProductionsDataFilter,
  TeacherTechnicalScientificProductionsDataRepository,
} from '@/domain/application/repositories/teacher-technical-scientific-productions-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { TeacherTechnicalScientificProductionsData } from '@/domain/entities/teacher-technical-scientific-productions-data';

export class InMemoryTeacherTechnicalScientificProductionsDataRepository
  implements TeacherTechnicalScientificProductionsDataRepository
{
  public teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData[] =
    [];

  async findById(
    id: string,
  ): Promise<TeacherTechnicalScientificProductionsData | null> {
    const TeacherTechnicalScientificProductionsData =
      this.teacherTechnicalScientificProductionsData.find(
        (item) => item.id.toString() === id,
      );

    if (!TeacherTechnicalScientificProductionsData) {
      return null;
    }

    return TeacherTechnicalScientificProductionsData;
  }

  async findByPeriod(
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<TeacherTechnicalScientificProductionsData | null> {
    const TeacherTechnicalScientificProductionsData =
      this.teacherTechnicalScientificProductionsData.find(
        (item) =>
          item.teacherId === teacherId &&
          item.year === year &&
          item.semester === semester,
      );

    if (!TeacherTechnicalScientificProductionsData) {
      return null;
    }

    return TeacherTechnicalScientificProductionsData;
  }

  async findAllForCourse(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllTeacherTechnicalScientificProductionsDataFilter,
  ): Promise<FindAllTeacherTechnicalScientificProductionsData> {
    const filteredTeacherTechnicalScientificProductionsData =
      this.teacherTechnicalScientificProductionsData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true),
        // TODO implementar busca pelo curso
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const teacherTechnicalScientificProductionsData =
      filteredTeacherTechnicalScientificProductionsData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems = filteredTeacherTechnicalScientificProductionsData.length;
    const totalPages = Math.ceil(
      filteredTeacherTechnicalScientificProductionsData.length / itemsPerPage,
    );

    return {
      teacherTechnicalScientificProductionsData,
      totalItems,
      totalPages,
    };
  }

  async findAllForTeacher(
    teacherId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllTeacherTechnicalScientificProductionsDataFilter,
  ): Promise<FindAllTeacherTechnicalScientificProductionsData> {
    const filteredTeacherTechnicalScientificProductionsData =
      this.teacherTechnicalScientificProductionsData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true) &&
          departureData.teacherId === teacherId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const teacherTechnicalScientificProductionsData =
      filteredTeacherTechnicalScientificProductionsData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems = filteredTeacherTechnicalScientificProductionsData.length;
    const totalPages = Math.ceil(
      filteredTeacherTechnicalScientificProductionsData.length / itemsPerPage,
    );

    return {
      teacherTechnicalScientificProductionsData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<TeacherTechnicalScientificProductionsData[]> {
    const filteredTeacherTechnicalScientificProductionsData =
      this.teacherTechnicalScientificProductionsData.filter(
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

    return filteredTeacherTechnicalScientificProductionsData;
  }

  async save(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Promise<void> {
    const itemIndex = this.teacherTechnicalScientificProductionsData.findIndex(
      (item) => item.id === teacherTechnicalScientificProductionsData.id,
    );

    this.teacherTechnicalScientificProductionsData[itemIndex] =
      teacherTechnicalScientificProductionsData;
  }

  async create(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ) {
    this.teacherTechnicalScientificProductionsData.push(
      teacherTechnicalScientificProductionsData,
    );
  }

  async delete(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Promise<void> {
    const itemIndex = this.teacherTechnicalScientificProductionsData.findIndex(
      (item) => item.id === teacherTechnicalScientificProductionsData.id,
    );

    this.teacherTechnicalScientificProductionsData.splice(itemIndex, 1);
  }
}
