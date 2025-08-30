import { SessionUser, User } from '@/domain/entities/user';

export function makeSessionUser(user: User): SessionUser {
  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    accountActivatedAt: user.accountActivatedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
