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
import { FindCourseRegistrationLockDataByIdUseCase } from '@/domain/application/use-cases/find-course-registration-lock-data-by-id/find-course-registration-lock-data-by-id';
import { CourseRegistrationLockDataPresenter } from '../../presenters/course-registration-lock-data-presenter';

@Controller(
  '/course-registration-lock-data/by-id/:courseRegistrationLockDataId',
)
export class FindCourseRegistrationLockDataByIdController {
  constructor(
    private findCourseRegistrationLockDataByIdUseCase: FindCourseRegistrationLockDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseRegistrationLockDataId')
    courseRegistrationLockDataId: string,
  ) {
    const result = await this.findCourseRegistrationLockDataByIdUseCase.execute(
      {
        courseRegistrationLockDataId,
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
      courseRegistrationLockData: CourseRegistrationLockDataPresenter.toHTTP(
        result.value.courseRegistrationLockData,
      ),
    };
  }
}
