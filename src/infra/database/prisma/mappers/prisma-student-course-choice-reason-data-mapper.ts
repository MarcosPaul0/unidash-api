import {
  StudentCourseChoiceReason as PrismaStudentCourseChoiceReason,
  StudentCourseChoiceReasonData as PrismaStudentCourseChoiceReasonData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { StudentCourseChoiceReasonData } from '@/domain/entities/student-course-choice-reason-data';

type PrismaStudentCourseChoiceReasonFullData =
  PrismaStudentCourseChoiceReasonData & {
    studentCourseChoiceReason: PrismaStudentCourseChoiceReason;
  };

export class PrismaStudentCourseChoiceReasonDataMapper {
  static toDomain(
    raw: PrismaStudentCourseChoiceReasonFullData,
  ): StudentCourseChoiceReasonData {
    return StudentCourseChoiceReasonData.create(
      {
        choiceReason: raw.studentCourseChoiceReason.choiceReason,
        studentIncomingDataId: raw.studentIncomingDataId,
        description: raw.studentCourseChoiceReason.description,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    studentCourseChoiceReasonData: StudentCourseChoiceReasonData,
    studentCourseChoiceReasonId: string,
  ): Prisma.StudentCourseChoiceReasonDataUncheckedCreateInput {
    return {
      studentCourseChoiceReasonId,
      studentIncomingDataId:
        studentCourseChoiceReasonData.studentIncomingDataId,
    };
  }
}
