import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';
import {
  CourseTeachingComplementaryActivitiesDataRepository,
  FindAllCourseTeachingComplementaryActivitiesDataFilter,
} from '../../repositories/course-teaching-complementary-activities-data-repository';

interface FindAllCourseTeachingComplementaryActivitiesDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseTeachingComplementaryActivitiesDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseTeachingComplementaryActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseTeachingComplementaryActivitiesDataUseCase {
  constructor(
    private courseTeachingComplementaryActivitiesDataRepository: CourseTeachingComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseTeachingComplementaryActivitiesDataUseCaseRequest): Promise<FindAllCourseTeachingComplementaryActivitiesDataUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['complementaryActivitiesManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseTeachingComplementaryActivitiesData =
      await this.courseTeachingComplementaryActivitiesDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseTeachingComplementaryActivitiesData);
  }
}
