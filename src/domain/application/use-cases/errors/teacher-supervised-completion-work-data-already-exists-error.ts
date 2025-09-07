import { UseCaseError } from '@/core/errors/use-case-error';

export class TeacherSupervisedCompletionWorkDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Teacher supervised completion work data already exists.`);
  }
}
