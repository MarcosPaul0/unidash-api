import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PasswordResetTokensRepository } from '@/domain/application/repositories/password-reset-tokens-repository';
import { PrismaPasswordResetTokenMapper } from '../mappers/prisma-password-reset-token-mapper';
import { PasswordResetToken } from '@/domain/entities/password-reset-token';

@Injectable()
export class PrismaPasswordResetTokensRepository
  implements PasswordResetTokensRepository
{
  constructor(private prisma: PrismaService) {}

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const accountActivationToken = await this.prisma.userActionToken.findUnique(
      {
        where: {
          token,
          actionType: 'passwordReset',
        },
      },
    );

    if (!accountActivationToken) {
      return null;
    }

    return PrismaPasswordResetTokenMapper.toDomain(accountActivationToken);
  }

  async create(passwordResetToken: PasswordResetToken): Promise<void> {
    const data = PrismaPasswordResetTokenMapper.toPrisma(passwordResetToken);

    await this.prisma.userActionToken.create({
      data,
    });
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.prisma.userActionToken.deleteMany({
      where: {
        userId,
        actionType: 'passwordReset',
      },
    });
  }
}
