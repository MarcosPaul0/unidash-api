import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteTeacherUseCase } from '@/domain/application/use-cases/delete-teacher/delete-teacher';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

@Controller('/teacher')
export class DeleteTeacherController {
  constructor(private deleteTeacher: DeleteTeacherUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteTeacher.execute({
      teacherId: userId,
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
