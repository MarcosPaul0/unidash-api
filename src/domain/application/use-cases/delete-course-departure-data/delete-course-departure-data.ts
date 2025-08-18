import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseDepartureDataRepository } from '../../repositories/course-departure-data-repository';

interface DeleteCourseDepartureDataUseCaseRequest {
  courseDepartureDataId: string;
  sessionUser: SessionUser;
}

type DeleteCourseDepartureDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseDepartureDataUseCase {
  constructor(
    private courseDepartureDataRepository: CourseDepartureDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseDepartureDataId,
    sessionUser,
  }: DeleteCourseDepartureDataUseCaseRequest): Promise<DeleteCourseDepartureDataUseCaseResponse> {
    const courseDepartureData =
      await this.courseDepartureDataRepository.findById(courseDepartureDataId);

    if (!courseDepartureData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseDepartureData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseDepartureDataRepository.delete(courseDepartureData);

    return right({});
  }
}
