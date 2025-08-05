import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/users-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { PasswordResetTokensRepository } from '../../repositories/password-reset-tokens-repository';
import dayjs from 'dayjs';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { Hasher } from '../../cryptography/hasher';
import { User } from '@/domain/entities/user';

interface ResetPasswordUseCaseRequest {
  passwordResetToken: string;
  newPassword: string;
}

type ResetPasswordUseCaseResponse = Either<
  ResourceNotFoundError | InvalidTokenError,
  {
    user: User;
  }
>;

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
  ) {}

  async execute({
    passwordResetToken,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const resetPasswordToken =
      await this.passwordResetTokensRepository.findByToken(passwordResetToken);

    console.log({ resetPasswordToken });

    if (!resetPasswordToken) {
      return left(new InvalidTokenError());
    }

    const isTokenExpired = dayjs(resetPasswordToken.expiresAt).isBefore(
      new Date(),
    );

    if (isTokenExpired) {
      return left(new InvalidTokenError());
    }

    const user = await this.usersRepository.findById(
      resetPasswordToken.userId.toString(),
    );

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const hashedPassword = await this.hasher.hash(newPassword);

    user.password = hashedPassword;

    await this.usersRepository.save(user);

    await this.passwordResetTokensRepository.deleteManyByUserId(
      user.id.toString(),
    );

    return right({
      user,
    });
  }
}
