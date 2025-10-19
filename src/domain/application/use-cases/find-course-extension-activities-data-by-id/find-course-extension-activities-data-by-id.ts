import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';
import { CourseExtensionActivitiesDataRepository } from '../../repositories/course-extension-activities-data-repository';

interface FindCourseExtensionActivitiesDataByIdUseCaseRequest {
  courseExtensionActivitiesDataId: string;
  sessionUser: SessionUser;
}

type FindCourseExtensionActivitiesDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseExtensionActivitiesData: CourseExtensionActivitiesData;
  }
>;

@Injectable()
export class FindCourseExtensionActivitiesDataByIdUseCase {
  constructor(
    private courseExtensionActivitiesDataRepository: CourseExtensionActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseExtensionActivitiesDataId,
    sessionUser,
  }: FindCourseExtensionActivitiesDataByIdUseCaseRequest): Promise<FindCourseExtensionActivitiesDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseExtensionActivitiesData =
      await this.courseExtensionActivitiesDataRepository.findById(
        courseExtensionActivitiesDataId,
      );

    if (!courseExtensionActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseExtensionActivitiesData,
    });
  }
}
