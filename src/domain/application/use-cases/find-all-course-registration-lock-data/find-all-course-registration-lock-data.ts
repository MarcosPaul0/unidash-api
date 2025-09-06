import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import {
  CourseRegistrationLockDataRepository,
  FindAllCourseRegistrationLockDataFilter,
} from '../../repositories/course-registration-lock-data-repository';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

interface FindAllCourseRegistrationLockDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseRegistrationLockDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseRegistrationLockDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseRegistrationLockData: CourseRegistrationLockData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseRegistrationLockDataUseCase {
  constructor(
    private courseRegistrationLockDataRepository: CourseRegistrationLockDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseRegistrationLockDataUseCaseRequest): Promise<FindAllCourseRegistrationLockDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseRegistrationLockData =
      await this.courseRegistrationLockDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseRegistrationLockData);
  }
}
