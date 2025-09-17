import { StudentTechnology } from '@/domain/entities/student-technology';
import { StudentTechnologyData } from '@/domain/entities/student-technology-data';

export abstract class StudentTechnologyDataRepository {
  abstract createMany(
    studentTechnologyData: StudentTechnologyData[],
  ): Promise<void>;
  abstract findTechnologyById(
    technologyId: string,
  ): Promise<StudentTechnology | null>;
}
