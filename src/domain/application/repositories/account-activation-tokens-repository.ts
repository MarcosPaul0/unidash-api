import { AccountActivationToken } from '../../entities/account-activation-token'

export abstract class AccountActivationTokensRepository {
  abstract findByToken(token: string): Promise<AccountActivationToken | null>

  abstract create(accountActivationToken: AccountActivationToken): Promise<void>

  abstract deleteManyByUserId(userId: string): Promise<void>
}
