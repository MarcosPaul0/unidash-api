import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import {
  CourseDepartureDataRepository,
  FindAllCourseDepartureDataFilter,
} from '../../repositories/course-departure-data-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

interface FindAllCourseDepartureDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseDepartureDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseDepartureDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseDepartureData: CourseDepartureData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseDepartureDataUseCase {
  constructor(
    private courseDepartureDataRepository: CourseDepartureDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseDepartureDataUseCaseRequest): Promise<FindAllCourseDepartureDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseDepartureData =
      await this.courseDepartureDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseDepartureData);
  }
}
