import { StudentAffinityByDisciplineData } from '@/domain/entities/student-affinity-by-discipline-data';

export abstract class StudentAffinityByDisciplineDataRepository {
  abstract createMany(
    studentAffinityByDisciplineData: StudentAffinityByDisciplineData[],
  ): Promise<void>;
}
