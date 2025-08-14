import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseRegistrationLockDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course registration lock data already exists.`);
  }
}
