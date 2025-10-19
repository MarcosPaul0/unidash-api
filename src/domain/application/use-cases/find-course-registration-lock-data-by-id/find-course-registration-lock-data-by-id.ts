import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { CourseRegistrationLockDataRepository } from '../../repositories/course-registration-lock-data-repository';

interface FindCourseRegistrationLockDataByIdUseCaseRequest {
  courseRegistrationLockDataId: string;
  sessionUser: SessionUser;
}

type FindCourseRegistrationLockDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseRegistrationLockData: CourseRegistrationLockData;
  }
>;

@Injectable()
export class FindCourseRegistrationLockDataByIdUseCase {
  constructor(
    private courseRegistrationLockDataRepository: CourseRegistrationLockDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseRegistrationLockDataId,
    sessionUser,
  }: FindCourseRegistrationLockDataByIdUseCaseRequest): Promise<FindCourseRegistrationLockDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseRegistrationLockData =
      await this.courseRegistrationLockDataRepository.findById(
        courseRegistrationLockDataId,
      );

    if (!courseRegistrationLockData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseRegistrationLockData,
    });
  }
}
