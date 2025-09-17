import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseTeachingComplementaryActivitiesDataRepository } from '../../repositories/course-teaching-complementary-activities-data-repository';

interface DeleteCourseTeachingComplementaryActivitiesDataUseCaseRequest {
  courseTeachingComplementaryActivitiesDataId: string;
  sessionUser: SessionUser;
}

type DeleteCourseTeachingComplementaryActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseTeachingComplementaryActivitiesDataUseCase {
  constructor(
    private courseTeachingComplementaryActivitiesDataRepository: CourseTeachingComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseTeachingComplementaryActivitiesDataId,
    sessionUser,
  }: DeleteCourseTeachingComplementaryActivitiesDataUseCaseRequest): Promise<DeleteCourseTeachingComplementaryActivitiesDataUseCaseResponse> {
    const courseTeachingComplementaryActivitiesData =
      await this.courseTeachingComplementaryActivitiesDataRepository.findById(
        courseTeachingComplementaryActivitiesDataId,
      );

    if (!courseTeachingComplementaryActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseTeachingComplementaryActivitiesData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseTeachingComplementaryActivitiesDataRepository.delete(
      courseTeachingComplementaryActivitiesData,
    );

    return right({});
  }
}
