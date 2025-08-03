import { User, UserRole } from '../../entities/user';

export abstract class UsersRepository {
  abstract findAllByRole(userRole: UserRole): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
}
