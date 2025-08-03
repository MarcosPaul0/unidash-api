import { SendPasswordResetEmailUseCase } from './send-password-reset-email';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { FakeNotificationSender } from 'test/notification-sender/fake-notification-sender';
import { MockInstance } from 'vitest';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { InMemoryPasswordResetTokensRepository } from 'test/repositories/in-memory-password-reset-tokens-repository';
import { SendPasswordResetNotificationParams } from '../../notification-sender/notification-sender';
import { USER_ACTION_TOKEN_TYPE } from '@/domain/entities/user-action-token';

let inMemoryUsersRepository: InMemoryUsersRepository;
let passwordResetTokensRepository: InMemoryPasswordResetTokensRepository;
let notificationSender: FakeNotificationSender;
let sendPasswordResetNotificationSpy: MockInstance<
  (request: SendPasswordResetNotificationParams) => Promise<void>
>;

let sut: SendPasswordResetEmailUseCase;

describe('Send Password Reset Email', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    passwordResetTokensRepository = new InMemoryPasswordResetTokensRepository();
    notificationSender = new FakeNotificationSender();

    sendPasswordResetNotificationSpy = vi.spyOn(
      notificationSender,
      'sendPasswordResetNotification',
    );

    sut = new SendPasswordResetEmailUseCase(
      inMemoryUsersRepository,
      passwordResetTokensRepository,
      notificationSender,
    );
  });

  it('should be able to send the password reset email to the user', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      name: 'John Doe',
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@example.com',
    });

    expect(result.isRight()).toBe(true);
    expect(sendPasswordResetNotificationSpy).toHaveBeenCalledOnce();
    expect(sendPasswordResetNotificationSpy).toHaveBeenCalledWith({
      passwordResetToken: expect.any(String),
      user: expect.objectContaining({
        email: 'johndoe@example.com',
        name: 'John Doe',
      }),
    });

    expect(passwordResetTokensRepository.items[0]).toEqual(
      expect.objectContaining({
        expiresAt: expect.any(Date),
        token: expect.any(String),
        actionType: USER_ACTION_TOKEN_TYPE.passwordReset,
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
});
