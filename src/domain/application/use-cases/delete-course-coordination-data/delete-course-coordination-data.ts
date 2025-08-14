import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { User } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseCoordinationDataRepository } from '../../repositories/course-coordination-data-repository';

interface DeleteCourseCoordinationDataUseCaseRequest {
  courseCoordinationDataId: string;
  sessionUser: User;
}

type DeleteCourseCoordinationDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseCoordinationDataUseCase {
  constructor(
    private courseCoordinationDataRepository: CourseCoordinationDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseCoordinationDataId,
    sessionUser,
  }: DeleteCourseCoordinationDataUseCaseRequest): Promise<DeleteCourseCoordinationDataUseCaseResponse> {
    const courseCoordinationData =
      await this.courseCoordinationDataRepository.findById(
        courseCoordinationDataId,
      );

    if (!courseCoordinationData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseCoordinationData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseCoordinationDataRepository.delete(courseCoordinationData);

    return right({});
  }
}
