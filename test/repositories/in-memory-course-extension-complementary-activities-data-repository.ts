import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseExtensionComplementaryActivitiesDataRepository,
  FindAllCourseExtensionComplementaryActivitiesData,
  FindAllCourseExtensionComplementaryActivitiesDataFilter,
} from '@/domain/application/repositories/course-extension-complementary-activities-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';

export class InMemoryCourseExtensionComplementaryActivitiesDataRepository
  implements CourseExtensionComplementaryActivitiesDataRepository
{
  public courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData[] =
    [];

  async findById(
    id: string,
  ): Promise<CourseExtensionComplementaryActivitiesData | null> {
    const courseExtensionComplementaryActivitiesData =
      this.courseExtensionComplementaryActivitiesData.find(
        (item) => item.id.toString() === id,
      );

    if (!courseExtensionComplementaryActivitiesData) {
      return null;
    }

    return courseExtensionComplementaryActivitiesData;
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseExtensionComplementaryActivitiesData | null> {
    const courseExtensionComplementaryActivitiesData =
      this.courseExtensionComplementaryActivitiesData.find(
        (item) =>
          item.courseId === courseId &&
          item.year === year &&
          item.semester === semester,
      );

    if (!courseExtensionComplementaryActivitiesData) {
      return null;
    }

    return courseExtensionComplementaryActivitiesData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseExtensionComplementaryActivitiesDataFilter,
  ): Promise<FindAllCourseExtensionComplementaryActivitiesData> {
    const filteredCourseExtensionComplementaryActivitiesData =
      this.courseExtensionComplementaryActivitiesData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true) &&
          departureData.courseId === courseId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseExtensionComplementaryActivitiesData =
      filteredCourseExtensionComplementaryActivitiesData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems =
      filteredCourseExtensionComplementaryActivitiesData.length;
    const totalPages = Math.ceil(
      filteredCourseExtensionComplementaryActivitiesData.length / itemsPerPage,
    );

    return {
      courseExtensionComplementaryActivitiesData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseExtensionComplementaryActivitiesData[]> {
    const filteredCourseExtensionComplementaryActivitiesData =
      this.courseExtensionComplementaryActivitiesData.filter(
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

    return filteredCourseExtensionComplementaryActivitiesData;
  }

  async save(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Promise<void> {
    const itemIndex = this.courseExtensionComplementaryActivitiesData.findIndex(
      (item) => item.id === courseExtensionComplementaryActivitiesData.id,
    );

    this.courseExtensionComplementaryActivitiesData[itemIndex] =
      courseExtensionComplementaryActivitiesData;
  }

  async create(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ) {
    this.courseExtensionComplementaryActivitiesData.push(
      courseExtensionComplementaryActivitiesData,
    );
  }

  async delete(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Promise<void> {
    const itemIndex = this.courseExtensionComplementaryActivitiesData.findIndex(
      (item) => item.id === courseExtensionComplementaryActivitiesData.id,
    );

    this.courseExtensionComplementaryActivitiesData.splice(itemIndex, 1);
  }
}
