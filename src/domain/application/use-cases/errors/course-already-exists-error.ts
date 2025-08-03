import { UseCaseError } from '@/core/errors/use-case-error';

export class CourseAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Course '${identifier}' already exists.`);
  }
}
