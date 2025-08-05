import { RegisterTeacherUseCase } from './register-teacher';
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { InMemoryAccountActivationTokensRepository } from 'test/repositories/in-memory-account-activation-tokens-repository';
import { FakeNotificationSender } from 'test/notification-sender/fake-notification-sender';
import { MockInstance } from 'vitest';
import { makeTeacher } from 'test/factories/make-teacher';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { SendAccountActivationNotificationParams } from '../../notification-sender/notification-sender';
import { USER_ACTION_TOKEN_TYPE } from '@/domain/entities/user-action-token';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeUser } from 'test/factories/make-user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryTeachersRepository: InMemoryTeachersRepository;
let inMemoryAccountActivationTokensRepository: InMemoryAccountActivationTokensRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let fakeHasher: FakeHasher;
let notificationSender: FakeNotificationSender;
let sendAccountActivationNotificationSpy: MockInstance<
  (request: SendAccountActivationNotificationParams) => Promise<void>
>;

let sut: RegisterTeacherUseCase;

describe('Register Teacher', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryTeachersRepository = new InMemoryTeachersRepository();

    inMemoryAccountActivationTokensRepository =
      new InMemoryAccountActivationTokensRepository();

    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();

    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    fakeHasher = new FakeHasher();

    notificationSender = new FakeNotificationSender();

    sendAccountActivationNotificationSpy = vi.spyOn(
      notificationSender,
      'sendAccountActivationNotification',
    );

    sut = new RegisterTeacherUseCase(
      inMemoryUsersRepository,
      inMemoryTeachersRepository,
      inMemoryAccountActivationTokensRepository,
      fakeHasher,
      notificationSender,
      authorizationService,
    );
  });

  it('should be able to register a new teacher', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'admin',
    });

    const result = await sut.execute({
      teacher: {
        name: 'John Doe',
        email: 'johnDoe@example.com',
        password: '123456',
      },
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacher: inMemoryTeachersRepository.teachers[0],
    });
  });

  it('should hash teacher password upon registration', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'admin',
    });

    const result = await sut.execute({
      teacher: {
        name: 'John Doe',
        email: 'johnDoe@example.com',
        password: '123456',
      },
      sessionUser: adminUser,
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryTeachersRepository.teachers[0].password).toEqual(
      hashedPassword,
    );
  });

  it('should not be able to register a new teacher if session user is not admin', async () => {
    const teacherUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'teacher',
    });

    const result = await sut.execute({
      teacher: {
        name: 'John Doe',
        email: 'johnDoe@example.com',
        password: '123456',
      },
      sessionUser: teacherUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register a new teacher if the email already exists', async () => {
    const teacher = makeTeacher({
      email: 'johnDoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryTeachersRepository.teachers.push(teacher);
    inMemoryUsersRepository.items.push(teacher);

    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'admin',
    });

    const result = await sut.execute({
      teacher: {
        name: 'John Doe',
        email: 'johnDoe@example.com',
        password: '123456',
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(UserAlreadyExistsError);
  });

  it('should send an email of account activation when an teacher register', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'admin',
    });

    await sut.execute({
      teacher: {
        name: 'John Doe',
        email: 'johnDoe@example.com',
        password: '123456',
      },
      sessionUser: adminUser,
    });

    expect(sendAccountActivationNotificationSpy).toHaveBeenCalledOnce();
    expect(sendAccountActivationNotificationSpy).toHaveBeenCalledWith({
      activationToken: expect.any(String),
      user: expect.objectContaining({
        name: 'John Doe',
        email: 'johnDoe@example.com',
      }),
    });

    expect(inMemoryAccountActivationTokensRepository.items[0]).toEqual(
      expect.objectContaining({
        expiresAt: expect.any(Date),
        token: expect.any(String),
        actionType: USER_ACTION_TOKEN_TYPE.accountConfirmation,
      }),
    );
  });
});
