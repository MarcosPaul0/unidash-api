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
import { DeleteTeacherTechnicalScientificProductionsDataUseCase } from '@/domain/application/use-cases/delete-teacher-technical-scientific-productions-data/delete-teacher-technical-scientific-productions-data';

@Controller(
  '/teacher-technical-scientific-productions-data/:teacherTechnicalScientificProductionsDataId',
)
export class DeleteTeacherTechnicalScientificProductionsDataController {
  constructor(
    private deleteTeacherTechnicalScientificProductionsData: DeleteTeacherTechnicalScientificProductionsDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('teacherTechnicalScientificProductionsDataId')
    teacherTechnicalScientificProductionsDataId: string,
  ) {
    const result =
      await this.deleteTeacherTechnicalScientificProductionsData.execute({
        teacherTechnicalScientificProductionsDataId,
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
