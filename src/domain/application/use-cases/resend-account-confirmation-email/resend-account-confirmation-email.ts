import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/users-repository';
import { NotificationSender } from '../../notification-sender/notification-sender';
import { AccountActivationTokensRepository } from '../../repositories/account-activation-tokens-repository';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { AccountAlreadyActivatedError } from '../errors/account-already-activated-error';
import { AccountActivationToken } from '@/domain/entities/account-activation-token';

interface ResendAccountConfirmationEmailUseCaseRequest {
  email: string;
}

type ResendAccountConfirmationEmailUseCaseResponse = Either<
  ResourceNotFoundError | AccountAlreadyActivatedError,
  Record<string, never>
>;

@Injectable()
export class ResendAccountConfirmationEmailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userAccountActivationTokensRepository: AccountActivationTokensRepository,
    private notificationSender: NotificationSender,
  ) {}

  async execute({
    email,
  }: ResendAccountConfirmationEmailUseCaseRequest): Promise<ResendAccountConfirmationEmailUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (user.accountActivatedAt) {
      return left(new AccountAlreadyActivatedError(user.email));
    }

    const accountActivationToken = AccountActivationToken.create({
      userId: user.id,
      token: randomUUID(),
      expiresAt: dayjs().add(1, 'd').toDate(),
    });

    await this.userAccountActivationTokensRepository.deleteManyByUserId(
      user.id.toString(),
    );

    await this.userAccountActivationTokensRepository.create(
      accountActivationToken,
    );

    this.notificationSender.sendAccountActivationNotification({
      activationToken: accountActivationToken.token,
      user,
    });

    return right({});
  }
}
