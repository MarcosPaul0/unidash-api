import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  FindAllTeacherSupervisedCompletionWorkData,
  FindAllTeacherSupervisedCompletionWorkDataFilter,
  TeacherSupervisedCompletionWorkDataRepository,
} from '@/domain/application/repositories/teacher-supervised-completion-work-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { TeacherSupervisedCompletionWorkData } from '@/domain/entities/teacher-supervised-completion-work-data';

export class InMemoryTeacherSupervisedCompletionWorkDataRepository
  implements TeacherSupervisedCompletionWorkDataRepository
{
  public teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData[] =
    [];

  async findById(
    id: string,
  ): Promise<TeacherSupervisedCompletionWorkData | null> {
    const TeacherSupervisedCompletionWorkData =
      this.teacherSupervisedCompletionWorkData.find(
        (item) => item.id.toString() === id,
      );

    if (!TeacherSupervisedCompletionWorkData) {
      return null;
    }

    return TeacherSupervisedCompletionWorkData;
  }

  async findByCourseTeacherAndPeriod(
    courseId: string,
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<TeacherSupervisedCompletionWorkData | null> {
    const TeacherSupervisedCompletionWorkData =
      this.teacherSupervisedCompletionWorkData.find(
        (item) =>
          item.courseId === courseId &&
          item.teacherId === teacherId &&
          item.year === year &&
          item.semester === semester,
      );

    if (!TeacherSupervisedCompletionWorkData) {
      return null;
    }

    return TeacherSupervisedCompletionWorkData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllTeacherSupervisedCompletionWorkDataFilter,
  ): Promise<FindAllTeacherSupervisedCompletionWorkData> {
    const filteredTeacherSupervisedCompletionWorkData =
      this.teacherSupervisedCompletionWorkData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true) &&
          departureData.courseId === courseId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const teacherSupervisedCompletionWorkData =
      filteredTeacherSupervisedCompletionWorkData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems = filteredTeacherSupervisedCompletionWorkData.length;
    const totalPages = Math.ceil(
      filteredTeacherSupervisedCompletionWorkData.length / itemsPerPage,
    );

    return {
      teacherSupervisedCompletionWorkData,
      totalItems,
      totalPages,
    };
  }

  async findAllForTeacher(
    teacherId: string,
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllTeacherSupervisedCompletionWorkDataFilter,
  ): Promise<FindAllTeacherSupervisedCompletionWorkData> {
    const filteredTeacherSupervisedCompletionWorkData =
      this.teacherSupervisedCompletionWorkData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true) &&
          departureData.courseId === courseId &&
          departureData.teacherId === teacherId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const teacherSupervisedCompletionWorkData =
      filteredTeacherSupervisedCompletionWorkData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems = filteredTeacherSupervisedCompletionWorkData.length;
    const totalPages = Math.ceil(
      filteredTeacherSupervisedCompletionWorkData.length / itemsPerPage,
    );

    return {
      teacherSupervisedCompletionWorkData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<TeacherSupervisedCompletionWorkData[]> {
    const filteredTeacherSupervisedCompletionWorkData =
      this.teacherSupervisedCompletionWorkData.filter(
        (coordinationData) =>
          (filters?.semester
            ? coordinationData.semester === filters.semester
            : true) &&
          (filters?.year ? coordinationData.year === filters.year : true) &&
          (filters?.yearFrom
            ? coordinationData.year > filters.yearFrom
            : true) &&
          (filters?.yearTo ? coordinationData.year < filters.yearTo : true) &&
          coordinationData.courseId === courseId,
      );

    return filteredTeacherSupervisedCompletionWorkData;
  }

  async save(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Promise<void> {
    const itemIndex = this.teacherSupervisedCompletionWorkData.findIndex(
      (item) => item.id === teacherSupervisedCompletionWorkData.id,
    );

    this.teacherSupervisedCompletionWorkData[itemIndex] =
      teacherSupervisedCompletionWorkData;
  }

  async create(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ) {
    this.teacherSupervisedCompletionWorkData.push(
      teacherSupervisedCompletionWorkData,
    );
  }

  async delete(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Promise<void> {
    const itemIndex = this.teacherSupervisedCompletionWorkData.findIndex(
      (item) => item.id === teacherSupervisedCompletionWorkData.id,
    );

    this.teacherSupervisedCompletionWorkData.splice(itemIndex, 1);
  }
}
