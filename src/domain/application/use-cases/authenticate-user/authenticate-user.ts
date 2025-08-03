import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../../repositories/users-repository'
import { Hasher } from '../../cryptography/hasher'
import { TokenEncrypter } from '../../cryptography/token-encrypter'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
    refreshToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
    private encrypter: TokenEncrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hasher.compare(password, user.password)

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.generateAccessToken({
      sub: user.id.toString(),
      userRole: user.role,
    })

    const refreshToken = await this.encrypter.generateRefreshToken({
      sub: user.id.toString(),
      userRole: user.role,
    })

    return right({
      accessToken,
      refreshToken,
    })
  }
}
