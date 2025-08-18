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
import { SessionUser } from '@/domain/entities/user';
import { DeleteCourseUseCase } from '@/domain/application/use-cases/delete-course/delete-course';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

@Controller('/courses/:courseId')
export class DeleteCourseController {
  constructor(private deleteCourse: DeleteCourseUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
  ) {
    const result = await this.deleteCourse.execute({
      courseId,
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
