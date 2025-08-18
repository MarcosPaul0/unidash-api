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
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeleteCourseCoordinationDataUseCase } from '@/domain/application/use-cases/delete-course-coordination-data/delete-course-coordination-data';

@Controller('/course-coordination-data/:courseCoordinationDataId')
export class DeleteCourseCoordinationDataController {
  constructor(
    private deleteCourseCoordinationData: DeleteCourseCoordinationDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseCoordinationDataId') courseCoordinationDataId: string,
  ) {
    const result = await this.deleteCourseCoordinationData.execute({
      courseCoordinationDataId,
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
