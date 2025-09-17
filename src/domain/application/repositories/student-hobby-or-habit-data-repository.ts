import { StudentHobbyOrHabit } from '@/domain/entities/student-hobby-or-habit';
import { StudentHobbyOrHabitData } from '@/domain/entities/student-hobby-or-habit-data';

export abstract class StudentHobbyOrHabitDataRepository {
  abstract createMany(
    studentHobbyOrHabitData: StudentHobbyOrHabitData[],
  ): Promise<void>;
  abstract findHobbyOrHabitById(
    hobbyOrHabitId: string,
  ): Promise<StudentHobbyOrHabit | null>;
}
