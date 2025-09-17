import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseExtensionActivitiesDataRepository } from '../../repositories/course-extension-activities-data-repository';

interface DeleteCourseExtensionActivitiesDataUseCaseRequest {
  courseExtensionActivitiesDataId: string;
  sessionUser: SessionUser;
}

type DeleteCourseExtensionActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseExtensionActivitiesDataUseCase {
  constructor(
    private courseExtensionActivitiesDataRepository: CourseExtensionActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseExtensionActivitiesDataId,
    sessionUser,
  }: DeleteCourseExtensionActivitiesDataUseCaseRequest): Promise<DeleteCourseExtensionActivitiesDataUseCaseResponse> {
    const courseExtensionActivitiesData =
      await this.courseExtensionActivitiesDataRepository.findById(
        courseExtensionActivitiesDataId,
      );

    if (!courseExtensionActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseExtensionActivitiesData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseExtensionActivitiesDataRepository.delete(
      courseExtensionActivitiesData,
    );

    return right({});
  }
}
