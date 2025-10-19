import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';
import { CourseTeacherWorkloadDataRepository } from '../../repositories/course-teacher-workload-data-repository';

interface FindCourseTeacherWorkloadDataByIdUseCaseRequest {
  courseTeacherWorkloadDataId: string;
  sessionUser: SessionUser;
}

type FindCourseTeacherWorkloadDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseTeacherWorkloadData: CourseTeacherWorkloadData;
  }
>;

@Injectable()
export class FindCourseTeacherWorkloadDataByIdUseCase {
  constructor(
    private courseTeacherWorkloadDataRepository: CourseTeacherWorkloadDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseTeacherWorkloadDataId,
    sessionUser,
  }: FindCourseTeacherWorkloadDataByIdUseCaseRequest): Promise<FindCourseTeacherWorkloadDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseTeacherWorkloadData =
      await this.courseTeacherWorkloadDataRepository.findById(
        courseTeacherWorkloadDataId,
      );

    if (!courseTeacherWorkloadData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseTeacherWorkloadData,
    });
  }
}
