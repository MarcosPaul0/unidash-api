import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseTeachingComplementaryActivitiesDataRepository,
  FindAllCourseTeachingComplementaryActivitiesData,
  FindAllCourseTeachingComplementaryActivitiesDataFilter,
} from '@/domain/application/repositories/course-teaching-complementary-activities-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';

export class InMemoryCourseTeachingComplementaryActivitiesDataRepository
  implements CourseTeachingComplementaryActivitiesDataRepository
{
  public courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData[] =
    [];

  async findById(
    id: string,
  ): Promise<CourseTeachingComplementaryActivitiesData | null> {
    const courseTeachingComplementaryActivitiesData =
      this.courseTeachingComplementaryActivitiesData.find(
        (item) => item.id.toString() === id,
      );

    if (!courseTeachingComplementaryActivitiesData) {
      return null;
    }

    return courseTeachingComplementaryActivitiesData;
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseTeachingComplementaryActivitiesData | null> {
    const courseTeachingComplementaryActivitiesData =
      this.courseTeachingComplementaryActivitiesData.find(
        (item) =>
          item.courseId === courseId &&
          item.year === year &&
          item.semester === semester,
      );

    if (!courseTeachingComplementaryActivitiesData) {
      return null;
    }

    return courseTeachingComplementaryActivitiesData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseTeachingComplementaryActivitiesDataFilter,
  ): Promise<FindAllCourseTeachingComplementaryActivitiesData> {
    const filteredCourseTeachingComplementaryActivitiesData =
      this.courseTeachingComplementaryActivitiesData.filter(
        (departureData) =>
          (semester ? departureData.semester === semester : true) &&
          (year ? departureData.year === year : true) &&
          departureData.courseId === courseId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseTeachingComplementaryActivitiesData =
      filteredCourseTeachingComplementaryActivitiesData.slice(
        currentPage,
        totalItemsToTake,
      );

    const totalItems = filteredCourseTeachingComplementaryActivitiesData.length;
    const totalPages = Math.ceil(
      filteredCourseTeachingComplementaryActivitiesData.length / itemsPerPage,
    );

    return {
      courseTeachingComplementaryActivitiesData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseTeachingComplementaryActivitiesData[]> {
    const filteredCourseTeachingComplementaryActivitiesData =
      this.courseTeachingComplementaryActivitiesData.filter(
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

    return filteredCourseTeachingComplementaryActivitiesData;
  }

  async save(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Promise<void> {
    const itemIndex = this.courseTeachingComplementaryActivitiesData.findIndex(
      (item) => item.id === courseTeachingComplementaryActivitiesData.id,
    );

    this.courseTeachingComplementaryActivitiesData[itemIndex] =
      courseTeachingComplementaryActivitiesData;
  }

  async create(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ) {
    this.courseTeachingComplementaryActivitiesData.push(
      courseTeachingComplementaryActivitiesData,
    );
  }

  async delete(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Promise<void> {
    const itemIndex = this.courseTeachingComplementaryActivitiesData.findIndex(
      (item) => item.id === courseTeachingComplementaryActivitiesData.id,
    );

    this.courseTeachingComplementaryActivitiesData.splice(itemIndex, 1);
  }
}
