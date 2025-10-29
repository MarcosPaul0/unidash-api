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
import { UpdateCourseStudentsDataUseCase } from '@/domain/application/use-cases/update-course-students-data/update-course-students-data';
import { SEMESTER } from '@/domain/entities/course-data';

const updateCourseStudentsDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  entrants: z.int().min(0).max(1000).optional(),
  vacancies: z.int().min(0).max(1000).optional(),
  subscribers: z.int().min(0).max(1000).optional(),
});

type UpdateCourseStudentsDataBodySchema = z.infer<
  typeof updateCourseStudentsDataBodySchema
>;

@Controller('/course-students-data/:courseStudentsDataId')
export class UpdateCourseStudentsDataController {
  constructor(
    private updateCourseStudentsDataUseCase: UpdateCourseStudentsDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateCourseStudentsDataBodySchema))
    body: UpdateCourseStudentsDataBodySchema,
    @Param('courseStudentsDataId') courseStudentsDataId: string,
  ) {
    const result = await this.updateCourseStudentsDataUseCase.execute({
      courseStudentsDataId,
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
