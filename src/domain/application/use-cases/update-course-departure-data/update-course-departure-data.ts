import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { CourseDepartureDataRepository } from '../../repositories/course-departure-data-repository';

interface UpdateCourseDepartureData {
  completed?: number;
  maximumDuration?: number;
  dropouts?: number;
  transfers?: number;
  withdrawals?: number;
  removals?: number;
  newExams?: number;
  deaths?: number;
}

interface UpdateCourseDepartureDataUseCaseRequest {
  courseDepartureDataId: string;
  data: UpdateCourseDepartureData;
  sessionUser: SessionUser;
}

type UpdateCourseDepartureDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseDepartureData: CourseDepartureData;
  }
>;

@Injectable()
export class UpdateCourseDepartureDataUseCase {
  constructor(
    private courseDepartureDataRepository: CourseDepartureDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseDepartureDataId,
    data,
    sessionUser,
  }: UpdateCourseDepartureDataUseCaseRequest): Promise<UpdateCourseDepartureDataUseCaseResponse> {
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

    Object.assign(courseDepartureData, data);

    await this.courseDepartureDataRepository.save(courseDepartureData);

    return right({
      courseDepartureData,
    });
  }
}
