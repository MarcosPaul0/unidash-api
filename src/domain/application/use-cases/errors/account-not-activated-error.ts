import { UseCaseError } from '@/core/errors/use-case-error'

export class AccountNotActivatedError extends Error implements UseCaseError {
  constructor() {
    super('Account is not activated.')
  }
}
