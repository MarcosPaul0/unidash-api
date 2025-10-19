import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';
import { CourseCoordinationDataRepository } from '../../repositories/course-coordination-data-repository';

interface FindCourseCoordinationDataByIdUseCaseRequest {
  courseCoordinationDataId: string;
  sessionUser: SessionUser;
}

type FindCourseCoordinationDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseCoordinationData: CourseCoordinationData;
  }
>;

@Injectable()
export class FindCourseCoordinationDataByIdUseCase {
  constructor(
    private courseCoordinationDataRepository: CourseCoordinationDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseCoordinationDataId,
    sessionUser,
  }: FindCourseCoordinationDataByIdUseCaseRequest): Promise<FindCourseCoordinationDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseCoordinationData =
      await this.courseCoordinationDataRepository.findById(
        courseCoordinationDataId,
      );

    if (!courseCoordinationData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseCoordinationData,
    });
  }
}
