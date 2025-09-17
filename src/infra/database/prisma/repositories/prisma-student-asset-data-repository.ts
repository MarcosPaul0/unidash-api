import { StudentAssetDataRepository } from '@/domain/application/repositories/student-asset-data-repository';
import { StudentAssetData } from '@/domain/entities/student-asset-data';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaStudentAssetDataMapper } from '../mappers/prisma-student-asset-data-mapper';
import { StudentAsset } from '@/domain/entities/student-asset';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

@Injectable()
export class PrismaStudentAssetDataRepository
  implements StudentAssetDataRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(studentAssetData: StudentAssetData[]): Promise<void> {
    await Promise.all(
      studentAssetData.map(async (data) => {
        const studentAsset = await this.prisma.studentAsset.findUniqueOrThrow({
          where: {
            asset: data.asset,
          },
        });

        const toCreate = PrismaStudentAssetDataMapper.toPrismaCreate(
          data,
          studentAsset.id,
        );

        return this.prisma.studentAssetData.create({
          data: toCreate,
        });
      }),
    );
  }

  async findAssetById(assetId: string): Promise<StudentAsset | null> {
    const studentAsset = await this.prisma.studentAsset.findUnique({
      where: {
        id: assetId,
      },
    });

    if (!studentAsset) {
      return null;
    }

    return StudentAsset.create(
      {
        asset: studentAsset.asset,
        description: studentAsset.description,
      },
      new UniqueEntityId(studentAsset.id),
    );
  }
}
