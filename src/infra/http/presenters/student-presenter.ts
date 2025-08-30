import { Student } from '@/domain/entities/student';

export class StudentPresenter {
  static toHTTP(student: Student) {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      role: student.role,
      type: student.type,
      matriculation: student.matriculation,
      accountActivatedAt: student.accountActivatedAt,
      courseId: student.courseId,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }
}
