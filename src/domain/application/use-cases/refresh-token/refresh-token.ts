import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TokenEncrypter } from '../../cryptography/token-encrypter'
import { RefreshTokenInvalidError } from '../errors/refresh-token-invalid-error'

interface RefreshTokenUseCaseRequest {
  refreshToken: string
}

type RefreshTokenUseCaseResponse = Either<
  RefreshTokenInvalidError,
  {
    accessToken: string
    newRefreshToken: string
  }
>

@Injectable()
export class RefreshTokenUseCase {
  constructor(private encrypter: TokenEncrypter) {}

  async execute({
    refreshToken,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const payload = await this.encrypter.verifyToken(refreshToken)

    if (!payload?.sub) {
      return left(new RefreshTokenInvalidError())
    }

    const accessToken = await this.encrypter.generateAccessToken(payload)

    const newRefreshToken = await this.encrypter.generateRefreshToken(payload)

    return right({
      accessToken,
      newRefreshToken,
    })
  }
}
