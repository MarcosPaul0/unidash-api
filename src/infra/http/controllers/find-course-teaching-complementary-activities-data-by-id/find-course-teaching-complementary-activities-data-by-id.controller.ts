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
import { FindCourseTeachingComplementaryActivitiesDataByIdUseCase } from '@/domain/application/use-cases/find-course-teaching-complementary-activities-data-by-id/find-course-teaching-complementary-activities-data-by-id';
import { CourseTeachingComplementaryActivitiesDataPresenter } from '../../presenters/course-teaching-complementary-activities-data-presenter';

@Controller(
  '/course-teaching-complementary-activities-data/by-id/:courseTeachingComplementaryActivitiesDataId',
)
export class FindCourseTeachingComplementaryActivitiesDataByIdController {
  constructor(
    private findCourseTeachingComplementaryActivitiesDataByIdUseCase: FindCourseTeachingComplementaryActivitiesDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseTeachingComplementaryActivitiesDataId')
    courseTeachingComplementaryActivitiesDataId: string,
  ) {
    const result =
      await this.findCourseTeachingComplementaryActivitiesDataByIdUseCase.execute(
        {
          courseTeachingComplementaryActivitiesDataId,
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
      courseTeachingComplementaryActivitiesData:
        CourseTeachingComplementaryActivitiesDataPresenter.toHTTP(
          result.value.courseTeachingComplementaryActivitiesData,
        ),
    };
  }
}
