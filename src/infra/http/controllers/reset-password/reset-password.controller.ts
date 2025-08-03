import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { ResetPasswordUseCase } from '@/domain/application/use-cases/reset-password/reset-password';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

const resetPasswordBodySchema = z.object({
  newPassword: z.string(),
  passwordResetToken: z.string(),
});

type ResetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>;

@Controller('/users/reset-password')
@Public()
export class ResetPasswordController {
  constructor(private resetPasswordUseCase: ResetPasswordUseCase) {}

  @Patch()
  @UsePipes(new ZodValidationPipe(resetPasswordBodySchema))
  async handle(@Body() body: ResetPasswordBodySchema) {
    const { newPassword, passwordResetToken } = body;

    const result = await this.resetPasswordUseCase.execute({
      newPassword,
      passwordResetToken,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
