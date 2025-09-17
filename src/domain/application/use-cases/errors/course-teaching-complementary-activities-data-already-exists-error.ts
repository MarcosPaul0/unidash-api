import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseTeachingComplementaryActivitiesDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course teaching complementary activities data already exists.`);
  }
}
