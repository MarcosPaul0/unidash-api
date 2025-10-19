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
import { UpdateCourseActiveStudentsDataUseCase } from '@/domain/application/use-cases/update-course-active-students-data/update-course-active-students-data';
import { SEMESTER } from '@/domain/entities/course-data';

const updateActiveStudentsByIngressBodySchema = z.object({
  ingressYear: z.int().max(new Date().getFullYear()).min(0),
  numberOfStudents: z.int().min(0).max(1000),
});

const updateCourseActiveStudentsDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  activeStudentsByIngress: z.array(updateActiveStudentsByIngressBodySchema),
});

type UpdateCourseActiveStudentsDataBodySchema = z.infer<
  typeof updateCourseActiveStudentsDataBodySchema
>;

@Controller('/course-active-students-data/:courseActiveStudentsDataId')
export class UpdateCourseActiveStudentsDataController {
  constructor(
    private updateCourseActiveStudentsDataUseCase: UpdateCourseActiveStudentsDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateCourseActiveStudentsDataBodySchema))
    body: UpdateCourseActiveStudentsDataBodySchema,
    @Param('courseActiveStudentsDataId') courseActiveStudentsDataId: string,
  ) {
    const result = await this.updateCourseActiveStudentsDataUseCase.execute({
      courseActiveStudentsDataId,
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
