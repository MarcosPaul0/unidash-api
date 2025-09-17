import {
  StudentTechnology as PrismaStudentTechnology,
  StudentTechnologyData as PrismaStudentTechnologyData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { StudentTechnologyData } from '@/domain/entities/student-technology-data';

type PrismaStudentTechnologyFullData = PrismaStudentTechnologyData & {
  studentTechnology: PrismaStudentTechnology;
};

export class PrismaStudentTechnologyDataMapper {
  static toDomain(raw: PrismaStudentTechnologyFullData): StudentTechnologyData {
    return StudentTechnologyData.create(
      {
        technology: raw.studentTechnology.technology,
        studentIncomingDataId: raw.studentIncomingDataId,
        description: raw.studentTechnology.description,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    studentTechnologyData: StudentTechnologyData,
    studentTechnologyId: string,
  ): Prisma.StudentTechnologyDataUncheckedCreateInput {
    return {
      studentIncomingDataId: studentTechnologyData.studentIncomingDataId,
      studentTechnologyId,
    };
  }
}
