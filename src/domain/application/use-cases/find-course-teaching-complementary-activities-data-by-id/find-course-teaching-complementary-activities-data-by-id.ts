import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';
import { CourseTeachingComplementaryActivitiesDataRepository } from '../../repositories/course-teaching-complementary-activities-data-repository';

interface FindCourseTeachingComplementaryActivitiesDataByIdUseCaseRequest {
  courseTeachingComplementaryActivitiesDataId: string;
  sessionUser: SessionUser;
}

type FindCourseTeachingComplementaryActivitiesDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData;
  }
>;

@Injectable()
export class FindCourseTeachingComplementaryActivitiesDataByIdUseCase {
  constructor(
    private courseTeachingComplementaryActivitiesDataRepository: CourseTeachingComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseTeachingComplementaryActivitiesDataId,
    sessionUser,
  }: FindCourseTeachingComplementaryActivitiesDataByIdUseCaseRequest): Promise<FindCourseTeachingComplementaryActivitiesDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseTeachingComplementaryActivitiesData =
      await this.courseTeachingComplementaryActivitiesDataRepository.findById(
        courseTeachingComplementaryActivitiesDataId,
      );

    if (!courseTeachingComplementaryActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseTeachingComplementaryActivitiesData,
    });
  }
}
