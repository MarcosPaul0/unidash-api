import { Pagination } from '@/core/pagination/pagination';
import {
  CourseCompletionWorkDataRepository,
  FindAllCourseCompletionWorkData,
  FindAllCourseCompletionWorkDataFilter,
} from '@/domain/application/repositories/course-completion-work-data-repository';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';
import { Semester } from '@/domain/entities/course-data';

export class InMemoryCourseCompletionWorkDataRepository
  implements CourseCompletionWorkDataRepository
{
  public courseCompletionWorkData: CourseCompletionWorkData[] = [];

  async findById(id: string): Promise<CourseCompletionWorkData | null> {
    const courseCompletionWorkData = this.courseCompletionWorkData.find(
      (item) => item.id.toString() === id,
    );

    if (!courseCompletionWorkData) {
      return null;
    }

    return courseCompletionWorkData;
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseCompletionWorkData | null> {
    const courseCompletionWorkData = this.courseCompletionWorkData.find(
      (item) =>
        item.courseId === courseId &&
        item.year === year &&
        item.semester === semester,
    );

    if (!courseCompletionWorkData) {
      return null;
    }

    return courseCompletionWorkData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseCompletionWorkDataFilter,
  ): Promise<FindAllCourseCompletionWorkData> {
    const filteredCourseCompletionWorkData =
      this.courseCompletionWorkData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true) &&
          departureData.courseId === courseId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseCompletionWorkData = filteredCourseCompletionWorkData.slice(
      currentPage,
      totalItemsToTake,
    );

    const totalItems = filteredCourseCompletionWorkData.length;
    const totalPages = Math.ceil(
      filteredCourseCompletionWorkData.length / itemsPerPage,
    );

    return {
      courseCompletionWorkData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseCompletionWorkData[]> {
    const filteredCourseCompletionWorkData =
      this.courseCompletionWorkData.filter(
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

    return filteredCourseCompletionWorkData;
  }

  async save(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Promise<void> {
    const itemIndex = this.courseCompletionWorkData.findIndex(
      (item) => item.id === courseCompletionWorkData.id,
    );

    this.courseCompletionWorkData[itemIndex] = courseCompletionWorkData;
  }

  async create(courseCompletionWorkData: CourseCompletionWorkData) {
    this.courseCompletionWorkData.push(courseCompletionWorkData);
  }

  async delete(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Promise<void> {
    const itemIndex = this.courseCompletionWorkData.findIndex(
      (item) => item.id === courseCompletionWorkData.id,
    );

    this.courseCompletionWorkData.splice(itemIndex, 1);
  }
}
