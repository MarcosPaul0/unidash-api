import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseExtensionActivitiesDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course extension activities data already exists.`);
  }
}
