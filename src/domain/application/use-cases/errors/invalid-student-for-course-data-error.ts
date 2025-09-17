import { UseCaseError } from '@/core/errors/use-case-error';

export class InvalidStudentForCourseDataError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Invalid student for course data.`);
  }
}
