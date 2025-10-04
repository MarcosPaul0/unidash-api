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
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SEMESTER } from '@/domain/entities/course-data';
import { RegisterCourseActiveStudentsDataUseCase } from '@/domain/application/use-cases/register-course-active-students-data/register-course-active-students-data';

const registerActiveStudentsByIngressBodySchema = z.object({
  ingressYear: z.int().max(new Date().getFullYear()).min(0),
  numberOfStudents: z.int().min(0).max(1000),
});

const registerCourseActiveStudentsDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  activeStudentsByIngress: z.array(registerActiveStudentsByIngressBodySchema),
});

type RegisterCourseActiveStudentsDataBodySchema = z.infer<
  typeof registerCourseActiveStudentsDataBodySchema
>;

@Controller('/course-active-students-data')
export class RegisterCourseActiveStudentsDataController {
  constructor(
    private registerCourseActiveStudentsData: RegisterCourseActiveStudentsDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerCourseActiveStudentsDataBodySchema))
    body: RegisterCourseActiveStudentsDataBodySchema,
  ) {
    const result = await this.registerCourseActiveStudentsData.execute({
      courseActiveStudentsData: body,
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
