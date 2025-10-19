import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseStudentsData } from '@/domain/entities/course-students-data';
import { CourseStudentsDataRepository } from '../../repositories/course-students-data-repository';

interface FindCourseStudentsDataByIdUseCaseRequest {
  courseStudentsDataId: string;
  sessionUser: SessionUser;
}

type FindCourseStudentsDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseStudentsData: CourseStudentsData;
  }
>;

@Injectable()
export class FindCourseStudentsDataByIdUseCase {
  constructor(
    private courseStudentsDataRepository: CourseStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseStudentsDataId,
    sessionUser,
  }: FindCourseStudentsDataByIdUseCaseRequest): Promise<FindCourseStudentsDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseStudentsData =
      await this.courseStudentsDataRepository.findById(courseStudentsDataId);

    if (!courseStudentsData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseStudentsData,
    });
  }
}
