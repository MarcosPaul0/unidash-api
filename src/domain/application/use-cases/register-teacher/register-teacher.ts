import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { TeachersRepository } from '../../repositories/teacher-repository';
import { Hasher } from '../../cryptography/hasher';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { NotificationSender } from '../../notification-sender/notification-sender';
import { AccountActivationTokensRepository } from '../../repositories/account-activation-tokens-repository';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UsersRepository } from '../../repositories/users-repository';
import { Teacher } from '@/domain/entities/teacher';
import { AccountActivationToken } from '@/domain/entities/account-activation-token';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

interface RegisterTeacherUseCaseRequest {
  teacher: {
    name: string;
    email: string;
    password: string;
  };
  sessionUser: SessionUser;
}

type RegisterTeacherUseCaseResponse = Either<
  UserAlreadyExistsError | NotAllowedError,
  {
    teacher: Teacher;
  }
>;

@Injectable()
export class RegisterTeacherUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private teachersRepository: TeachersRepository,
    private userAccountActivationTokensRepository: AccountActivationTokensRepository,
    private hasher: Hasher,
    private notificationSender: NotificationSender,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacher: { email, name, password },
    sessionUser,
  }: RegisterTeacherUseCaseRequest): Promise<RegisterTeacherUseCaseResponse> {
    const authorizationResponse =
      await this.authorizationService.ensureUserRole(sessionUser, ['admin']);

    if (authorizationResponse.isLeft()) {
      return left(authorizationResponse.value);
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword = await this.hasher.hash(password);

    const teacherCreated = Teacher.create({
      name,
      email,
      password: hashedPassword,
      role: 'teacher',
      isActive: true,
    });

    const accountActivationToken = AccountActivationToken.create({
      userId: teacherCreated.id,
      token: randomUUID(),
      expiresAt: dayjs().add(1, 'd').toDate(),
    });

    await this.teachersRepository.create(teacherCreated);

    await this.userAccountActivationTokensRepository.create(
      accountActivationToken,
    );

    this.notificationSender.sendAccountActivationNotification({
      activationToken: accountActivationToken.token,
      user: teacherCreated,
    });

    return right({
      teacher: teacherCreated,
    });
  }
}
