import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { ValidateTokenUseCase } from './validate-token'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let encrypter: FakeEncrypter
let sut: ValidateTokenUseCase

describe('Validate Token', () => {
  beforeEach(() => {
    encrypter = new FakeEncrypter()

    sut = new ValidateTokenUseCase(encrypter)
  })

  it('should be able to return Ok if the token is valid', async () => {
    const result = await sut.execute({
      token: 'fake-token',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      message: 'Ok',
    })
  })

  it('should throw if the token is invalid', async () => {
    encrypter.tokenIsExpired = true

    const result = await sut.execute({
      token: 'fake-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(NotAllowedError)
  })
})
