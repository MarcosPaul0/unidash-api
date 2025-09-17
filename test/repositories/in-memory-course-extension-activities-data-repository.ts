import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseExtensionActivitiesDataRepository,
  FindAllCourseExtensionActivitiesData,
  FindAllCourseExtensionActivitiesDataFilter,
} from '@/domain/application/repositories/course-extension-activities-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';

export class InMemoryCourseExtensionActivitiesDataRepository
  implements CourseExtensionActivitiesDataRepository
{
  public courseExtensionActivitiesData: CourseExtensionActivitiesData[] = [];

  async findById(id: string): Promise<CourseExtensionActivitiesData | null> {
    const courseExtensionActivitiesData =
      this.courseExtensionActivitiesData.find(
        (item) => item.id.toString() === id,
      );

    if (!courseExtensionActivitiesData) {
      return null;
    }

    return courseExtensionActivitiesData;
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseExtensionActivitiesData | null> {
    const courseExtensionActivitiesData =
      this.courseExtensionActivitiesData.find(
        (item) =>
          item.courseId === courseId &&
          item.year === year &&
          item.semester === semester,
      );

    if (!courseExtensionActivitiesData) {
      return null;
    }

    return courseExtensionActivitiesData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseExtensionActivitiesDataFilter,
  ): Promise<FindAllCourseExtensionActivitiesData> {
    const filteredCourseExtensionActivitiesData =
      this.courseExtensionActivitiesData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true) &&
          departureData.courseId === courseId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseExtensionActivitiesData =
      filteredCourseExtensionActivitiesData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems = filteredCourseExtensionActivitiesData.length;
    const totalPages = Math.ceil(
      filteredCourseExtensionActivitiesData.length / itemsPerPage,
    );

    return {
      courseExtensionActivitiesData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseExtensionActivitiesData[]> {
    const filteredCourseExtensionActivitiesData =
      this.courseExtensionActivitiesData.filter(
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

    return filteredCourseExtensionActivitiesData;
  }

  async save(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Promise<void> {
    const itemIndex = this.courseExtensionActivitiesData.findIndex(
      (item) => item.id === courseExtensionActivitiesData.id,
    );

    this.courseExtensionActivitiesData[itemIndex] =
      courseExtensionActivitiesData;
  }

  async create(courseExtensionActivitiesData: CourseExtensionActivitiesData) {
    this.courseExtensionActivitiesData.push(courseExtensionActivitiesData);
  }

  async delete(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Promise<void> {
    const itemIndex = this.courseExtensionActivitiesData.findIndex(
      (item) => item.id === courseExtensionActivitiesData.id,
    );

    this.courseExtensionActivitiesData.splice(itemIndex, 1);
  }
}
