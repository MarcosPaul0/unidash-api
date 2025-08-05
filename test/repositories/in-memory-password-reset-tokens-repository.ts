import { PasswordResetTokensRepository } from '@/domain/application/repositories/password-reset-tokens-repository';
import { PasswordResetToken } from '@/domain/entities/password-reset-token';

export class InMemoryPasswordResetTokensRepository
  implements PasswordResetTokensRepository
{
  public items: PasswordResetToken[] = [];

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = this.items.find(
      (item) => item.token === token && item.actionType === 'passwordReset',
    );

    if (!passwordResetToken) {
      return null;
    }

    return passwordResetToken;
  }

  async create(passwordResetToken: PasswordResetToken): Promise<void> {
    this.items.push(passwordResetToken);
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    this.items = this.items.filter(
      (token) =>
        token.userId.toString() !== userId &&
        token.actionType === 'passwordReset',
    );
  }
}
