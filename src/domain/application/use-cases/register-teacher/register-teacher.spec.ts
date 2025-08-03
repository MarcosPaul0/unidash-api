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

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryTeachersRepository: InMemoryTeachersRepository;
let inMemoryAccountActivationTokensRepository: InMemoryAccountActivationTokensRepository;
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
    );
  });

  it('should be able to register a new teacher', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacher: inMemoryTeachersRepository.items[0],
    });
  });

  it('should hash teacher password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryTeachersRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });

  it('should not be able to register a new teacher if the email already exists', async () => {
    const teacher = makeTeacher({
      email: 'johnDoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryTeachersRepository.items.push(teacher);
    inMemoryUsersRepository.items.push(teacher);

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(UserAlreadyExistsError);
  });

  it('should send an email of account activation when an teacher register', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456',
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
