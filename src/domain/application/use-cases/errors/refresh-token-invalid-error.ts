import { UseCaseError } from '@/core/errors/use-case-error'

export class RefreshTokenInvalidError extends Error implements UseCaseError {
  constructor() {
    super(`Refresh token is invalid`)
  }
}
