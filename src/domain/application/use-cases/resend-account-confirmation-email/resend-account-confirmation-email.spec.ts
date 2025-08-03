import { ResendAccountConfirmationEmailUseCase } from './resend-account-confirmation-email';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { InMemoryAccountActivationTokensRepository } from 'test/repositories/in-memory-account-activation-tokens-repository';
import { FakeNotificationSender } from 'test/notification-sender/fake-notification-sender';
import { MockInstance } from 'vitest';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { SendAccountActivationNotificationParams } from '../../notification-sender/notification-sender';
import { USER_ACTION_TOKEN_TYPE } from '@/domain/entities/user-action-token';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAccountActivationTokensRepository: InMemoryAccountActivationTokensRepository;
let NotificationSender: FakeNotificationSender;
let sendAccountActivationNotificationSpy: MockInstance<
  (request: SendAccountActivationNotificationParams) => Promise<void>
>;

let sut: ResendAccountConfirmationEmailUseCase;

describe('Resend Account Confirmation Email', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAccountActivationTokensRepository =
      new InMemoryAccountActivationTokensRepository();
    NotificationSender = new FakeNotificationSender();

    sendAccountActivationNotificationSpy = vi.spyOn(
      NotificationSender,
      'sendAccountActivationNotification',
    );

    sut = new ResendAccountConfirmationEmailUseCase(
      inMemoryUsersRepository,
      inMemoryAccountActivationTokensRepository,
      NotificationSender,
    );
  });

  it('should be able to resend the account confirmation email to the user', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      name: 'John Doe',
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@example.com',
    });

    expect(result.isRight()).toBe(true);
    expect(sendAccountActivationNotificationSpy).toHaveBeenCalledOnce();
    expect(sendAccountActivationNotificationSpy).toHaveBeenCalledWith({
      activationToken: expect.any(String),
      user: expect.objectContaining({
        email: 'johndoe@example.com',
        name: 'John Doe',
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

  it('should not be able to resend the account confirmation email if the user is not found', async () => {
    const result = await sut.execute({
      email: 'not.found.user@example.com',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to resend the account confirmation email if the user account is activated', async () => {
    makeUser({
      email: 'johndoe@example.com',
      accountActivatedAt: new Date(),
    });

    const result = await sut.execute({
      email: 'johndoe@example.com',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });
});
