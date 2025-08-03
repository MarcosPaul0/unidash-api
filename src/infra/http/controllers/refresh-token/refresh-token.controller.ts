import { RefreshTokenUseCase } from '@/domain/application/use-cases/refresh-token/refresh-token';
import {
  Controller,
  HttpCode,
  Patch,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '@/infra/auth/public';

@Controller('/token/refresh')
export class RefreshTokenController {
  constructor(private refreshToken: RefreshTokenUseCase) {}

  @Patch()
  @HttpCode(200)
  @Public()
  async handle(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies.gdMarketRefreshToken;

    const result = await this.refreshToken.execute({
      refreshToken,
    });

    if (result.isLeft()) {
      const error = result.value;
      throw new UnauthorizedException(error.message);
    }

    const { accessToken, newRefreshToken } = result.value;

    response.cookie('gdMarketRefreshToken', newRefreshToken, {
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
