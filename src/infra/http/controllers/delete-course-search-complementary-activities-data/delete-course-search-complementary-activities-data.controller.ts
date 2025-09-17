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
import { DeleteCourseSearchComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/delete-course-search-complementary-activities-data/delete-course-search-complementary-activities-data';

@Controller(
  '/course-search-complementary-activities-data/:courseSearchComplementaryActivitiesDataId',
)
export class DeleteCourseSearchComplementaryActivitiesDataController {
  constructor(
    private deleteCourseSearchComplementaryActivitiesData: DeleteCourseSearchComplementaryActivitiesDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseSearchComplementaryActivitiesDataId')
    courseSearchComplementaryActivitiesDataId: string,
  ) {
    const result =
      await this.deleteCourseSearchComplementaryActivitiesData.execute({
        courseSearchComplementaryActivitiesDataId,
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
