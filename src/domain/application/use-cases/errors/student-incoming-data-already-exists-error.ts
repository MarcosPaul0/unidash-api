import { UseCaseError } from '@/core/errors/use-case-error';

export class StudentIncomingDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Student incoming data already exists.`);
  }
}
