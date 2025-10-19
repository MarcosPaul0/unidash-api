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
import { FindCourseActiveStudentsDataByIdUseCase } from '@/domain/application/use-cases/find-course-active-students-data-by-id/find-course-active-students-data-by-id';
import { CourseActiveStudentsDataPresenter } from '../../presenters/course-active-students-data-presenter';

@Controller('/course-active-students-data/by-id/:courseActiveStudentsDataId')
export class FindCourseActiveStudentsDataByIdController {
  constructor(
    private findCourseActiveStudentsDataByIdUseCase: FindCourseActiveStudentsDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseActiveStudentsDataId') courseActiveStudentsDataId: string,
  ) {
    const result = await this.findCourseActiveStudentsDataByIdUseCase.execute({
      courseActiveStudentsDataId,
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
      courseActiveStudentsData: CourseActiveStudentsDataPresenter.toHTTP(
        result.value.courseActiveStudentsData,
      ),
    };
  }
}
