import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseSearchComplementaryActivitiesDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Course search complementary activities data already exists.`);
  }
}
