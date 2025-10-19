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
import { FindCourseExtensionActivitiesDataByIdUseCase } from '@/domain/application/use-cases/find-course-extension-activities-data-by-id/find-course-extension-activities-data-by-id';
import { CourseExtensionActivitiesDataPresenter } from '../../presenters/course-extension-activities-data-presenter';

@Controller(
  '/course-extension-activities-data/by-id/:courseExtensionActivitiesDataId',
)
export class FindCourseExtensionActivitiesDataByIdController {
  constructor(
    private findCourseExtensionActivitiesDataByIdUseCase: FindCourseExtensionActivitiesDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseExtensionActivitiesDataId')
    courseExtensionActivitiesDataId: string,
  ) {
    const result =
      await this.findCourseExtensionActivitiesDataByIdUseCase.execute({
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

    return {
      courseExtensionActivitiesData:
        CourseExtensionActivitiesDataPresenter.toHTTP(
          result.value.courseExtensionActivitiesData,
        ),
    };
  }
}
