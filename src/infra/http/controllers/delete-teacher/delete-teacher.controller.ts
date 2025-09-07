import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { DeleteTeacherUseCase } from '@/domain/application/use-cases/delete-teacher/delete-teacher';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { SessionUser } from '@/domain/entities/user';

@Controller('/teachers/:teacherId')
export class DeleteTeacherController {
  constructor(private deleteTeacher: DeleteTeacherUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('teacherId') teacherId: string,
    @CurrentUser() sessionUser: SessionUser,
  ) {
    const result = await this.deleteTeacher.execute({
      teacherId,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
