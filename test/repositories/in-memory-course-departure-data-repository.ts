import { Pagination } from '@/core/pagination/pagination';
import {
  CourseDepartureDataRepository,
  FindAllCourseDepartureData,
  FindAllCourseDepartureDataFilter,
} from '@/domain/application/repositories/course-departure-data-repository';
import {
  CoursesRepository,
  FindWithTeachers,
} from '@/domain/application/repositories/courses-repository';
import { Course } from '@/domain/entities/course';
import {
  CourseDepartureData,
  Semester,
} from '@/domain/entities/course-departure-data';
import { TeacherCourse } from '@/domain/entities/teacher-course';

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
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseDepartureDataFilter,
  ): Promise<FindAllCourseDepartureData> {
    const filteredCourseDepartureData = this.courseDepartureData.filter(
      (departureData) =>
        (semester ? departureData.semester === semester : true) &&
        (year ? departureData.year === year : true),
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
