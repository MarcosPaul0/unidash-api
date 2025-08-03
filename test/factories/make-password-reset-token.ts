import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import dayjs from 'dayjs';
import { PrismaPasswordResetTokenMapper } from '@/infra/database/prisma/mappers/prisma-password-reset-token-mapper';
import { randomUUID } from 'crypto';
import {
  PasswordResetToken,
  PasswordResetTokenProps,
} from '@/domain/entities/password-reset-token';

export function makePasswordResetToken(
  override: Partial<PasswordResetTokenProps> = {},
  id?: UniqueEntityId,
) {
  const passwordResetToken = PasswordResetToken.create(
    {
      userId: new UniqueEntityId(),
      expiresAt: dayjs().add(1, 'd').toDate(),
      token: randomUUID(),
      ...override,
    },
    id,
  );

  return passwordResetToken;
}

@Injectable()
export class PasswordResetTokenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPasswordResetToken(
    data: Partial<PasswordResetTokenProps> = {},
  ): Promise<PasswordResetToken> {
    const passwordResetToken = makePasswordResetToken(data);

    await this.prisma.userActionToken.create({
      data: PrismaPasswordResetTokenMapper.toPrisma(passwordResetToken),
    });

    return passwordResetToken;
  }
}
