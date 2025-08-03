import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Hasher } from '../../cryptography/hasher';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { UsersRepository } from '../../repositories/users-repository';
import { AdminsRepository } from '../../repositories/admins-repository';
import { User } from '@/domain/entities/user';
import { Admin } from '@/domain/entities/admin';

interface RegisterAdminUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterAdminUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    admin: User;
  }
>;

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword = await this.hasher.hash(password);

    const admin = Admin.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      accountActivatedAt: new Date(),
    });

    await this.adminsRepository.create(admin);

    return right({
      admin,
    });
  }
}
