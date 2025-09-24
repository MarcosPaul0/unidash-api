import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import {
  CourseStudentsDataRepository,
  FindAllCourseStudentsDataFilter,
} from '../../repositories/course-students-data-repository';
import { CourseStudentsData } from '@/domain/entities/course-students-data';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

interface FindAllCourseStudentsDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseStudentsDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseStudentsDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseStudentsData: CourseStudentsData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseStudentsDataUseCase {
  constructor(
    private courseStudentsDataRepository: CourseStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseStudentsDataUseCaseRequest): Promise<FindAllCourseStudentsDataUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    console.log({ courseId, filters });

    const courseStudentsData = await this.courseStudentsDataRepository.findAll(
      courseId,
      pagination,
      filters,
    );

    return right(courseStudentsData);
  }
}
