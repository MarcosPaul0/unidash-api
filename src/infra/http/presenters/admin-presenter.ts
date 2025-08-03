import { Admin } from '@/domain/entities/admin';

export class AdminPresenter {
  static toHTTP(admin: Admin) {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      accountActivatedAt: admin.accountActivatedAt,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}
