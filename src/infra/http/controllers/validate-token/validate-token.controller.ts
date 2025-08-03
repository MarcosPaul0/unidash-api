import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ValidateTokenUseCase } from '@/domain/application/use-cases/validate-token/validate-token';
import { Request } from 'express';

@Controller('/validate-token')
export class ValidateTokenController {
  constructor(private validateTokenUseCase: ValidateTokenUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] as string;

    const result = await this.validateTokenUseCase.execute({
      token,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new ForbiddenException(error.message);
    }
  }
}
