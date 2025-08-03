import { Teacher } from '@/domain/entities/teacher';

export class TeacherPresenter {
  static toHTTP(teacher: Teacher) {
    return {
      id: teacher.id.toString(),
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      isActive: teacher.isActive,
      accountActivatedAt: teacher.accountActivatedAt,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }
}
