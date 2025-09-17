import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';
import {
  CourseExtensionActivitiesDataRepository,
  FindAllCourseExtensionActivitiesDataFilter,
} from '../../repositories/course-extension-activities-data-repository';

interface FindAllCourseExtensionActivitiesDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseExtensionActivitiesDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseExtensionActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseExtensionActivitiesData: CourseExtensionActivitiesData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseExtensionActivitiesDataUseCase {
  constructor(
    private courseExtensionActivitiesDataRepository: CourseExtensionActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseExtensionActivitiesDataUseCaseRequest): Promise<FindAllCourseExtensionActivitiesDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseExtensionActivitiesData =
      await this.courseExtensionActivitiesDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseExtensionActivitiesData);
  }
}
