import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import {
  CourseInternshipDataRepository,
  FindAllCourseInternshipDataFilter,
} from '../../repositories/course-internship-data-repository';
import { CourseInternshipData } from '@/domain/entities/course-internship-data';

interface FindAllCourseInternshipDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseInternshipDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseInternshipDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseInternshipData: CourseInternshipData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseInternshipDataUseCase {
  constructor(
    private courseInternshipDataRepository: CourseInternshipDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseInternshipDataUseCaseRequest): Promise<FindAllCourseInternshipDataUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['internshipManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseInternshipData =
      await this.courseInternshipDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseInternshipData);
  }
}
