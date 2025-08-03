import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { SendPasswordResetEmailUseCase } from '@/domain/application/use-cases/send-password-reset-email/send-password-reset-email';
import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';

const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordBodySchema = z.infer<typeof forgotPasswordBodySchema>;

@Controller('/forgot-password')
@Public()
export class ForgotPasswordController {
  constructor(private sendPasswordResetEmail: SendPasswordResetEmailUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(forgotPasswordBodySchema))
  async handle(@Body() body: ForgotPasswordBodySchema) {
    const { email } = body;

    const result = await this.sendPasswordResetEmail.execute({
      email,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new NotFoundException(error.message);
    }
  }
}
