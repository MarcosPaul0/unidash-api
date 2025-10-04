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
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeleteCourseActiveStudentsDataUseCase } from '@/domain/application/use-cases/delete-course-active-students-data/delete-course-active-students-data';

@Controller('/course-active-students-data/:courseActiveStudentsDataId')
export class DeleteCourseActiveStudentsDataController {
  constructor(
    private deleteCourseActiveStudentsData: DeleteCourseActiveStudentsDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseActiveStudentsDataId') courseActiveStudentsDataId: string,
  ) {
    const result = await this.deleteCourseActiveStudentsData.execute({
      courseActiveStudentsDataId,
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
