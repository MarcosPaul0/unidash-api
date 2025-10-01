import { UseCaseError } from '@/core/errors/use-case-error';

export class CityNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`City was not found.`);
  }
}
