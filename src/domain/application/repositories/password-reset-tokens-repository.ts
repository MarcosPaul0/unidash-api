import { PasswordResetToken } from '../../entities/password-reset-token'

export abstract class PasswordResetTokensRepository {
  abstract findByToken(token: string): Promise<PasswordResetToken | null>

  abstract create(passwordResetToken: PasswordResetToken): Promise<void>

  abstract deleteManyByUserId(userId: string): Promise<void>
}
