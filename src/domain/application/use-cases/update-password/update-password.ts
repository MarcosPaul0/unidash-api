import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/users-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Hasher } from '../../cryptography/hasher';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { User } from '@/domain/entities/user';

interface UpdatePasswordUseCaseRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

type UpdatePasswordUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User;
  }
>;

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    userId,
    newPassword,
    oldPassword,
  }: UpdatePasswordUseCaseRequest): Promise<UpdatePasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const isOldPasswordValid = await this.hasher.compare(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      return left(new NotAllowedError());
    }

    const hashedPassword = await this.hasher.hash(newPassword);

    user.password = hashedPassword;

    await this.usersRepository.save(user);

    return right({
      user,
    });
  }
}
