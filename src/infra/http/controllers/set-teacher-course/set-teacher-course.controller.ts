import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser, User } from '@/domain/entities/user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SetTeacherCourseUseCase } from '@/domain/application/use-cases/set-teacher-course/set-teacher-course';
import { TEACHER_ROLE } from '@/domain/entities/teacher-course';

const setTeacherCourseBodySchema = z.object({
  courseId: z.uuid(),
  teacherId: z.uuid(),
  teacherRole: z.enum(TEACHER_ROLE),
});

export type SetTeacherCourseBodySchema = z.infer<
  typeof setTeacherCourseBodySchema
>;

@Controller('/teacher-courses')
export class SetTeacherCourseController {
  constructor(private setTeacherCourseUseCase: SetTeacherCourseUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(setTeacherCourseBodySchema))
    body: SetTeacherCourseBodySchema,
  ) {
    const result = await this.setTeacherCourseUseCase.execute({
      data: body,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException();
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
