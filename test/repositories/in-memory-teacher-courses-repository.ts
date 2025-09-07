import { Pagination } from '@/core/pagination/pagination';
import {
  FindAllByCourseId,
  TeacherCoursesRepository,
} from '@/domain/application/repositories/teacher-courses-repository';
import { TeacherCourse } from '@/domain/entities/teacher-course';

export class InMemoryTeacherCoursesRepository
  implements TeacherCoursesRepository
{
  public teacherCourses: TeacherCourse[] = [];

  async findById(id: string): Promise<TeacherCourse | null> {
    const teacherCourse = this.teacherCourses.find(
      (item) => item.id.toString() === id,
    );

    if (!teacherCourse) {
      return null;
    }

    return teacherCourse;
  }

  async findByTeacherAndCourseId(
    teacherId: string,
    courseId: string,
  ): Promise<TeacherCourse | null> {
    const teacherCourse = this.teacherCourses.find(
      (item) => item.courseId === courseId && item.teacherId === teacherId,
    );

    if (!teacherCourse) {
      return null;
    }

    return teacherCourse;
  }

  async findByUserAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<TeacherCourse | null> {
    const teacherCourse = this.teacherCourses.find(
      (item) => item.courseId === courseId && item.teacherId === userId,
    );

    if (!teacherCourse) {
      return null;
    }

    return teacherCourse;
  }

  async findAllByCourseId(
    courseId: string,
    { itemsPerPage, page }: Pagination,
  ): Promise<FindAllByCourseId> {
    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const teacherCoursesByCourse = this.teacherCourses.filter(
      (teacherCourse) => teacherCourse.courseId === courseId,
    );

    const teacherCourses = teacherCoursesByCourse.slice(
      currentPage,
      totalItemsToTake,
    );
    const totalItems = teacherCoursesByCourse.length;
    const totalPages = Math.ceil(teacherCoursesByCourse.length / itemsPerPage);

    return {
      teacherCourses,
      totalItems,
      totalPages,
    };
  }

  async findAllByTeacherId(teacherId: string): Promise<TeacherCourse[]> {
    const teacherCourses = this.teacherCourses.filter(
      (teacherCourse) => teacherCourse.teacherId === teacherId,
    );

    return teacherCourses;
  }

  async save(teacherCourse: TeacherCourse): Promise<void> {
    const itemIndex = this.teacherCourses.findIndex(
      (item) => item.id === teacherCourse.id,
    );

    this.teacherCourses[itemIndex] = teacherCourse;
  }

  async create(teacherCourse: TeacherCourse) {
    this.teacherCourses.push(teacherCourse);
  }

  async delete(teacherCourse: TeacherCourse): Promise<void> {
    const itemIndex = this.teacherCourses.findIndex(
      (item) => item.id === teacherCourse.id,
    );

    this.teacherCourses.splice(itemIndex, 1);
  }
}
