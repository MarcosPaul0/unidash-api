import { StudentUniversityChoiceReason } from '@/domain/entities/student-university-choice-reason';
import { StudentUniversityChoiceReasonData } from '@/domain/entities/student-university-choice-reason-data';

export abstract class StudentUniversityChoiceReasonDataRepository {
  abstract createMany(
    studentUniversityChoiceReasonData: StudentUniversityChoiceReasonData[],
  ): Promise<void>;
  abstract findUniversityChoiceReasonById(
    universityChoiceReasonId: string,
  ): Promise<StudentUniversityChoiceReason | null>;
}
