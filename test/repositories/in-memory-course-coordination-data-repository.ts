import { Pagination } from '@/core/pagination/pagination';
import {
  CourseCoordinationDataRepository,
  FindAllCourseCoordinationData,
  FindAllCourseCoordinationDataFilter,
  FindForIndicatorsFilter,
} from '@/domain/application/repositories/course-coordination-data-repository';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';
import { Semester } from '@/domain/entities/course-data';

export class InMemoryCourseCoordinationDataRepository
  implements CourseCoordinationDataRepository
{
  public courseCoordinationData: CourseCoordinationData[] = [];

  async findById(id: string): Promise<CourseCoordinationData | null> {
    const courseCoordinationData = this.courseCoordinationData.find(
      (item) => item.id.toString() === id,
    );

    if (!courseCoordinationData) {
      return null;
    }

    return courseCoordinationData;
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseCoordinationData | null> {
    const courseCoordinationData = this.courseCoordinationData.find(
      (item) =>
        item.courseId === courseId &&
        item.year === year &&
        item.semester === semester,
    );

    if (!courseCoordinationData) {
      return null;
    }

    return courseCoordinationData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseCoordinationDataFilter,
  ): Promise<FindAllCourseCoordinationData> {
    const filteredCourseCoordinationData = this.courseCoordinationData.filter(
      (coordinationData) =>
        (semester ? coordinationData.semester === semester : true) &&
        (year ? coordinationData.year === year : true) &&
        coordinationData.courseId === courseId,
    );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseCoordinationData = filteredCourseCoordinationData.slice(
      currentPage,
      totalItemsToTake,
    );

    const totalItems = filteredCourseCoordinationData.length;
    const totalPages = Math.ceil(
      filteredCourseCoordinationData.length / itemsPerPage,
    );

    return {
      courseCoordinationData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseCoordinationData[]> {
    const filteredCourseCoordinationData = this.courseCoordinationData.filter(
      (coordinationData) =>
        (filters?.semester
          ? coordinationData.semester === filters.semester
          : true) &&
        (filters?.year ? coordinationData.year === filters.year : true) &&
        (filters?.yearFrom ? coordinationData.year > filters.yearFrom : true) &&
        (filters?.yearTo ? coordinationData.year < filters.yearTo : true) &&
        coordinationData.courseId === courseId,
    );

    return filteredCourseCoordinationData;
  }

  async save(courseCoordinationData: CourseCoordinationData): Promise<void> {
    const itemIndex = this.courseCoordinationData.findIndex(
      (item) => item.id === courseCoordinationData.id,
    );

    this.courseCoordinationData[itemIndex] = courseCoordinationData;
  }

  async create(courseCoordinationData: CourseCoordinationData) {
    this.courseCoordinationData.push(courseCoordinationData);
  }

  async delete(courseCoordinationData: CourseCoordinationData): Promise<void> {
    const itemIndex = this.courseCoordinationData.findIndex(
      (item) => item.id === courseCoordinationData.id,
    );

    this.courseCoordinationData.splice(itemIndex, 1);
  }
}
