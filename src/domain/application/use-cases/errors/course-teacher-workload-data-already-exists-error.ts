import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseTeacherWorkloadDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course teacher workload data already exists.`);
  }
}
