import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseExtensionComplementaryActivitiesDataRepository } from '../../repositories/course-extension-complementary-activities-data-repository';

interface DeleteCourseExtensionComplementaryActivitiesDataUseCaseRequest {
  courseExtensionComplementaryActivitiesDataId: string;
  sessionUser: SessionUser;
}

type DeleteCourseExtensionComplementaryActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseExtensionComplementaryActivitiesDataUseCase {
  constructor(
    private courseExtensionComplementaryActivitiesDataRepository: CourseExtensionComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseExtensionComplementaryActivitiesDataId,
    sessionUser,
  }: DeleteCourseExtensionComplementaryActivitiesDataUseCaseRequest): Promise<DeleteCourseExtensionComplementaryActivitiesDataUseCaseResponse> {
    const courseExtensionComplementaryActivitiesData =
      await this.courseExtensionComplementaryActivitiesDataRepository.findById(
        courseExtensionComplementaryActivitiesDataId,
      );

    if (!courseExtensionComplementaryActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseExtensionComplementaryActivitiesData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseExtensionComplementaryActivitiesDataRepository.delete(
      courseExtensionComplementaryActivitiesData,
    );

    return right({});
  }
}
