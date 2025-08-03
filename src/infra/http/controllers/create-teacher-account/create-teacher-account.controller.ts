import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { RegisterTeacherUseCase } from '@/domain/application/use-cases/register-teacher/register-teacher';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { User } from '@/domain/entities/user';

const createTeacherAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateTeacherAccountBodySchema = z.infer<
  typeof createTeacherAccountBodySchema
>;

@Controller('/teachers/account')
export class CreateTeacherAccountController {
  constructor(private registerTeacher: RegisterTeacherUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createTeacherAccountBodySchema))
  async handle(
    @CurrentUser() sessionUser: User,
    @Body() body: CreateTeacherAccountBodySchema,
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
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
