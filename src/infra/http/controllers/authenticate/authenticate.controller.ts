import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user/authenticate-user';
import { WrongCredentialsError } from '@/domain/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';
import { Response } from 'express';
import { EnvService } from '@/infra/env/env.service';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(
    private authenticateUser: AuthenticateUserUseCase,
    private envService: EnvService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateBodySchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken, refreshToken } = result.value;

    response.cookie(this.envService.get('REFRESH_TOKEN_COOKIE'), refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    });

    return {
      accessToken,
    };
  }
}
