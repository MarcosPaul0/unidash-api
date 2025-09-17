import { UseCaseError } from '@/core/errors/use-case-error';

export class TeacherResearchAndExtensionProjectsDataAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Teacher research and extension projects data already exists.`);
  }
}
