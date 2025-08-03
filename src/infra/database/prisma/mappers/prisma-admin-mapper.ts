import { User as PrismaUser, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Admin } from '@/domain/entities/admin';

type PrismaAdminUser = PrismaUser;

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdminUser): Admin {
    return Admin.create(
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

  static toPrismaCreate(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
      role: admin.role,
      accountActivatedAt: admin.accountActivatedAt,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}
