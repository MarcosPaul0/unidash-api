import { AdminsRepository } from '@/domain/application/repositories/admins-repository';
import { Admin } from '@/domain/marketplace/enterprise/entities/admin';

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = [];

  async create(admin: Admin) {
    this.items.push(admin);
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = this.items.find((item) => item.id.toString() === id);

    if (!admin) {
      return null;
    }

    return admin;
  }
}
