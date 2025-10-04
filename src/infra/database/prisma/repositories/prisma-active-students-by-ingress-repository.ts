import { PrismaService } from '../prisma.service';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { ActiveStudentsByIngress } from '@/domain/entities/active-students-by-ingress';
import { ActiveStudentsByIngressRepository } from '@/domain/application/repositories/active-students-by-ingress';
import { PrismaActiveStudentsByIngressMapper } from '../mappers/prisma-active-students-by-ingress-mapper';

@Injectable()
export class PrismaActiveStudentsByIngressRepository
  implements ActiveStudentsByIngressRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(
    courseActiveStudentsDataId: string,
    activeStudentsByIngress: ActiveStudentsByIngress[],
  ): Promise<void> {
    await Promise.all(
      activeStudentsByIngress.map(async (data) => {
        const toCreate = PrismaActiveStudentsByIngressMapper.toPrismaCreate(
          data,
          courseActiveStudentsDataId,
        );

        return this.prisma.activeStudentsByIngress.create({
          data: toCreate,
        });
      }),
    );
  }

  async findById(
    activeStudentsByIngressId: string,
  ): Promise<ActiveStudentsByIngress | null> {
    const activeStudentsByIngress =
      await this.prisma.activeStudentsByIngress.findUnique({
        where: {
          id: activeStudentsByIngressId,
        },
      });

    if (!activeStudentsByIngress) {
      return null;
    }

    return ActiveStudentsByIngress.create(
      {
        ingressYear: activeStudentsByIngress.ingressYear,
        numberOfStudents: activeStudentsByIngress.numberOfStudents,
      },
      new UniqueEntityId(activeStudentsByIngress.id),
    );
  }
}
