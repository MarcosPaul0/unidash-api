import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { RefreshTokenUseCase } from './refresh-token'
import { RefreshTokenInvalidError } from '../errors/refresh-token-invalid-error'

let encrypter: FakeEncrypter
let sut: RefreshTokenUseCase

describe('Refresh Token', () => {
  beforeEach(() => {
    encrypter = new FakeEncrypter()
    sut = new RefreshTokenUseCase(encrypter)
  })

  it('should be able to refresh token', async () => {
    const result = await sut.execute({
      refreshToken: 'fakeRefreshToken',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      newRefreshToken: expect.any(String),
    })
  })

  it('should not be able to refresh token if expired', async () => {
    encrypter.tokenIsExpired = true
    const result = await sut.execute({
      refreshToken: 'fakeRefreshToken',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(RefreshTokenInvalidError)
  })
})
