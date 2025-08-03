import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { User, UserRole } from '@/domain/entities/user';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAllByRole(userRole: UserRole): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: userRole,
      },
    });

    return users.map(PrismaUserMapper.toDomain);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await Promise.all([
      this.prisma.user.update({
        where: {
          id: user.id.toString(),
        },
        data,
      }),
    ]);
  }
}
