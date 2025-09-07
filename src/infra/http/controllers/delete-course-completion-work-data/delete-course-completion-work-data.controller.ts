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
import { DeleteCourseCompletionWorkDataUseCase } from '@/domain/application/use-cases/delete-course-completion-work-data/delete-course-completion-work-data';

@Controller('/course-completion-work-data/:courseCompletionWorkDataId')
export class DeleteCourseCompletionWorkDataController {
  constructor(
    private deleteCourseCompletionWorkData: DeleteCourseCompletionWorkDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseCompletionWorkDataId') courseCompletionWorkDataId: string,
  ) {
    const result = await this.deleteCourseCompletionWorkData.execute({
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
  }
}
