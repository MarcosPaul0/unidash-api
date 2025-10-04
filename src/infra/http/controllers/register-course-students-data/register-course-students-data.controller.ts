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
  UsePipes,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SEMESTER } from '@/domain/entities/course-data';
import { RegisterCourseStudentsDataUseCase } from '@/domain/application/use-cases/register-course-students-data/register-course-students-data';

const registerCourseStudentsDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  entrants: z.int().min(0).max(1000),
  vacancies: z.int().min(0).max(1000),
  subscribers: z.int().min(0).max(1000),
});

type RegisterCourseStudentsDataBodySchema = z.infer<
  typeof registerCourseStudentsDataBodySchema
>;

@Controller('/course-students-data')
export class RegisterCourseStudentsDataController {
  constructor(
    private registerCourseStudentsData: RegisterCourseStudentsDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerCourseStudentsDataBodySchema))
    body: RegisterCourseStudentsDataBodySchema,
  ) {
    const result = await this.registerCourseStudentsData.execute({
      courseStudentsData: body,
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
