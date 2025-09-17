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
import { DeleteCourseExtensionComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/delete-course-extension-complementary-activities-data/delete-course-extension-complementary-activities-data';

@Controller(
  '/course-extension-complementary-activities-data/:courseExtensionComplementaryActivitiesDataId',
)
export class DeleteCourseExtensionComplementaryActivitiesDataController {
  constructor(
    private deleteCourseExtensionComplementaryActivitiesData: DeleteCourseExtensionComplementaryActivitiesDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseExtensionComplementaryActivitiesDataId')
    courseExtensionComplementaryActivitiesDataId: string,
  ) {
    const result =
      await this.deleteCourseExtensionComplementaryActivitiesData.execute({
        courseExtensionComplementaryActivitiesDataId,
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
