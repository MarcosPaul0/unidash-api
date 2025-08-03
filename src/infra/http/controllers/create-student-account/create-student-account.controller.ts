import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { RegisterStudentUseCase } from '@/domain/application/use-cases/register-student/register-student';
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
import { Public } from '@/infra/auth/public';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { User } from '@/domain/entities/user';
import { STUDENT_TYPE } from '@/domain/entities/student';

const createStudentAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  matriculation: z.string().min(10).max(10),
  courseId: z.uuid(),
  type: z.enum(STUDENT_TYPE),
});

type CreateStudentAccountBodySchema = z.infer<
  typeof createStudentAccountBodySchema
>;

@Controller('/students/account')
@Public()
export class CreateStudentAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createStudentAccountBodySchema))
  async handle(
    @CurrentUser() sessionUser: User,
    @Body() body: CreateStudentAccountBodySchema,
  ) {
    const { name, email, password, matriculation, courseId, type } = body;

    const result = await this.registerStudent.execute({
      student: {
        name,
        email,
        password,
        matriculation,
        courseId,
        type,
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
