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
import { DeleteStudentIncomingDataUseCase } from '@/domain/application/use-cases/delete-student-incoming-data/delete-student-incoming-data';

@Controller('/student-incoming-data/:studentIncomingDataId')
export class DeleteStudentIncomingDataController {
  constructor(
    private deleteStudentIncomingData: DeleteStudentIncomingDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('studentIncomingDataId') studentIncomingDataId: string,
  ) {
    const result = await this.deleteStudentIncomingData.execute({
      studentIncomingDataId,
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
