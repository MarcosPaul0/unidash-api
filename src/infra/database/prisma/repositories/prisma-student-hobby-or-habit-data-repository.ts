import { StudentHobbyOrHabitDataRepository } from '@/domain/application/repositories/student-hobby-or-habit-data-repository';
import { StudentHobbyOrHabitData } from '@/domain/entities/student-hobby-or-habit-data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaStudentHobbyOrHabitDataMapper } from '../mappers/prisma-student-hobby-or-habit-data-mapper';
import { StudentHobbyOrHabit } from '@/domain/entities/student-hobby-or-habit';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

@Injectable()
export class PrismaStudentHobbyOrHabitDataRepository
  implements StudentHobbyOrHabitDataRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(
    studentHobbyOrHabitData: StudentHobbyOrHabitData[],
  ): Promise<void> {
    await Promise.all(
      studentHobbyOrHabitData.map(async (data) => {
        const hobbyOrHabit =
          await this.prisma.studentHobbyOrHabit.findUniqueOrThrow({
            where: {
              hobbyOrHabit: data.hobbyOrHabit,
            },
          });

        const toCreate = PrismaStudentHobbyOrHabitDataMapper.toPrismaCreate(
          data,
          hobbyOrHabit.id,
        );

        return this.prisma.studentHobbyOrHabitData.create({
          data: toCreate,
        });
      }),
    );
  }

  async findHobbyOrHabitById(
    hobbyOrHabitId: string,
  ): Promise<StudentHobbyOrHabit | null> {
    const studentHobbyOrHabit =
      await this.prisma.studentHobbyOrHabit.findUnique({
        where: {
          id: hobbyOrHabitId,
        },
      });

    if (!studentHobbyOrHabit) {
      return null;
    }

    return StudentHobbyOrHabit.create(
      {
        hobbyOrHabit: studentHobbyOrHabit.hobbyOrHabit,
        description: studentHobbyOrHabit.description,
      },
      new UniqueEntityId(studentHobbyOrHabit.id),
    );
  }
}
