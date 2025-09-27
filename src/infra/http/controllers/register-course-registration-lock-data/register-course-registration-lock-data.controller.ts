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
import { RegisterCourseRegistrationLockDataUseCase } from '@/domain/application/use-cases/register-course-registration-lock-data/register-course-registration-lock-data';
import { CourseRegistrationLockDataAlreadyExistsError } from '@/domain/application/use-cases/errors/course-registration-lock-data-already-exists-error';

const registerCourseRegistrationLockDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  difficultyInDiscipline: z.int().min(0).max(1000),
  workload: z.int().min(0).max(1000),
  teacherMethodology: z.int().min(0).max(1000),
  incompatibilityWithWork: z.int().min(0).max(1000),
  lossOfInterest: z.int().min(0).max(1000),
  other: z.int().min(0).max(1000),
});

type RegisterCourseRegistrationLockDataBodySchema = z.infer<
  typeof registerCourseRegistrationLockDataBodySchema
>;

@Controller('/course-registration-lock-data')
export class RegisterCourseRegistrationLockDataController {
  constructor(
    private registerCourseRegistrationLockData: RegisterCourseRegistrationLockDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerCourseRegistrationLockDataBodySchema))
    body: RegisterCourseRegistrationLockDataBodySchema,
  ) {
    const result = await this.registerCourseRegistrationLockData.execute({
      courseRegistrationLockData: body,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CourseRegistrationLockDataAlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
