import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseInternshipDataRepository,
  FindAllCourseInternshipData,
  FindAllCourseInternshipDataFilter,
} from '@/domain/application/repositories/course-internship-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { CourseInternshipData } from '@/domain/entities/course-internship-data';

export class InMemoryCourseInternshipDataRepository
  implements CourseInternshipDataRepository
{
  public courseInternshipData: CourseInternshipData[] = [];

  async findById(id: string): Promise<CourseInternshipData | null> {
    const courseInternshipData = this.courseInternshipData.find(
      (item) => item.id.toString() === id,
    );

    if (!courseInternshipData) {
      return null;
    }

    return courseInternshipData;
  }

  async findByMatriculation(
    matriculation: string,
  ): Promise<CourseInternshipData | null> {
    const courseInternshipData = this.courseInternshipData.find(
      (item) => item.studentMatriculation === matriculation,
    );

    if (!courseInternshipData) {
      return null;
    }

    return courseInternshipData;
  }

  async findAll(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseInternshipDataFilter,
  ): Promise<FindAllCourseInternshipData> {
    const filteredCourseInternshipData = this.courseInternshipData.filter(
      (InternshipData) =>
        (semester ? InternshipData.semester === semester : true) &&
        (year ? InternshipData.year === year : true) &&
        InternshipData.courseId === courseId,
    );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseInternshipData = filteredCourseInternshipData.slice(
      currentPage,
      totalItemsToTake,
    );

    const totalItems = filteredCourseInternshipData.length;
    const totalPages = Math.ceil(
      filteredCourseInternshipData.length / itemsPerPage,
    );

    return {
      courseInternshipData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseInternshipData[]> {
    const filteredCourseInternshipData = this.courseInternshipData.filter(
      (coordinationData) =>
        (filters?.semester
          ? coordinationData.semester === filters.semester
          : true) &&
        (filters?.year ? coordinationData.year === filters.year : true) &&
        (filters?.yearFrom ? coordinationData.year > filters.yearFrom : true) &&
        (filters?.yearTo ? coordinationData.year < filters.yearTo : true) &&
        coordinationData.courseId === courseId,
    );

    return filteredCourseInternshipData;
  }

  async save(courseInternshipData: CourseInternshipData): Promise<void> {
    const itemIndex = this.courseInternshipData.findIndex(
      (item) => item.id === courseInternshipData.id,
    );

    this.courseInternshipData[itemIndex] = courseInternshipData;
  }

  async create(courseInternshipData: CourseInternshipData) {
    this.courseInternshipData.push(courseInternshipData);
  }

  async delete(courseInternshipData: CourseInternshipData): Promise<void> {
    const itemIndex = this.courseInternshipData.findIndex(
      (item) => item.id === courseInternshipData.id,
    );

    this.courseInternshipData.splice(itemIndex, 1);
  }
}
