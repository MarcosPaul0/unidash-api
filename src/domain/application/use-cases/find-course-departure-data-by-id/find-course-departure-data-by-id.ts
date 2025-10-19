import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { CourseDepartureDataRepository } from '../../repositories/course-departure-data-repository';

interface FindCourseDepartureDataByIdUseCaseRequest {
  courseDepartureDataId: string;
  sessionUser: SessionUser;
}

type FindCourseDepartureDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseDepartureData: CourseDepartureData;
  }
>;

@Injectable()
export class FindCourseDepartureDataByIdUseCase {
  constructor(
    private courseDepartureDataRepository: CourseDepartureDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseDepartureDataId,
    sessionUser,
  }: FindCourseDepartureDataByIdUseCaseRequest): Promise<FindCourseDepartureDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseDepartureData =
      await this.courseDepartureDataRepository.findById(courseDepartureDataId);

    if (!courseDepartureData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseDepartureData,
    });
  }
}
