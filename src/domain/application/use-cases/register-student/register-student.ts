import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../../repositories/students-repository';
import { Hasher } from '../../cryptography/hasher';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { NotificationSender } from '../../notification-sender/notification-sender';
import { AccountActivationTokensRepository } from '../../repositories/account-activation-tokens-repository';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../repositories/users-repository';
import { Student, StudentType } from '@/domain/entities/student';
import { AccountActivationToken } from '@/domain/entities/account-activation-token';
import { User } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

interface RegisterStudentUseCaseRequest {
  student: {
    name: string;
    email: string;
    password: string;
    matriculation: string;
    courseId: string;
    type: StudentType;
  };
  sessionUser: User;
}

type RegisterStudentUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private studentsRepository: StudentsRepository,
    private userAccountActivationTokensRepository: AccountActivationTokensRepository,
    private hasher: Hasher,
    private notificationSender: NotificationSender,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    student: { name, email, password, matriculation, courseId, type },
    sessionUser,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureTeacherHasCoursePermission(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword = await this.hasher.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
      matriculation,
      courseId,
      type,
      role: 'student',
    });

    const accountActivationToken = AccountActivationToken.create({
      userId: student.id,
      token: randomUUID(),
      expiresAt: dayjs().add(1, 'd').toDate(),
    });

    await this.studentsRepository.create(student);

    await this.userAccountActivationTokensRepository.create(
      accountActivationToken,
    );

    this.notificationSender.sendAccountActivationNotification({
      activationToken: accountActivationToken.token,
      user: student,
    });

    return right({
      student,
    });
  }
}
