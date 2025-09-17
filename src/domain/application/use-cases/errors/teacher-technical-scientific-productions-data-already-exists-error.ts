import { UseCaseError } from '@/core/errors/use-case-error';

export class TeacherTechnicalScientificProductionsDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Teacher technical scientific productions data already exists.`);
  }
}
