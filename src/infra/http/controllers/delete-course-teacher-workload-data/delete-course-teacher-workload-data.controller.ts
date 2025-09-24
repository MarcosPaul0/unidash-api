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
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { DeleteCourseTeacherWorkloadDataUseCase } from '@/domain/application/use-cases/delete-course-teacher-workload-data/delete-course-teacher-workload-data';

@Controller('/course-teacher-workload-data/:courseTeacherWorkloadDataId')
export class DeleteCourseTeacherWorkloadDataController {
  constructor(
    private deleteCourseTeacherWorkloadData: DeleteCourseTeacherWorkloadDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseTeacherWorkloadDataId') courseTeacherWorkloadDataId: string,
  ) {
    const result = await this.deleteCourseTeacherWorkloadData.execute({
      courseTeacherWorkloadDataId,
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
