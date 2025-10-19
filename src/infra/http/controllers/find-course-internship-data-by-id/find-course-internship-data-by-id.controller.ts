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
import { FindCourseInternshipDataByIdUseCase } from '@/domain/application/use-cases/find-course-internship-data-by-id/find-course-internship-data-by-id';
import { CourseInternshipDataPresenter } from '../../presenters/course-internship-data-presenter';

@Controller('/course-internship-data/by-id/:courseInternshipDataId')
export class FindCourseInternshipDataByIdController {
  constructor(
    private findCourseInternshipDataByIdUseCase: FindCourseInternshipDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseInternshipDataId')
    courseInternshipDataId: string,
  ) {
    const result = await this.findCourseInternshipDataByIdUseCase.execute({
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

    return {
      courseInternshipData: CourseInternshipDataPresenter.toHTTP(
        result.value.courseInternshipData,
      ),
    };
  }
}
