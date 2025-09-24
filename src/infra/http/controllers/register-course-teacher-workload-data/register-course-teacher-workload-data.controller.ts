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
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SEMESTER } from '@/domain/entities/course-data';
import { RegisterCourseTeacherWorkloadDataUseCase } from '@/domain/application/use-cases/register-course-teacher-workload-data/register-course-teacher-workload-data';
import { CourseTeacherWorkloadDataAlreadyExistsError } from '@/domain/application/use-cases/errors/course-teacher-workload-data-already-exists-error';

const registerCourseTeacherWorkloadDataBodySchema = z.object({
  courseId: z.uuid(),
  teacherId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  workloadInMinutes: z.int().min(0).max(1000),
});

type RegisterCourseTeacherWorkloadDataBodySchema = z.infer<
  typeof registerCourseTeacherWorkloadDataBodySchema
>;

@Controller('/course-teacher-workload-data')
export class RegisterCourseTeacherWorkloadDataController {
  constructor(
    private registerCourseTeacherWorkloadData: RegisterCourseTeacherWorkloadDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerCourseTeacherWorkloadDataBodySchema))
    body: RegisterCourseTeacherWorkloadDataBodySchema,
  ) {
    const result = await this.registerCourseTeacherWorkloadData.execute({
      courseTeacherWorkloadData: body,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CourseTeacherWorkloadDataAlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
