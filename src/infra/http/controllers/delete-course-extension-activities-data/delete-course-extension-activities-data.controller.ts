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
import { DeleteCourseExtensionActivitiesDataUseCase } from '@/domain/application/use-cases/delete-course-extension-activities-data/delete-course-extension-activities-data';

@Controller(
  '/course-extension-activities-data/:courseExtensionActivitiesDataId',
)
export class DeleteCourseExtensionActivitiesDataController {
  constructor(
    private deleteCourseExtensionActivitiesData: DeleteCourseExtensionActivitiesDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseExtensionActivitiesDataId')
    courseExtensionActivitiesDataId: string,
  ) {
    const result = await this.deleteCourseExtensionActivitiesData.execute({
      courseExtensionActivitiesDataId,
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
