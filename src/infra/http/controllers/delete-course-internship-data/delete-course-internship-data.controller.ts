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
import { DeleteCourseInternshipDataUseCase } from '@/domain/application/use-cases/delete-course-internship-data/delete-course-internship-data';

@Controller('/course-internship-data/:courseInternshipDataId')
export class DeleteCourseInternshipDataController {
  constructor(
    private deleteCourseInternshipData: DeleteCourseInternshipDataUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseInternshipDataId') courseInternshipDataId: string,
  ) {
    const result = await this.deleteCourseInternshipData.execute({
      courseInternshipDataId,
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
