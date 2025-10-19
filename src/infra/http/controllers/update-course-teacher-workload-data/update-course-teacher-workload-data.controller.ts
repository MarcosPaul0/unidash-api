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
  UsePipes,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UpdateCourseTeacherWorkloadDataUseCase } from '@/domain/application/use-cases/update-course-teacher-workload-data/update-course-teacher-workload-data';
import { SEMESTER } from '@/domain/entities/course-data';

const updateCourseTeacherWorkloadDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  workloadInHours: z.int().min(0).max(10000).optional(),
});

type UpdateCourseTeacherWorkloadDataBodySchema = z.infer<
  typeof updateCourseTeacherWorkloadDataBodySchema
>;

@Controller('/course-teacher-workload-data/:courseTeacherWorkloadDataId')
export class UpdateCourseTeacherWorkloadDataController {
  constructor(
    private updateCourseTeacherWorkloadDataUseCase: UpdateCourseTeacherWorkloadDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateCourseTeacherWorkloadDataBodySchema))
    body: UpdateCourseTeacherWorkloadDataBodySchema,
    @Param('courseTeacherWorkloadDataId') courseTeacherWorkloadDataId: string,
  ) {
    const result = await this.updateCourseTeacherWorkloadDataUseCase.execute({
      courseTeacherWorkloadDataId,
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
