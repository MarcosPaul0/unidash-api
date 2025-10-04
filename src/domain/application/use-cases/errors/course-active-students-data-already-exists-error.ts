import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseActiveStudentsDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course active students data already exists.`);
  }
}
