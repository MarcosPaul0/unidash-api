import {
  CoursesRepository,
  FindWithTeachers,
} from '@/domain/application/repositories/courses-repository';
import { Course } from '@/domain/entities/course';
import { TeacherCourse } from '@/domain/entities/teacher-course';

export class InMemoryCoursesRepository implements CoursesRepository {
  public courses: Course[] = [];
  public teacherCourses: TeacherCourse[] = [];

  async findByName(name: string): Promise<Course | null> {
    const course = this.courses.find((item) => item.name.toString() === name);

    if (!course) {
      return null;
    }

    return course;
  }

  async findById(id: string): Promise<Course | null> {
    const course = this.courses.find((item) => item.id.toString() === id);

    if (!course) {
      return null;
    }

    return course;
  }

  async findByIdWithTeachers(id: string): Promise<FindWithTeachers | null> {
    const course = this.courses.find((item) => item.id.toString() === id);

    if (!course) {
      return null;
    }

    const teacherCourse = this.teacherCourses.filter(
      (teacherCourse) => teacherCourse.courseId === id,
    );

    return {
      course,
      teacherCourse,
    };
  }

  async save(course: Course): Promise<void> {
    const itemIndex = this.courses.findIndex((item) => item.id === course.id);

    this.courses[itemIndex] = course;
  }

  async create(course: Course) {
    this.courses.push(course);
  }

  async delete(course: Course): Promise<void> {
    const itemIndex = this.courses.findIndex((item) => item.id === course.id);

    this.courses.splice(itemIndex, 1);
  }
}
