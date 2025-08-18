import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseRegistrationLockDataRepository } from '../../repositories/course-registration-lock-data-repository';

interface DeleteCourseRegistrationLockDataUseCaseRequest {
  courseRegistrationLockDataId: string;
  sessionUser: SessionUser;
}

type DeleteCourseRegistrationLockDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseRegistrationLockDataUseCase {
  constructor(
    private courseRegistrationLockDataRepository: CourseRegistrationLockDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseRegistrationLockDataId,
    sessionUser,
  }: DeleteCourseRegistrationLockDataUseCaseRequest): Promise<DeleteCourseRegistrationLockDataUseCaseResponse> {
    const courseRegistrationLockData =
      await this.courseRegistrationLockDataRepository.findById(
        courseRegistrationLockDataId,
      );

    if (!courseRegistrationLockData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseRegistrationLockData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseRegistrationLockDataRepository.delete(
      courseRegistrationLockData,
    );

    return right({});
  }
}
