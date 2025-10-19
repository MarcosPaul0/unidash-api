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
import { FindCourseCompletionWorkDataByIdUseCase } from '@/domain/application/use-cases/find-course-completion-work-data-by-id/find-course-completion-work-data-by-id';
import { CourseCompletionWorkDataPresenter } from '../../presenters/course-completion-work-data-presenter';

@Controller('/course-completion-work-data/by-id/:courseCompletionWorkDataId')
export class FindCourseCompletionWorkDataByIdController {
  constructor(
    private findCourseCompletionWorkDataByIdUseCase: FindCourseCompletionWorkDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseCompletionWorkDataId') courseCompletionWorkDataId: string,
  ) {
    const result = await this.findCourseCompletionWorkDataByIdUseCase.execute({
      courseCompletionWorkDataId,
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
      courseCompletionWorkData: CourseCompletionWorkDataPresenter.toHTTP(
        result.value.courseCompletionWorkData,
      ),
    };
  }
}
