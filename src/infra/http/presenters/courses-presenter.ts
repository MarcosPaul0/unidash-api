import { Course } from '@/domain/entities/course';

export class CoursesPresenter {
  static toHTTP(course: Course) {
    return {
      id: course.id.toString(),
      name: course.name,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}
