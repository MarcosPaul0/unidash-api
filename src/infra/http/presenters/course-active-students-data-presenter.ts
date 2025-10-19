import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';

export class CourseActiveStudentsDataPresenter {
  static toListHTTP(courseActiveStudentsData: CourseActiveStudentsData) {
    return {
      id: courseActiveStudentsData.id.toString(),
      courseId: courseActiveStudentsData.courseId,
      year: courseActiveStudentsData.year,
      semester: courseActiveStudentsData.semester,
      activeStudents: courseActiveStudentsData.activeStudentsByIngress.reduce(
        (accumulator, currentActiveStudents) =>
          accumulator + currentActiveStudents.numberOfStudents,
        0,
      ),
      createdAt: courseActiveStudentsData.createdAt,
      updatedAt: courseActiveStudentsData.updatedAt,
    };
  }

  static toHTTP(courseActiveStudentsData: CourseActiveStudentsData) {
    return {
      id: courseActiveStudentsData.id.toString(),
      courseId: courseActiveStudentsData.courseId,
      year: courseActiveStudentsData.year,
      semester: courseActiveStudentsData.semester,
      activeStudents: courseActiveStudentsData.activeStudentsByIngress.map(
        (studentsByIngress) => ({
          ingressYear: studentsByIngress.ingressYear,
          numberOfStudents: studentsByIngress.numberOfStudents,
        }),
      ),
      createdAt: courseActiveStudentsData.createdAt,
      updatedAt: courseActiveStudentsData.updatedAt,
    };
  }
}
