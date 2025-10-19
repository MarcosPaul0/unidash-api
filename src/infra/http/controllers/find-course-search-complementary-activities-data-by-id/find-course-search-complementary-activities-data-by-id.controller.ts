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
import { FindCourseSearchComplementaryActivitiesDataByIdUseCase } from '@/domain/application/use-cases/find-course-search-complementary-activities-data-by-id/find-course-search-complementary-activities-data-by-id';
import { CourseSearchComplementaryActivitiesDataPresenter } from '../../presenters/course-search-complementary-activities-data-presenter';

@Controller(
  '/course-search-complementary-activities-data/by-id/:courseSearchComplementaryActivitiesDataId',
)
export class FindCourseSearchComplementaryActivitiesDataByIdController {
  constructor(
    private findCourseSearchComplementaryActivitiesDataByIdUseCase: FindCourseSearchComplementaryActivitiesDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseSearchComplementaryActivitiesDataId')
    courseSearchComplementaryActivitiesDataId: string,
  ) {
    const result =
      await this.findCourseSearchComplementaryActivitiesDataByIdUseCase.execute(
        {
          courseSearchComplementaryActivitiesDataId,
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
      courseSearchComplementaryActivitiesData:
        CourseSearchComplementaryActivitiesDataPresenter.toHTTP(
          result.value.courseSearchComplementaryActivitiesData,
        ),
    };
  }
}
