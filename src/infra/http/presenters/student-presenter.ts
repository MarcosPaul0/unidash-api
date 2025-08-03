import { Student } from '@/domain/entities/student';

export class StudentPresenter {
  static toHTTP(student: Student) {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      role: student.role,
      matriculation: student.matriculation,
      accountActivatedAt: student.accountActivatedAt,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }
}
