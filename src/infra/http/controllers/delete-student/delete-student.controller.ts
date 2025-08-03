import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DeleteStudentUseCase } from '@/domain/application/use-cases/delete-student/delete-student';

@Controller('/students')
export class DeleteStudentController {
  constructor(private deleteStudent: DeleteStudentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteStudent.execute({
      studentId: userId,
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
