import { UseCaseError } from '@/core/errors/use-case-error'

export class CityNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`City "${identifier}" was not found.`)
  }
}
