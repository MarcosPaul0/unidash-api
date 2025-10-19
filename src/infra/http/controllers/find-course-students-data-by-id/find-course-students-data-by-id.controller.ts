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
import { FindCourseStudentsDataByIdUseCase } from '@/domain/application/use-cases/find-course-students-data-by-id/find-course-students-data-by-id';
import { CourseStudentsDataPresenter } from '../../presenters/course-students-data-presenter';

@Controller('/course-students-data/by-id/:courseStudentsDataId')
export class FindCourseStudentsDataByIdController {
  constructor(
    private findCourseStudentsDataByIdUseCase: FindCourseStudentsDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseStudentsDataId')
    courseStudentsDataId: string,
  ) {
    const result = await this.findCourseStudentsDataByIdUseCase.execute({
      courseStudentsDataId,
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
      courseStudentsData: CourseStudentsDataPresenter.toHTTP(
        result.value.courseStudentsData,
      ),
    };
  }
}
