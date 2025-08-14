import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseCoordinationDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course coordination data already exists.`);
  }
}
