import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseStudentsDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course students data already exists.`);
  }
}
