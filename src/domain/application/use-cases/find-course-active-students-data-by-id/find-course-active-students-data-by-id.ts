import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';
import { CourseActiveStudentsDataRepository } from '../../repositories/course-active-students-data-repository';

interface FindCourseActiveStudentsDataByIdUseCaseRequest {
  courseActiveStudentsDataId: string;
  sessionUser: SessionUser;
}

type FindCourseActiveStudentsDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseActiveStudentsData: CourseActiveStudentsData;
  }
>;

@Injectable()
export class FindCourseActiveStudentsDataByIdUseCase {
  constructor(
    private courseActiveStudentsDataRepository: CourseActiveStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseActiveStudentsDataId,
    sessionUser,
  }: FindCourseActiveStudentsDataByIdUseCaseRequest): Promise<FindCourseActiveStudentsDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseActiveStudentsData =
      await this.courseActiveStudentsDataRepository.findById(
        courseActiveStudentsDataId,
      );

    if (!courseActiveStudentsData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseActiveStudentsData,
    });
  }
}
