import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseSearchComplementaryActivitiesDataRepository,
  FindAllCourseSearchComplementaryActivitiesData,
  FindAllCourseSearchComplementaryActivitiesDataFilter,
} from '@/domain/application/repositories/course-search-complementary-activities-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';

export class InMemoryCourseSearchComplementaryActivitiesDataRepository
  implements CourseSearchComplementaryActivitiesDataRepository
{
  public courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData[] =
    [];

  async findById(
    id: string,
  ): Promise<CourseSearchComplementaryActivitiesData | null> {
    const courseSearchComplementaryActivitiesData =
      this.courseSearchComplementaryActivitiesData.find(
        (item) => item.id.toString() === id,
      );

    if (!courseSearchComplementaryActivitiesData) {
      return null;
    }

    return courseSearchComplementaryActivitiesData;
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseSearchComplementaryActivitiesData | null> {
    const courseSearchComplementaryActivitiesData =
      this.courseSearchComplementaryActivitiesData.find(
        (item) =>
          item.courseId === courseId &&
          item.year === year &&
          item.semester === semester,
      );

    if (!courseSearchComplementaryActivitiesData) {
      return null;
    }

    return courseSearchComplementaryActivitiesData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseSearchComplementaryActivitiesDataFilter,
  ): Promise<FindAllCourseSearchComplementaryActivitiesData> {
    const filteredCourseSearchComplementaryActivitiesData =
      this.courseSearchComplementaryActivitiesData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true) &&
          departureData.courseId === courseId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseSearchComplementaryActivitiesData =
      filteredCourseSearchComplementaryActivitiesData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems = filteredCourseSearchComplementaryActivitiesData.length;
    const totalPages = Math.ceil(
      filteredCourseSearchComplementaryActivitiesData.length / itemsPerPage,
    );

    return {
      courseSearchComplementaryActivitiesData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseSearchComplementaryActivitiesData[]> {
    const filteredCourseSearchComplementaryActivitiesData =
      this.courseSearchComplementaryActivitiesData.filter(
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

    return filteredCourseSearchComplementaryActivitiesData;
  }

  async save(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Promise<void> {
    const itemIndex = this.courseSearchComplementaryActivitiesData.findIndex(
      (item) => item.id === courseSearchComplementaryActivitiesData.id,
    );

    this.courseSearchComplementaryActivitiesData[itemIndex] =
      courseSearchComplementaryActivitiesData;
  }

  async create(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ) {
    this.courseSearchComplementaryActivitiesData.push(
      courseSearchComplementaryActivitiesData,
    );
  }

  async delete(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Promise<void> {
    const itemIndex = this.courseSearchComplementaryActivitiesData.findIndex(
      (item) => item.id === courseSearchComplementaryActivitiesData.id,
    );

    this.courseSearchComplementaryActivitiesData.splice(itemIndex, 1);
  }
}
