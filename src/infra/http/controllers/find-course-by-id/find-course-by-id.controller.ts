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
import { FindCourseByIdUseCase } from '@/domain/application/use-cases/find-course-by-id/find-course-by-id';
import { CoursesPresenter } from '../../presenters/courses-presenter';

@Controller('/courses/:courseId')
export class FindCourseByIdController {
  constructor(private findCourseByIdUseCase: FindCourseByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
  ) {
    const result = await this.findCourseByIdUseCase.execute({
      courseId,
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

    return { course: CoursesPresenter.toHTTP(result.value.course) };
  }
}
