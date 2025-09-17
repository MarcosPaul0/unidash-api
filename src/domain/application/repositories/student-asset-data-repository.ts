import { StudentAsset } from '@/domain/entities/student-asset';
import { StudentAssetData } from '@/domain/entities/student-asset-data';

export abstract class StudentAssetDataRepository {
  abstract createMany(studentAssetData: StudentAssetData[]): Promise<void>;
  abstract findAssetById(assetId: string): Promise<StudentAsset | null>;
}
