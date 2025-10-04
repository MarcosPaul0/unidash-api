import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import {
  CourseActiveStudentsDataRepository,
  FindAllCourseActiveStudentsDataFilter,
} from '../../repositories/course-active-students-data-repository';
import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';

interface FindAllCourseActiveStudentsDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseActiveStudentsDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseActiveStudentsDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseActiveStudentsData: CourseActiveStudentsData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseActiveStudentsDataUseCase {
  constructor(
    private courseActiveStudentsDataRepository: CourseActiveStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseActiveStudentsDataUseCaseRequest): Promise<FindAllCourseActiveStudentsDataUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseActiveStudentsData =
      await this.courseActiveStudentsDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseActiveStudentsData);
  }
}
