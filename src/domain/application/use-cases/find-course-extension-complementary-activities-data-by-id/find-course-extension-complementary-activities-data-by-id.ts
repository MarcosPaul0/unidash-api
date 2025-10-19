import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';
import { CourseExtensionComplementaryActivitiesDataRepository } from '../../repositories/course-extension-complementary-activities-data-repository';

interface FindCourseExtensionComplementaryActivitiesDataByIdUseCaseRequest {
  courseExtensionComplementaryActivitiesDataId: string;
  sessionUser: SessionUser;
}

type FindCourseExtensionComplementaryActivitiesDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData;
  }
>;

@Injectable()
export class FindCourseExtensionComplementaryActivitiesDataByIdUseCase {
  constructor(
    private courseExtensionComplementaryActivitiesDataRepository: CourseExtensionComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseExtensionComplementaryActivitiesDataId,
    sessionUser,
  }: FindCourseExtensionComplementaryActivitiesDataByIdUseCaseRequest): Promise<FindCourseExtensionComplementaryActivitiesDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseExtensionComplementaryActivitiesData =
      await this.courseExtensionComplementaryActivitiesDataRepository.findById(
        courseExtensionComplementaryActivitiesDataId,
      );

    if (!courseExtensionComplementaryActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseExtensionComplementaryActivitiesData,
    });
  }
}
