import { TeacherCoursesRepository } from '@/domain/application/repositories/teacher-courses-repository';
import { TeacherCourse } from '@/domain/entities/teacher-course';

export class InMemoryTeacherCoursesRepository
  implements TeacherCoursesRepository
{
  public items: TeacherCourse[] = [];

  async findByTeacherAndCourseId(
    teacherId: string,
    courseId: string,
  ): Promise<TeacherCourse | null> {
    const teacherCourse = this.items.find(
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
    const teacherCourse = this.items.find(
      (item) =>
        item.courseId === courseId && item.teacher.id.toString() === userId,
    );

    if (!teacherCourse) {
      return null;
    }

    return teacherCourse;
  }

  async save(teacherCourse: TeacherCourse): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === teacherCourse.id,
    );

    this.items[itemIndex] = teacherCourse;
  }

  async create(teacherCourse: TeacherCourse) {
    this.items.push(teacherCourse);
  }

  async delete(teacherCourse: TeacherCourse): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === teacherCourse.id,
    );

    this.items.splice(itemIndex, 1);
  }
}
