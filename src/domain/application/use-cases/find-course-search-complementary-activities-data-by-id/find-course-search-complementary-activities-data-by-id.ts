import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';
import { CourseSearchComplementaryActivitiesDataRepository } from '../../repositories/course-search-complementary-activities-data-repository';

interface FindCourseSearchComplementaryActivitiesDataByIdUseCaseRequest {
  courseSearchComplementaryActivitiesDataId: string;
  sessionUser: SessionUser;
}

type FindCourseSearchComplementaryActivitiesDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData;
  }
>;

@Injectable()
export class FindCourseSearchComplementaryActivitiesDataByIdUseCase {
  constructor(
    private courseSearchComplementaryActivitiesDataRepository: CourseSearchComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseSearchComplementaryActivitiesDataId,
    sessionUser,
  }: FindCourseSearchComplementaryActivitiesDataByIdUseCaseRequest): Promise<FindCourseSearchComplementaryActivitiesDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseSearchComplementaryActivitiesData =
      await this.courseSearchComplementaryActivitiesDataRepository.findById(
        courseSearchComplementaryActivitiesDataId,
      );

    if (!courseSearchComplementaryActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseSearchComplementaryActivitiesData,
    });
  }
}
