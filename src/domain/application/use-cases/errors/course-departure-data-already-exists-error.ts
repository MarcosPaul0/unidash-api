import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseDepartureDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course departure data already exists.`);
  }
}
