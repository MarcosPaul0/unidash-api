import {
  StudentAffinityByDisciplineData as PrismaStudentAffinityByDisciplineData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { StudentAffinityByDisciplineData } from '@/domain/entities/student-affinity-by-discipline-data';

export class PrismaStudentAffinityByDisciplineDataMapper {
  static toDomain(
    raw: PrismaStudentAffinityByDisciplineData,
  ): StudentAffinityByDisciplineData {
    return StudentAffinityByDisciplineData.create(
      {
        affinityLevel: raw.affinityLevel,
        discipline: raw.discipline,
        studentIncomingDataId: raw.studentIncomingDataId,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    studentAffinityByDisciplineData: StudentAffinityByDisciplineData,
  ): Prisma.StudentAffinityByDisciplineDataUncheckedCreateInput {
    return {
      affinityLevel: studentAffinityByDisciplineData.affinityLevel,
      discipline: studentAffinityByDisciplineData.discipline,
      studentIncomingDataId:
        studentAffinityByDisciplineData.studentIncomingDataId,
    };
  }
}
