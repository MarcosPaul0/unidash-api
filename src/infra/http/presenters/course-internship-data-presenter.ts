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
      conclusionTimeInDays: courseInternshipData.conclusionTimeInDays,
      cityId: courseInternshipData.cityId,
      employmentType: courseInternshipData.employmentType,
      cityName: courseInternshipData.city?.name,
      advisorId: courseInternshipData.advisorId,
      advisorName: courseInternshipData.advisor?.name,
      createdAt: courseInternshipData.createdAt,
      updatedAt: courseInternshipData.updatedAt,
    };
  }
}
