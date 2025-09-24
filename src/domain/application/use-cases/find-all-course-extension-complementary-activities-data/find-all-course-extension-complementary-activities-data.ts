import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import {
  CourseExtensionComplementaryActivitiesDataRepository,
  FindAllCourseExtensionComplementaryActivitiesDataFilter,
} from '../../repositories/course-extension-complementary-activities-data-repository';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';

interface FindAllCourseExtensionComplementaryActivitiesDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseExtensionComplementaryActivitiesDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseExtensionComplementaryActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseExtensionComplementaryActivitiesDataUseCase {
  constructor(
    private courseExtensionComplementaryActivitiesDataRepository: CourseExtensionComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseExtensionComplementaryActivitiesDataUseCaseRequest): Promise<FindAllCourseExtensionComplementaryActivitiesDataUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['complementaryActivitiesManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseExtensionComplementaryActivitiesData =
      await this.courseExtensionComplementaryActivitiesDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseExtensionComplementaryActivitiesData);
  }
}
