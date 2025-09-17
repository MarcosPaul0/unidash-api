import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseInternshipDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course internship data already exists.`);
  }
}
