import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidTokenError extends Error implements UseCaseError {
  constructor() {
    super(`The token is invalid`)
  }
}
