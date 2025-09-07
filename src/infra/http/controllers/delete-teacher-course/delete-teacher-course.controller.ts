import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DeleteTeacherCourseUseCase } from '@/domain/application/use-cases/delete-teacher-course/delete-teacher-course';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

@Controller('/teacher-courses/:teacherCourseId')
export class DeleteTeacherCourseController {
  constructor(private deleteTeacherCourse: DeleteTeacherCourseUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('teacherCourseId') teacherCourseId: string,
    @CurrentUser() sessionUser: SessionUser,
  ) {
    const result = await this.deleteTeacherCourse.execute({
      teacherCourseId,
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
