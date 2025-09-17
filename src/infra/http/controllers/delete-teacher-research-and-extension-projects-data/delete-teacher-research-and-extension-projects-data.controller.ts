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
import { DeleteTeacherResearchAndExtensionProjectsDataUseCase } from '@/domain/application/use-cases/delete-teacher-research-and-extension-projects-data/delete-teacher-research-and-extension-projects-data';

@Controller(
  '/teacher-research-and-extension-projects-data/:teacherResearchAndExtensionProjectsDataId',
)
export class DeleteTeacherResearchAndExtensionProjectsDataController {
  constructor(
    private deleteTeacherResearchAndExtensionProjectsData: DeleteTeacherResearchAndExtensionProjectsDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('teacherResearchAndExtensionProjectsDataId')
    teacherResearchAndExtensionProjectsDataId: string,
  ) {
    const result =
      await this.deleteTeacherResearchAndExtensionProjectsData.execute({
        teacherResearchAndExtensionProjectsDataId,
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
