import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import {
  CourseSearchComplementaryActivitiesDataRepository,
  FindAllCourseSearchComplementaryActivitiesDataFilter,
} from '../../repositories/course-search-complementary-activities-data-repository';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';

interface FindAllCourseSearchComplementaryActivitiesDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseSearchComplementaryActivitiesDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseSearchComplementaryActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseSearchComplementaryActivitiesDataUseCase {
  constructor(
    private courseSearchComplementaryActivitiesDataRepository: CourseSearchComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseSearchComplementaryActivitiesDataUseCaseRequest): Promise<FindAllCourseSearchComplementaryActivitiesDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseSearchComplementaryActivitiesData =
      await this.courseSearchComplementaryActivitiesDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseSearchComplementaryActivitiesData);
  }
}
