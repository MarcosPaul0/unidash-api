import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/users-repository';
import { NotificationSender } from '../../notification-sender/notification-sender';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { PasswordResetTokensRepository } from '../../repositories/password-reset-tokens-repository';
import { PasswordResetToken } from '@/domain/entities/password-reset-token';

interface SendPasswordResetEmailUseCaseRequest {
  email: string;
}

type SendPasswordResetEmailUseCaseResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>;

@Injectable()
export class SendPasswordResetEmailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
    private notificationSender: NotificationSender,
  ) {}

  async execute({
    email,
  }: SendPasswordResetEmailUseCaseRequest): Promise<SendPasswordResetEmailUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const passwordResetToken = PasswordResetToken.create({
      userId: user.id,
      token: randomUUID(),
      expiresAt: dayjs().add(1, 'd').toDate(),
    });

    await this.passwordResetTokensRepository.create(passwordResetToken);

    this.notificationSender.sendPasswordResetNotification({
      user,
      passwordResetToken: passwordResetToken.token,
    });

    return right({});
  }
}
