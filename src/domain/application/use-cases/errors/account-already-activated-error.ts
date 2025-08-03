import { UseCaseError } from '@/core/errors/use-case-error'

export class AccountAlreadyActivatedError
  extends Error
  implements UseCaseError
{
  constructor(email: string) {
    super(`Account with email '${email}' is already activated.`)
  }
}
