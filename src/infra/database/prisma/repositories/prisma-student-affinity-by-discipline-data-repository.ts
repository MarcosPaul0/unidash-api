import { StudentAffinityByDisciplineDataRepository } from '@/domain/application/repositories/student-affinity-by-discipline-data-repository';
import { StudentAffinityByDisciplineData } from '@/domain/entities/student-affinity-by-discipline-data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaStudentAffinityByDisciplineDataMapper } from '../mappers/prisma-student-affinity-by-discipline-data-mapper';

@Injectable()
export class PrismaStudentAffinityByDisciplineDataRepository
  implements StudentAffinityByDisciplineDataRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(
    studentAffinityByDisciplineData: StudentAffinityByDisciplineData[],
  ): Promise<void> {
    await Promise.all(
      studentAffinityByDisciplineData.map((data) => {
        const toCreate =
          PrismaStudentAffinityByDisciplineDataMapper.toPrismaCreate(data);

        return this.prisma.studentAffinityByDisciplineData.create({
          data: toCreate,
        });
      }),
    );
  }
}
