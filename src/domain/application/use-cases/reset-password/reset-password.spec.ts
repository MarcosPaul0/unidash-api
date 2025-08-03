import { ResetPasswordUseCase } from './reset-password'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryPasswordResetTokensRepository } from 'test/repositories/in-memory-password-reset-tokens-repository'
import { makePasswordResetToken } from 'test/factories/make-password-reset-token'
import { InvalidTokenError } from '../errors/invalid-token-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryPasswordResetTokensRepository: InMemoryPasswordResetTokensRepository
let fakeHasher: FakeHasher

let sut: ResetPasswordUseCase

describe('Reset Password', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryPasswordResetTokensRepository =
      new InMemoryPasswordResetTokensRepository()
    fakeHasher = new FakeHasher()

    sut = new ResetPasswordUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      inMemoryPasswordResetTokensRepository,
    )
  })

  it('should be able to reset password', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const resetPasswordToken = makePasswordResetToken({
      userId: user.id,
      token: '123',
    })

    inMemoryPasswordResetTokensRepository.items.push(resetPasswordToken)

    const result = await sut.execute({
      passwordResetToken: '123',
      newPassword: '123123',
    })

    const hashedPassword = await fakeHasher.hash('123123')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
    expect(inMemoryPasswordResetTokensRepository.items).toHaveLength(0)
  })

  it('should not be able to reset password if the token is not found', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      newPassword: '123123',
      passwordResetToken: '123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(InvalidTokenError)
  })

  it('should not be able to reset password if the token is expired', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const resetPasswordToken = makePasswordResetToken({
      userId: user.id,
      expiresAt: new Date(2022, 0, 20),
      token: '123',
    })

    inMemoryPasswordResetTokensRepository.items.push(resetPasswordToken)

    const result = await sut.execute({
      passwordResetToken: '123',
      newPassword: '123123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(InvalidTokenError)
  })
})
