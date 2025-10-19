import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { FindCourseCoordinationDataByIdUseCase } from '@/domain/application/use-cases/find-course-coordination-data-by-id/find-course-coordination-data-by-id';
import { CourseCoordinationDataPresenter } from '../../presenters/course-coordination-data-presenter';

@Controller('/course-coordination-data/by-id/:courseCoordinationDataId')
export class FindCourseCoordinationDataByIdController {
  constructor(
    private findCourseCoordinationDataByIdUseCase: FindCourseCoordinationDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseCoordinationDataId') courseCoordinationDataId: string,
  ) {
    const result = await this.findCourseCoordinationDataByIdUseCase.execute({
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

    return {
      courseCoordinationData: CourseCoordinationDataPresenter.toHTTP(
        result.value.courseCoordinationData,
      ),
    };
  }
}
