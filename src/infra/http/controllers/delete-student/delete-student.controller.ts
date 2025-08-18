import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DeleteStudentUseCase } from '@/domain/application/use-cases/delete-student/delete-student';
import { SessionUser } from '@/domain/entities/user';

@Controller('/students/:studentId')
export class DeleteStudentController {
  constructor(private deleteStudent: DeleteStudentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('studentId') studentId: string,
  ) {
    const result = await this.deleteStudent.execute({
      studentId,
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
