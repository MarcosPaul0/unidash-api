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
import { DeleteCourseDepartureDataUseCase } from '@/domain/application/use-cases/delete-course-departure-data/delete-course-departure-data';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';

@Controller('/course-departure-data/:courseDepartureDataId')
export class DeleteCourseDepartureDataController {
  constructor(
    private deleteCourseDepartureData: DeleteCourseDepartureDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseDepartureDataId') courseDepartureDataId: string,
  ) {
    const result = await this.deleteCourseDepartureData.execute({
      courseDepartureDataId,
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
