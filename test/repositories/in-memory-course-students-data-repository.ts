import { Pagination } from '@/core/pagination/pagination';
import {
  CourseStudentsDataRepository,
  FindAllCourseStudentsData,
  FindAllCourseStudentsDataFilter,
} from '@/domain/application/repositories/course-students-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { CourseStudentsData } from '@/domain/entities/course-students-data';

export class InMemoryCourseStudentsDataRepository
  implements CourseStudentsDataRepository
{
  public courseStudentsData: CourseStudentsData[] = [];

  async findById(id: string): Promise<CourseStudentsData | null> {
    const courseStudentsData = this.courseStudentsData.find(
      (item) => item.id.toString() === id,
    );

    if (!courseStudentsData) {
      return null;
    }

    return courseStudentsData;
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseStudentsData | null> {
    const courseStudentsData = this.courseStudentsData.find(
      (item) =>
        item.courseId === courseId &&
        item.year === year &&
        item.semester === semester,
    );

    if (!courseStudentsData) {
      return null;
    }

    return courseStudentsData;
  }

  async findAll(
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseStudentsDataFilter,
  ): Promise<FindAllCourseStudentsData> {
    const filteredCourseStudentsData = this.courseStudentsData.filter(
      (StudentsData) =>
        (semester ? StudentsData.semester === semester : true) &&
        (year ? StudentsData.year === year : true),
    );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseStudentsData = filteredCourseStudentsData.slice(
      currentPage,
      totalItemsToTake,
    );

    const totalItems = filteredCourseStudentsData.length;
    const totalPages = Math.ceil(
      filteredCourseStudentsData.length / itemsPerPage,
    );

    return {
      courseStudentsData,
      totalItems,
      totalPages,
    };
  }

  async save(courseStudentsData: CourseStudentsData): Promise<void> {
    const itemIndex = this.courseStudentsData.findIndex(
      (item) => item.id === courseStudentsData.id,
    );

    this.courseStudentsData[itemIndex] = courseStudentsData;
  }

  async create(courseStudentsData: CourseStudentsData) {
    this.courseStudentsData.push(courseStudentsData);
  }

  async delete(courseStudentsData: CourseStudentsData): Promise<void> {
    const itemIndex = this.courseStudentsData.findIndex(
      (item) => item.id === courseStudentsData.id,
    );

    this.courseStudentsData.splice(itemIndex, 1);
  }
}
