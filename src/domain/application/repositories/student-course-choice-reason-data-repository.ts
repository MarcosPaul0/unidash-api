import { StudentCourseChoiceReason } from '@/domain/entities/student-course-choice-reason';
import { StudentCourseChoiceReasonData } from '@/domain/entities/student-course-choice-reason-data';

export abstract class StudentCourseChoiceReasonDataRepository {
  abstract createMany(
    studentCourseChoiceReasonData: StudentCourseChoiceReasonData[],
  ): Promise<void>;
  abstract findCourseChoiceReasonById(
    courseChoiceReasonId: string,
  ): Promise<StudentCourseChoiceReason | null>;
}
