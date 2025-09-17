import { CourseInternshipData } from '@/domain/entities/course-internship-data';

export class CourseInternshipDataPresenter {
  static toHTTP(courseInternshipData: CourseInternshipData) {
    return {
      id: courseInternshipData.id.toString(),
      courseId: courseInternshipData.courseId,
      year: courseInternshipData.year,
      semester: courseInternshipData.semester,
      studentMatriculation: courseInternshipData.studentMatriculation,
      enterpriseCnpj: courseInternshipData.enterpriseCnpj,
      role: courseInternshipData.role,
      conclusionTime: courseInternshipData.conclusionTime,
      cityId: courseInternshipData.cityId,
      cityName: courseInternshipData.city?.name,
      advisorId: courseInternshipData.advisorId,
      advisorName: courseInternshipData.advisor?.name,
      createdAt: courseInternshipData.createdAt,
      updatedAt: courseInternshipData.updatedAt,
    };
  }
}
