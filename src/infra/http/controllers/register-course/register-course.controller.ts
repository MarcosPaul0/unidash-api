import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  ForbiddenException,
  Post,
  UsePipes,
  Body,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { SessionUser } from '@/domain/entities/user';
import { RegisterCourseUseCase } from '@/domain/application/use-cases/register-course/register-course';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const createCourseBodySchema = z.object({
  name: z.string(),
});

type CreateCourseBodySchema = z.infer<typeof createCourseBodySchema>;

@Controller('/courses')
export class RegisterCourseController {
  constructor(private registerCourse: RegisterCourseUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCourseBodySchema))
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body() body: CreateCourseBodySchema,
  ) {
    const { name } = body;

    const result = await this.registerCourse.execute({
      course: { name },
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
