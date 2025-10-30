import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UpdateCourseRegistrationLockDataUseCase } from '@/domain/application/use-cases/update-course-registration-lock-data/update-course-registration-lock-data';
import { SEMESTER } from '@/domain/entities/course-data';

const updateCourseRegistrationLockDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  difficultyInDiscipline: z.int().min(0).max(1000).optional(),
  workload: z.int().min(0).max(1000).optional(),
  teacherMethodology: z.int().min(0).max(1000).optional(),
  incompatibilityWithWork: z.int().min(0).max(1000).optional(),
  lossOfInterest: z.int().min(0).max(1000).optional(),
  other: z.int().min(0).max(1000).optional(),
});

type UpdateCourseRegistrationLockDataBodySchema = z.infer<
  typeof updateCourseRegistrationLockDataBodySchema
>;

@Controller('/course-registration-lock-data/:courseRegistrationLockDataId')
export class UpdateCourseRegistrationLockDataController {
  constructor(
    private updateCourseRegistrationLockDataUseCase: UpdateCourseRegistrationLockDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateCourseRegistrationLockDataBodySchema))
    body: UpdateCourseRegistrationLockDataBodySchema,
    @Param('courseRegistrationLockDataId') courseRegistrationLockDataId: string,
  ) {
    const result = await this.updateCourseRegistrationLockDataUseCase.execute({
      courseRegistrationLockDataId,
      data: body,
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
