import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  FindAllCourseTeacherWorkloadData,
  FindAllCourseTeacherWorkloadDataFilter,
  CourseTeacherWorkloadDataRepository,
} from '@/domain/application/repositories/course-teacher-workload-data-repository';
import { Semester } from '@/domain/entities/course-data';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';

export class InMemoryCourseTeacherWorkloadDataRepository
  implements CourseTeacherWorkloadDataRepository
{
  public courseTeacherWorkloadData: CourseTeacherWorkloadData[] = [];

  async findById(id: string): Promise<CourseTeacherWorkloadData | null> {
    const TeacherWorkloadData = this.courseTeacherWorkloadData.find(
      (item) => item.id.toString() === id,
    );

    if (!TeacherWorkloadData) {
      return null;
    }

    return TeacherWorkloadData;
  }

  async findByPeriod(
    courseId: string,
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseTeacherWorkloadData | null> {
    const TeacherWorkloadData = this.courseTeacherWorkloadData.find(
      (item) =>
        item.teacherId === teacherId &&
        item.courseId === courseId &&
        item.year === year &&
        item.semester === semester,
    );

    if (!TeacherWorkloadData) {
      return null;
    }

    return TeacherWorkloadData;
  }

  async findAllForCourse(
    courseId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseTeacherWorkloadDataFilter,
  ): Promise<FindAllCourseTeacherWorkloadData> {
    const filteredTeacherWorkloadData = this.courseTeacherWorkloadData.filter(
      (workloadData) =>
        (semester ? workloadData.semester === semester : true) &&
        (year ? workloadData.year === year : true) &&
        workloadData.courseId === courseId,
    );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseTeacherWorkloadData = filteredTeacherWorkloadData.slice(
      currentPage,
      totalItemsToTake,
    );

    const totalItems = filteredTeacherWorkloadData.length;
    const totalPages = Math.ceil(
      filteredTeacherWorkloadData.length / itemsPerPage,
    );

    return {
      courseTeacherWorkloadData,
      totalItems,
      totalPages,
    };
  }

  async findAllForTeacher(
    teacherId: string,
    { page, itemsPerPage }: Pagination,
    { semester, year }: FindAllCourseTeacherWorkloadDataFilter,
  ): Promise<FindAllCourseTeacherWorkloadData> {
    const filteredTeacherWorkloadData = this.courseTeacherWorkloadData.filter(
      (departureData) =>
        (semester ? departureData.semester === semester : true) &&
        (year ? departureData.year === year : true) &&
        departureData.teacherId === teacherId,
    );

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const courseTeacherWorkloadData = filteredTeacherWorkloadData.slice(
      currentPage,
      totalItemsToTake,
    );

    const totalItems = filteredTeacherWorkloadData.length;
    const totalPages = Math.ceil(
      filteredTeacherWorkloadData.length / itemsPerPage,
    );

    return {
      courseTeacherWorkloadData,
      totalItems,
      totalPages,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseTeacherWorkloadData[]> {
    const filteredTeacherWorkloadData = this.courseTeacherWorkloadData.filter(
      (workloadData) =>
        (filters?.semester
          ? workloadData.semester === filters.semester
          : true) &&
        (filters?.year ? workloadData.year === filters.year : true) &&
        (filters?.yearFrom ? workloadData.year > filters.yearFrom : true) &&
        (filters?.yearTo ? workloadData.year < filters.yearTo : true) &&
        workloadData.courseId === courseId,
    );

    return filteredTeacherWorkloadData;
  }

  async save(teacherWorkloadData: CourseTeacherWorkloadData): Promise<void> {
    const itemIndex = this.courseTeacherWorkloadData.findIndex(
      (item) => item.id === teacherWorkloadData.id,
    );

    this.courseTeacherWorkloadData[itemIndex] = teacherWorkloadData;
  }

  async create(teacherWorkloadData: CourseTeacherWorkloadData) {
    this.courseTeacherWorkloadData.push(teacherWorkloadData);
  }

  async delete(teacherWorkloadData: CourseTeacherWorkloadData): Promise<void> {
    const itemIndex = this.courseTeacherWorkloadData.findIndex(
      (item) => item.id === teacherWorkloadData.id,
    );

    this.courseTeacherWorkloadData.splice(itemIndex, 1);
  }
}
