import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AdminsRepository } from '@/domain/application/repositories/admins-repository';
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper';
import { Admin } from '@/domain/entities/admin';

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrismaCreate(admin);

    await Promise.all([
      this.prisma.user.create({
        data,
      }),
    ]);
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }
}
