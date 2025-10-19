import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { FindCourseExtensionComplementaryActivitiesDataByIdUseCase } from '@/domain/application/use-cases/find-course-extension-complementary-activities-data-by-id/find-course-extension-complementary-activities-data-by-id';
import { CourseExtensionComplementaryActivitiesDataPresenter } from '../../presenters/course-extension-complementary-activities-data-presenter';

@Controller(
  '/course-extension-complementary-activities-data/by-id/:courseExtensionComplementaryActivitiesDataId',
)
export class FindCourseExtensionComplementaryActivitiesDataByIdController {
  constructor(
    private findCourseExtensionComplementaryActivitiesDataByIdUseCase: FindCourseExtensionComplementaryActivitiesDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseExtensionComplementaryActivitiesDataId')
    courseExtensionComplementaryActivitiesDataId: string,
  ) {
    const result =
      await this.findCourseExtensionComplementaryActivitiesDataByIdUseCase.execute(
        {
          courseExtensionComplementaryActivitiesDataId,
          sessionUser,
        },
      );

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

    return {
      courseExtensionComplementaryActivitiesData:
        CourseExtensionComplementaryActivitiesDataPresenter.toHTTP(
          result.value.courseExtensionComplementaryActivitiesData,
        ),
    };
  }
}
