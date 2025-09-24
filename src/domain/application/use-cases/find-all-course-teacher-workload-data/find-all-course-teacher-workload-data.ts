import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';
import {
  CourseTeacherWorkloadDataRepository,
  FindAllCourseTeacherWorkloadDataFilter,
} from '../../repositories/course-teacher-workload-data-repository';

interface FindAllCourseTeacherWorkloadDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseTeacherWorkloadDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseTeacherWorkloadDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseTeacherWorkloadData: CourseTeacherWorkloadData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseTeacherWorkloadDataUseCase {
  constructor(
    private courseTeacherWorkloadDataRepository: CourseTeacherWorkloadDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseTeacherWorkloadDataUseCaseRequest): Promise<FindAllCourseTeacherWorkloadDataUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseTeacherWorkloadData =
      await this.courseTeacherWorkloadDataRepository.findAllForCourse(
        courseId,
        pagination,
        filters,
      );

    return right(courseTeacherWorkloadData);
  }
}
