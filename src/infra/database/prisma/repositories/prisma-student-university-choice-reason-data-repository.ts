import { StudentUniversityChoiceReasonDataRepository } from '@/domain/application/repositories/student-university-choice-reason-data-repository';
import { StudentUniversityChoiceReasonData } from '@/domain/entities/student-university-choice-reason-data';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaStudentUniversityChoiceReasonDataMapper } from '../mappers/prisma-student-university-choice-reason-data-mapper';
import { StudentUniversityChoiceReason } from '@/domain/entities/student-university-choice-reason';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

@Injectable()
export class PrismaStudentUniversityChoiceReasonDataRepository
  implements StudentUniversityChoiceReasonDataRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(
    studentUniversityChoiceReasonData: StudentUniversityChoiceReasonData[],
  ): Promise<void> {
    await Promise.all(
      studentUniversityChoiceReasonData.map(async (data) => {
        const choiceReason =
          await this.prisma.studentUniversityChoiceReason.findUniqueOrThrow({
            where: {
              choiceReason: data.choiceReason,
            },
          });

        const toCreate =
          PrismaStudentUniversityChoiceReasonDataMapper.toPrismaCreate(
            data,
            choiceReason.id,
          );

        return this.prisma.studentUniversityChoiceReasonData.create({
          data: toCreate,
        });
      }),
    );
  }

  async findUniversityChoiceReasonById(
    universityChoiceReasonId: string,
  ): Promise<StudentUniversityChoiceReason | null> {
    const studentUniversityChoiceReason =
      await this.prisma.studentUniversityChoiceReason.findUnique({
        where: {
          id: universityChoiceReasonId,
        },
      });

    if (!studentUniversityChoiceReason) {
      return null;
    }

    return StudentUniversityChoiceReason.create(
      {
        choiceReason: studentUniversityChoiceReason.choiceReason,
        description: studentUniversityChoiceReason.description,
      },
      new UniqueEntityId(studentUniversityChoiceReason.id),
    );
  }
}
