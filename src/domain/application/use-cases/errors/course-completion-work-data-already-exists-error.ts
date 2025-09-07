import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseCompletionWorkDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course completion work data already exists.`);
  }
}
