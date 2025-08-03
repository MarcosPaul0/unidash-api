import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AccountActivationTokensRepository } from '@/domain/application/repositories/account-activation-tokens-repository';
import { PrismaAccountActivationTokenMapper } from '../mappers/prisma-account-activation-token-mapper';
import { AccountActivationToken } from '@/domain/entities/account-activation-token';

@Injectable()
export class PrismaAccountActivationTokensRepository
  implements AccountActivationTokensRepository
{
  constructor(private prisma: PrismaService) {}

  async findByToken(token: string): Promise<AccountActivationToken | null> {
    const accountActivationToken = await this.prisma.userActionToken.findUnique(
      {
        where: {
          token,
          actionType: 'accountConfirmation',
        },
      },
    );

    if (!accountActivationToken) {
      return null;
    }

    return PrismaAccountActivationTokenMapper.toDomain(accountActivationToken);
  }

  async create(accountActivationToken: AccountActivationToken): Promise<void> {
    const data = PrismaAccountActivationTokenMapper.toPrisma(
      accountActivationToken,
    );

    await this.prisma.userActionToken.create({
      data,
    });
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.prisma.userActionToken.deleteMany({
      where: {
        userId,
        actionType: 'accountConfirmation',
      },
    });
  }
}
