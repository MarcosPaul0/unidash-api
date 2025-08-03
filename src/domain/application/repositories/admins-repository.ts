import { Admin } from '../../entities/admin'

export abstract class AdminsRepository {
  abstract create(admin: Admin): Promise<void>
  abstract findById(id: string): Promise<Admin | null>
}
