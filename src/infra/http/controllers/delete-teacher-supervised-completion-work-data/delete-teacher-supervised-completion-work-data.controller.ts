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
import { DeleteTeacherSupervisedCompletionWorkDataUseCase } from '@/domain/application/use-cases/delete-teacher-supervised-completion-work-data/delete-teacher-supervised-completion-work-data';

@Controller(
  '/teacher-supervised-completion-work-data/:teacherSupervisedCompletionWorkDataId',
)
export class DeleteTeacherSupervisedCompletionWorkDataController {
  constructor(
    private deleteTeacherSupervisedCompletionWorkData: DeleteTeacherSupervisedCompletionWorkDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('teacherSupervisedCompletionWorkDataId')
    teacherSupervisedCompletionWorkDataId: string,
  ) {
    const result = await this.deleteTeacherSupervisedCompletionWorkData.execute(
      {
        teacherSupervisedCompletionWorkDataId,
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
  }
}
