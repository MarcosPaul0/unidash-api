import {
  UserActionToken as PrismaUserActionToken,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PasswordResetToken } from '@/domain/entities/password-reset-token';

export class PrismaPasswordResetTokenMapper {
  static toDomain(raw: PrismaUserActionToken): PasswordResetToken {
    return PasswordResetToken.create(
      {
        expiresAt: raw.expiresAt,
        token: raw.token,
        userId: new UniqueEntityId(raw.userId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(
    passwordResetToken: PasswordResetToken,
  ): Prisma.UserActionTokenUncheckedCreateInput {
    return {
      id: passwordResetToken.id.toString(),
      actionType: passwordResetToken.actionType,
      token: passwordResetToken.token,
      userId: passwordResetToken.userId.toString(),
      expiresAt: passwordResetToken.expiresAt,
      createdAt: passwordResetToken.createdAt,
    };
  }
}
