import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/users-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { AccountActivationTokensRepository } from '../../repositories/account-activation-tokens-repository';
import dayjs from 'dayjs';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { User } from '@/domain/entities/user';

interface AccountActivationUseCaseRequest {
  activationToken: string;
}

type AccountActivationUseCaseResponse = Either<
  ResourceNotFoundError | InvalidTokenError,
  {
    user: User;
  }
>;

@Injectable()
export class AccountActivationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userAccountActivationTokensRepository: AccountActivationTokensRepository,
  ) {}

  async execute({
    activationToken,
  }: AccountActivationUseCaseRequest): Promise<AccountActivationUseCaseResponse> {
    const accountActivationToken =
      await this.userAccountActivationTokensRepository.findByToken(
        activationToken,
      );

    if (!accountActivationToken) {
      return left(new InvalidTokenError());
    }

    const isTokenExpired = dayjs(accountActivationToken.expiresAt).isBefore(
      new Date(),
    );

    if (isTokenExpired) {
      return left(new InvalidTokenError());
    }

    const user = await this.usersRepository.findById(
      accountActivationToken.userId.toString(),
    );

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    user.accountActivatedAt = new Date();

    await this.usersRepository.save(user);

    await this.userAccountActivationTokensRepository.deleteManyByUserId(
      user.id.toString(),
    );

    return right({
      user,
    });
  }
}
