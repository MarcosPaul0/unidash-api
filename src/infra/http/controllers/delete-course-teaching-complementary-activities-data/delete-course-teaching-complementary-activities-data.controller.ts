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
import { DeleteCourseTeachingComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/delete-course-teaching-complementary-activities-data/delete-course-teaching-complementary-activities-data';

@Controller(
  '/course-teaching-complementary-activities-data/:courseTeachingComplementaryActivitiesDataId',
)
export class DeleteCourseTeachingComplementaryActivitiesDataController {
  constructor(
    private deleteCourseTeachingComplementaryActivitiesData: DeleteCourseTeachingComplementaryActivitiesDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseTeachingComplementaryActivitiesDataId')
    courseTeachingComplementaryActivitiesDataId: string,
  ) {
    const result =
      await this.deleteCourseTeachingComplementaryActivitiesData.execute({
        courseTeachingComplementaryActivitiesDataId,
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
