import { User as PrismaUser, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/entities/user';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
        accountActivatedAt: raw.accountActivatedAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      accountActivatedAt: user.accountActivatedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
