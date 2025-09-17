import { StudentCourseChoiceReasonDataRepository } from '@/domain/application/repositories/student-course-choice-reason-data-repository';
import { StudentCourseChoiceReasonData } from '@/domain/entities/student-course-choice-reason-data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaStudentCourseChoiceReasonDataMapper } from '../mappers/prisma-student-course-choice-reason-data-mapper';
import { StudentCourseChoiceReason } from '@/domain/entities/student-course-choice-reason';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

@Injectable()
export class PrismaStudentCourseChoiceReasonDataRepository
  implements StudentCourseChoiceReasonDataRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(
    studentCourseChoiceReasonData: StudentCourseChoiceReasonData[],
  ): Promise<void> {
    await Promise.all(
      studentCourseChoiceReasonData.map(async (data) => {
        const choiceReason =
          await this.prisma.studentCourseChoiceReason.findUniqueOrThrow({
            where: {
              choiceReason: data.choiceReason,
            },
          });

        const toCreate =
          PrismaStudentCourseChoiceReasonDataMapper.toPrismaCreate(
            data,
            choiceReason.id,
          );

        return this.prisma.studentCourseChoiceReasonData.create({
          data: toCreate,
        });
      }),
    );
  }

  async findCourseChoiceReasonById(
    courseChoiceReasonId: string,
  ): Promise<StudentCourseChoiceReason | null> {
    const studentCourseChoiceReason =
      await this.prisma.studentCourseChoiceReason.findUnique({
        where: {
          id: courseChoiceReasonId,
        },
      });

    if (!studentCourseChoiceReason) {
      return null;
    }

    return StudentCourseChoiceReason.create(
      {
        choiceReason: studentCourseChoiceReason.choiceReason,
        description: studentCourseChoiceReason.description,
      },
      new UniqueEntityId(studentCourseChoiceReason.id),
    );
  }
}
