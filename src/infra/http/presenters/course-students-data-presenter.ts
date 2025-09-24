import { CourseStudentsData } from '@/domain/entities/course-students-data';

export class CourseStudentsDataPresenter {
  static toHTTP(courseStudentsData: CourseStudentsData) {
    return {
      id: courseStudentsData.id.toString(),
      courseId: courseStudentsData.courseId,
      year: courseStudentsData.year,
      semester: courseStudentsData.semester,
      entrants: courseStudentsData.entrants,
      actives: courseStudentsData.actives,
      vacancies: courseStudentsData.vacancies,
      subscribers: courseStudentsData.subscribers,
      createdAt: courseStudentsData.createdAt,
      updatedAt: courseStudentsData.updatedAt,
    };
  }
}
