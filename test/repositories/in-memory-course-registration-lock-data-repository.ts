import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseRegistrationLockDataRepository,
  FindAllCourseRegistrationLockData,
  FindAllCourseRegistrationLockDataFilter,
} from '@/domain/application/repositories/course-registration-lock-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';

export class InMemoryCourseRegistrationLockDataRepository
  implements CourseRegistrationLockDataRepository
{
  public courseRegistrationLockData: CourseRegistrationLockData[] = [];

  async findById(id: string): Promise<CourseRegistrationLockData | null> {
    const courseRegistrationLockData = this.courseRegistrationLockData.find(
      (item) => item.id.toString() === id,
    );

    if (!courseRegistrationLockData) {
      return null;
    }

    return courseRegistrationLockData;
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseRegistrationLockData | null> {
    const courseRegistrationLockData = this.courseRegistrationLockData.find(
      (item) =>
        item.courseId === courseId &&
        item.year === year &&
        item.semester === semester,
    );

    if (!courseRegistrationLockData) {
      return null;
    }

    return courseRegistrationLockData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseRegistrationLockDataFilter,
  ): Promise<FindAllCourseRegistrationLockData> {
    const filteredCourseRegistrationLockData =
      this.courseRegistrationLockData.filter(
        (registrationLockData) =>
          (semester ? registrationLockData.semester === semester : true) &&
          (year ? registrationLockData.year === year : true) &&
          registrationLockData.courseId === courseId,
      );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseRegistrationLockData = filteredCourseRegistrationLockData.slice(
      currentPage,
      totalItemsToTake,
    );

    const totalItems = filteredCourseRegistrationLockData.length;
    const totalPages = Math.ceil(
      filteredCourseRegistrationLockData.length / itemsPerPage,
    );

    return {
      courseRegistrationLockData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseRegistrationLockData[]> {
    const filteredCourseRegistrationLockData =
      this.courseRegistrationLockData.filter(
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

    return filteredCourseRegistrationLockData;
  }

  async save(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Promise<void> {
    const itemIndex = this.courseRegistrationLockData.findIndex(
      (item) => item.id === courseRegistrationLockData.id,
    );

    this.courseRegistrationLockData[itemIndex] = courseRegistrationLockData;
  }

  async create(courseRegistrationLockData: CourseRegistrationLockData) {
    this.courseRegistrationLockData.push(courseRegistrationLockData);
  }

  async delete(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Promise<void> {
    const itemIndex = this.courseRegistrationLockData.findIndex(
      (item) => item.id === courseRegistrationLockData.id,
    );

    this.courseRegistrationLockData.splice(itemIndex, 1);
  }
}
