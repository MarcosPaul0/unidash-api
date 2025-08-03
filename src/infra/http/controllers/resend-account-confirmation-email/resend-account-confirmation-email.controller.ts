import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ResendAccountConfirmationEmailUseCase } from '@/domain/application/use-cases/resend-account-confirmation-email/resend-account-confirmation-email';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';

const resendAccountConfirmationEmailBodySchema = z.object({
  email: z.string().email(),
});

type ResendAccountConfirmationEmailBodySchema = z.infer<
  typeof resendAccountConfirmationEmailBodySchema
>;

@Controller('/resend-confirmation-email')
@Public()
export class ResendAccountConfirmationEmailController {
  constructor(
    private resendAccountConfirmationEmail: ResendAccountConfirmationEmailUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(resendAccountConfirmationEmailBodySchema))
  async handle(@Body() body: ResendAccountConfirmationEmailBodySchema) {
    const { email } = body;

    const result = await this.resendAccountConfirmationEmail.execute({
      email,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }
  }
}
