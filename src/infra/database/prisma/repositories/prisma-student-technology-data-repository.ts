import { StudentTechnologyDataRepository } from '@/domain/application/repositories/student-technology-data-repository';
import { StudentTechnologyData } from '@/domain/entities/student-technology-data';
import { PrismaStudentTechnologyDataMapper } from '../mappers/prisma-student-technology-data-mapper';
import { PrismaService } from '../prisma.service';
import { StudentTechnology } from '@/domain/entities/student-technology';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaStudentTechnologyDataRepository
  implements StudentTechnologyDataRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(
    studentTechnologyData: StudentTechnologyData[],
  ): Promise<void> {
    await Promise.all(
      studentTechnologyData.map(async (data) => {
        const technology =
          await this.prisma.studentTechnology.findUniqueOrThrow({
            where: {
              technology: data.technology,
            },
          });

        const toCreate = PrismaStudentTechnologyDataMapper.toPrismaCreate(
          data,
          technology.id,
        );

        return this.prisma.studentTechnologyData.create({
          data: toCreate,
        });
      }),
    );
  }

  async findTechnologyById(
    technologyId: string,
  ): Promise<StudentTechnology | null> {
    const studentTechnology = await this.prisma.studentTechnology.findUnique({
      where: {
        id: technologyId,
      },
    });

    if (!studentTechnology) {
      return null;
    }

    return StudentTechnology.create(
      {
        technology: studentTechnology.technology,
        description: studentTechnology.description,
      },
      new UniqueEntityId(studentTechnology.id),
    );
  }
}
