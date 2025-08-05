import { AccountActivationTokensRepository } from '@/domain/application/repositories/account-activation-tokens-repository';
import { AccountActivationToken } from '@/domain/entities/account-activation-token';

export class InMemoryAccountActivationTokensRepository
  implements AccountActivationTokensRepository
{
  public items: AccountActivationToken[] = [];

  async findByToken(token: string): Promise<AccountActivationToken | null> {
    const accountActivationToken = this.items.find(
      (item) =>
        item.token === token && item.actionType === 'accountConfirmation',
    );

    if (!accountActivationToken) {
      return null;
    }

    return accountActivationToken;
  }

  async create(accountActivationToken: AccountActivationToken): Promise<void> {
    this.items.push(accountActivationToken);
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    this.items = this.items.filter(
      (token) =>
        token.userId.toString() !== userId &&
        token.actionType === 'accountConfirmation',
    );
  }
}
