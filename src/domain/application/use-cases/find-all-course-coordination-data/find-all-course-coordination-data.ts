import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import {
  CourseCoordinationDataRepository,
  FindAllCourseCoordinationDataFilter,
} from '../../repositories/course-coordination-data-repository';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';

interface FindAllCourseCoordinationDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseCoordinationDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseCoordinationDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseCoordinationData: CourseCoordinationData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseCoordinationDataUseCase {
  constructor(
    private courseCoordinationDataRepository: CourseCoordinationDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseCoordinationDataUseCaseRequest): Promise<FindAllCourseCoordinationDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseCoordinationData =
      await this.courseCoordinationDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseCoordinationData);
  }
}
