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
import { FindCourseTeacherWorkloadDataByIdUseCase } from '@/domain/application/use-cases/find-course-teacher-workload-data-by-id/find-course-teacher-workload-data-by-id';
import { CourseTeacherWorkloadDataPresenter } from '../../presenters/course-teacher-workload-data-presenter';

@Controller('/course-teacher-workload-data/by-id/:courseTeacherWorkloadDataId')
export class FindCourseTeacherWorkloadDataByIdController {
  constructor(
    private findCourseTeacherWorkloadDataByIdUseCase: FindCourseTeacherWorkloadDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseTeacherWorkloadDataId')
    courseTeacherWorkloadDataId: string,
  ) {
    const result = await this.findCourseTeacherWorkloadDataByIdUseCase.execute({
      courseTeacherWorkloadDataId,
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
      courseTeacherWorkloadData: CourseTeacherWorkloadDataPresenter.toHTTP(
        result.value.courseTeacherWorkloadData,
      ),
    };
  }
}
