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
import { User } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeleteCourseStudentsDataUseCase } from '@/domain/application/use-cases/delete-course-students-data/delete-course-students-data';

@Controller('/course-students-data/:courseStudentsDataId')
export class DeleteCourseStudentsDataController {
  constructor(
    private deleteCourseStudentsData: DeleteCourseStudentsDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: User,
    @Param('courseStudentsDataId') courseStudentsDataId: string,
  ) {
    const result = await this.deleteCourseStudentsData.execute({
      courseStudentsDataId,
      sessionUser: user,
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
