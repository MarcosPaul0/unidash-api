import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { TokenEncrypter } from '../../cryptography/token-encrypter'

interface ValidateTokenUseCaseRequest {
  token: string
}

type ValidateTokenUseCaseResponse = Either<
  NotAllowedError,
  {
    message: string
  }
>

@Injectable()
export class ValidateTokenUseCase {
  constructor(private encrypter: TokenEncrypter) {}

  async execute({
    token,
  }: ValidateTokenUseCaseRequest): Promise<ValidateTokenUseCaseResponse> {
    const result = await this.encrypter.verifyToken(token)

    if (!result) {
      return left(new NotAllowedError())
    }

    return right({
      message: 'Ok',
    })
  }
}
