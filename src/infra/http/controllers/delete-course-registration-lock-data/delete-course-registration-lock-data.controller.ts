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
import { User } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeleteCourseRegistrationLockDataUseCase } from '@/domain/application/use-cases/delete-course-registration-lock-data/delete-course-registration-lock-data';

@Controller('/course-registration-lock-data/:courseRegistrationLockDataId')
export class DeleteCourseRegistrationLockDataController {
  constructor(
    private deleteCourseRegistrationLockData: DeleteCourseRegistrationLockDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: User,
    @Param('courseRegistrationLockDataId') courseRegistrationLockDataId: string,
  ) {
    const result = await this.deleteCourseRegistrationLockData.execute({
      courseRegistrationLockDataId,
      sessionUser: user,
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
