import { Pagination } from '@/core/pagination/pagination';
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
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseRegistrationLockDataFilter,
  ): Promise<FindAllCourseRegistrationLockData> {
    const filteredCourseRegistrationLockData =
      this.courseRegistrationLockData.filter(
        (RegistrationLockData) =>
          (semester ? RegistrationLockData.semester === semester : true) &&
          (year ? RegistrationLockData.year === year : true),
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
