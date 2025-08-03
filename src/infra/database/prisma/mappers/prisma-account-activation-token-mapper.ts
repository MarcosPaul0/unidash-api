import {
  UserActionToken as PrismaUserActionToken,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AccountActivationToken } from '@/domain/entities/account-activation-token';

export class PrismaAccountActivationTokenMapper {
  static toDomain(raw: PrismaUserActionToken): AccountActivationToken {
    return AccountActivationToken.create(
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
    accountActivationToken: AccountActivationToken,
  ): Prisma.UserActionTokenUncheckedCreateInput {
    return {
      id: accountActivationToken.id.toString(),
      actionType: accountActivationToken.actionType,
      token: accountActivationToken.token,
      userId: accountActivationToken.userId.toString(),
      expiresAt: accountActivationToken.expiresAt,
      createdAt: accountActivationToken.createdAt,
    };
  }
}
