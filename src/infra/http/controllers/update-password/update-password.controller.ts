import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { UpdatePasswordUseCase } from '@/domain/application/use-cases/update-password/update-password';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const updatePasswordBodySchema = z.object({
  newPassword: z.string(),
  oldPassword: z.string(),
});

type UpdatePasswordBodySchema = z.infer<typeof updatePasswordBodySchema>;

@Controller('users/password')
export class UpdatePasswordController {
  constructor(private updatePasswordUseCase: UpdatePasswordUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() { sub: userId }: UserPayload,
    @Body(new ZodValidationPipe(updatePasswordBodySchema))
    body: UpdatePasswordBodySchema,
  ) {
    const { newPassword, oldPassword } = body;
    const result = await this.updatePasswordUseCase.execute({
      newPassword,
      oldPassword,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new ForbiddenException(error.message);
      }
    }
  }
}
