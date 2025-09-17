import {
  StudentHobbyOrHabit as PrismaStudentHobbyOrHabit,
  StudentHobbyOrHabitData as PrismaStudentHobbyOrHabitData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { StudentHobbyOrHabitData } from '@/domain/entities/student-hobby-or-habit-data';

type PrismaStudentHobbyOrHabitFullData = PrismaStudentHobbyOrHabitData & {
  studentHobbyOrHabit: PrismaStudentHobbyOrHabit;
};

export class PrismaStudentHobbyOrHabitDataMapper {
  static toDomain(
    raw: PrismaStudentHobbyOrHabitFullData,
  ): StudentHobbyOrHabitData {
    return StudentHobbyOrHabitData.create(
      {
        hobbyOrHabit: raw.studentHobbyOrHabit.hobbyOrHabit,
        studentIncomingDataId: raw.studentIncomingDataId,
        description: raw.studentHobbyOrHabit.description,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    studentHobbyOrHabitData: StudentHobbyOrHabitData,
    studentHobbyOrHabitId,
  ): Prisma.StudentHobbyOrHabitDataUncheckedCreateInput {
    return {
      studentIncomingDataId: studentHobbyOrHabitData.studentIncomingDataId,
      studentHobbyOrHabitId,
    };
  }
}
