import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseExtensionComplementaryActivitiesDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course extension complementary activities data already exists.`);
  }
}
