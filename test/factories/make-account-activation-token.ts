import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import dayjs from 'dayjs';
import { PrismaAccountActivationTokenMapper } from '@/infra/database/prisma/mappers/prisma-account-activation-token-mapper';
import { randomUUID } from 'crypto';
import {
  AccountActivationToken,
  AccountActivationTokenProps,
} from '@/domain/entities/account-activation-token';

export function makeAccountActivationToken(
  override: Partial<AccountActivationTokenProps> = {},
  id?: UniqueEntityId,
) {
  const accountActivationToken = AccountActivationToken.create(
    {
      userId: new UniqueEntityId(),
      expiresAt: dayjs().add(1, 'd').toDate(),
      token: randomUUID(),
      ...override,
    },
    id,
  );

  return accountActivationToken;
}

@Injectable()
export class AccountActivationTokenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAccountActivationToken(
    data: Partial<AccountActivationTokenProps> = {},
  ): Promise<AccountActivationToken> {
    const accountActivationToken = makeAccountActivationToken(data);

    await this.prisma.userActionToken.create({
      data: PrismaAccountActivationTokenMapper.toPrisma(accountActivationToken),
    });

    return accountActivationToken;
  }
}
