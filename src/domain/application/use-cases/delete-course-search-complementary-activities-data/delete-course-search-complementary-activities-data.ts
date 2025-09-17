import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseSearchComplementaryActivitiesDataRepository } from '../../repositories/course-search-complementary-activities-data-repository';

interface DeleteCourseSearchComplementaryActivitiesDataUseCaseRequest {
  courseSearchComplementaryActivitiesDataId: string;
  sessionUser: SessionUser;
}

type DeleteCourseSearchComplementaryActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseSearchComplementaryActivitiesDataUseCase {
  constructor(
    private courseSearchComplementaryActivitiesDataRepository: CourseSearchComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseSearchComplementaryActivitiesDataId,
    sessionUser,
  }: DeleteCourseSearchComplementaryActivitiesDataUseCaseRequest): Promise<DeleteCourseSearchComplementaryActivitiesDataUseCaseResponse> {
    const courseSearchComplementaryActivitiesData =
      await this.courseSearchComplementaryActivitiesDataRepository.findById(
        courseSearchComplementaryActivitiesDataId,
      );

    if (!courseSearchComplementaryActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseSearchComplementaryActivitiesData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseSearchComplementaryActivitiesDataRepository.delete(
      courseSearchComplementaryActivitiesData,
    );

    return right({});
  }
}
