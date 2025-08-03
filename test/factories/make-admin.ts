import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Admin, AdminProps } from '@/domain/entities/admin';
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper';

export function makeAdmin(
  override: Partial<Omit<AdminProps, 'role'>> = {},
  id?: UniqueEntityId,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'admin',
      ...override,
    },
    id,
  );

  return admin;
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data);

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrismaCreate(admin),
    });

    return admin;
  }
}
