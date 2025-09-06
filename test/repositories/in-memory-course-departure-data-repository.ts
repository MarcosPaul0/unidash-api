import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseDepartureDataRepository,
  FindAllCourseDepartureData,
  FindAllCourseDepartureDataFilter,
} from '@/domain/application/repositories/course-departure-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';

export class InMemoryCourseDepartureDataRepository
  implements CourseDepartureDataRepository
{
  public courseDepartureData: CourseDepartureData[] = [];

  async findById(id: string): Promise<CourseDepartureData | null> {
    const courseDepartureData = this.courseDepartureData.find(
      (item) => item.id.toString() === id,
    );

    if (!courseDepartureData) {
      return null;
    }

    return courseDepartureData;
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseDepartureData | null> {
    const courseDepartureData = this.courseDepartureData.find(
      (item) =>
        item.courseId === courseId &&
        item.year === year &&
        item.semester === semester,
    );

    if (!courseDepartureData) {
      return null;
    }

    return courseDepartureData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseDepartureDataFilter,
  ): Promise<FindAllCourseDepartureData> {
    const filteredCourseDepartureData = this.courseDepartureData.filter(
      (departureData) =>
        (semester ? departureData.semester === semester : true) &&
        (year ? departureData.year === year : true) &&
        departureData.courseId === courseId,
    );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseDepartureData = filteredCourseDepartureData.slice(
      currentPage,
      totalItemsToTake,
    );

    const totalItems = filteredCourseDepartureData.length;
    const totalPages = Math.ceil(
      filteredCourseDepartureData.length / itemsPerPage,
    );

    return {
      courseDepartureData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseDepartureData[]> {
    const filteredCourseDepartureData = this.courseDepartureData.filter(
      (coordinationData) =>
        (filters?.semester
          ? coordinationData.semester === filters.semester
          : true) &&
        (filters?.year ? coordinationData.year === filters.year : true) &&
        (filters?.yearFrom ? coordinationData.year > filters.yearFrom : true) &&
        (filters?.yearTo ? coordinationData.year < filters.yearTo : true) &&
        coordinationData.courseId === courseId,
    );

    return filteredCourseDepartureData;
  }

  async save(courseDepartureData: CourseDepartureData): Promise<void> {
    const itemIndex = this.courseDepartureData.findIndex(
      (item) => item.id === courseDepartureData.id,
    );

    this.courseDepartureData[itemIndex] = courseDepartureData;
  }

  async create(courseDepartureData: CourseDepartureData) {
    this.courseDepartureData.push(courseDepartureData);
  }

  async delete(courseDepartureData: CourseDepartureData): Promise<void> {
    const itemIndex = this.courseDepartureData.findIndex(
      (item) => item.id === courseDepartureData.id,
    );

    this.courseDepartureData.splice(itemIndex, 1);
  }
}
