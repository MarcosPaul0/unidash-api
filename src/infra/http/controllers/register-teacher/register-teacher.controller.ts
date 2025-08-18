import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { RegisterTeacherUseCase } from '@/domain/application/use-cases/register-teacher/register-teacher';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

const registerTeacherBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type RegisterTeacherBodySchema = z.infer<typeof registerTeacherBodySchema>;

@Controller('/teachers')
export class RegisterTeacherController {
  constructor(private registerTeacher: RegisterTeacherUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerTeacherBodySchema))
    body: RegisterTeacherBodySchema,
  ) {
    const { name, email, password } = body;

    const result = await this.registerTeacher.execute({
      teacher: {
        email,
        name,
        password,
      },
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
