import {
  StudentAsset as PrismaStudentAsset,
  StudentAssetData as PrismaStudentAssetData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { StudentAssetData } from '@/domain/entities/student-asset-data';

type PrismaStudentAssetFullData = PrismaStudentAssetData & {
  studentAsset: PrismaStudentAsset;
};

export class PrismaStudentAssetDataMapper {
  static toDomain(raw: PrismaStudentAssetFullData): StudentAssetData {
    return StudentAssetData.create(
      {
        asset: raw.studentAsset.asset,
        studentIncomingDataId: raw.studentIncomingDataId,
        description: raw.studentAsset.description,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    studentAssetData: StudentAssetData,
    studentAssetId: string,
  ): Prisma.StudentAssetDataUncheckedCreateInput {
    return {
      studentAssetId,
      studentIncomingDataId: studentAssetData.studentIncomingDataId,
    };
  }
}
