import { AccountActivationUseCase } from './account-activation';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeUser } from 'test/factories/make-user';
import { InMemoryAccountActivationTokensRepository } from 'test/repositories/in-memory-account-activation-tokens-repository';
import { makeAccountActivationToken } from 'test/factories/make-account-activation-token';
import { InvalidTokenError } from '../errors/invalid-token-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAccountActivationTokensRepository: InMemoryAccountActivationTokensRepository;
let fakeHasher: FakeHasher;

let sut: AccountActivationUseCase;

describe('Account Activation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAccountActivationTokensRepository =
      new InMemoryAccountActivationTokensRepository();

    fakeHasher = new FakeHasher();

    sut = new AccountActivationUseCase(
      inMemoryUsersRepository,
      inMemoryAccountActivationTokensRepository,
    );
  });

  it('should be able to activate the user account', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryUsersRepository.items.push(user);

    const accountActivationToken = makeAccountActivationToken({
      userId: user.id,
      token: '123',
    });

    inMemoryAccountActivationTokensRepository.items.push(
      accountActivationToken,
    );

    const result = await sut.execute({
      activationToken: '123',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
    expect(inMemoryUsersRepository.items[0].accountActivatedAt).toEqual(
      expect.any(Date),
    );
    expect(inMemoryAccountActivationTokensRepository.items).toHaveLength(0);
  });

  it('should not be able to activate the user account if the token is not found', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      activationToken: '123',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(InvalidTokenError);
    expect(inMemoryUsersRepository.items[0].accountActivatedAt).toBeFalsy();
  });

  it('should not be able to activate the user account if the token is expired', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryUsersRepository.items.push(user);

    const accountActivationToken = makeAccountActivationToken({
      userId: user.id,
      expiresAt: new Date(2022, 0, 20),
      token: '123',
    });

    inMemoryAccountActivationTokensRepository.items.push(
      accountActivationToken,
    );

    const result = await sut.execute({
      activationToken: '123',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(InvalidTokenError);
    expect(inMemoryUsersRepository.items[0].accountActivatedAt).toBeFalsy();
  });
});
