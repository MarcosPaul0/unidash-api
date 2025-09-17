import {
  StudentUniversityChoiceReason as PrismaStudentUniversityChoiceReason,
  StudentUniversityChoiceReasonData as PrismaStudentUniversityChoiceReasonData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { StudentUniversityChoiceReasonData } from '@/domain/entities/student-university-choice-reason-data';

type PrismaStudentUniversityChoiceReasonFullData =
  PrismaStudentUniversityChoiceReasonData & {
    studentUniversityChoiceReason: PrismaStudentUniversityChoiceReason;
  };

export class PrismaStudentUniversityChoiceReasonDataMapper {
  static toDomain(
    raw: PrismaStudentUniversityChoiceReasonFullData,
  ): StudentUniversityChoiceReasonData {
    return StudentUniversityChoiceReasonData.create(
      {
        choiceReason: raw.studentUniversityChoiceReason.choiceReason,
        studentIncomingDataId: raw.studentIncomingDataId,
        description: raw.studentUniversityChoiceReason.description,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    studentUniversityChoiceReasonData: StudentUniversityChoiceReasonData,
    studentUniversityChoiceReasonId: string,
  ): Prisma.StudentUniversityChoiceReasonDataUncheckedCreateInput {
    return {
      studentUniversityChoiceReasonId,
      studentIncomingDataId:
        studentUniversityChoiceReasonData.studentIncomingDataId,
    };
  }
}
