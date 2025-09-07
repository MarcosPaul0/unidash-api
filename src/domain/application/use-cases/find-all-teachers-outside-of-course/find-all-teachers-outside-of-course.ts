import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import {
  FindAllTeachersFilter,
  TeachersRepository,
} from '../../repositories/teacher-repository';
import { Teacher } from '@/domain/entities/teacher';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface FindAllTeachersOutsideOfCourseUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllTeachersFilter;
  sessionUser: SessionUser;
}

type FindAllTeachersOutsideOfCourseUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    teachers: Teacher[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllTeachersOutsideOfCourseUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private teachersRepository: TeachersRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllTeachersOutsideOfCourseUseCaseRequest): Promise<FindAllTeachersOutsideOfCourseUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    const teachersWithPagination =
      await this.teachersRepository.findAllOutsideOfCourse(
        courseId,
        pagination,
        filters,
      );

    return right(teachersWithPagination);
  }
}
