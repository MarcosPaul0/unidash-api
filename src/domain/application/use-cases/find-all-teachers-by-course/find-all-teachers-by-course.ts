import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Pagination } from '@/core/pagination/pagination';
import { User } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { TeacherCourse } from '@/domain/entities/teacher-course';
import { TeacherCoursesRepository } from '../../repositories/teacher-courses-repository';

interface FindAllTeachersByCourseUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  sessionUser: User;
}

type FindAllTeachersByCourseUseCaseResponse = Either<
  NotAllowedError,
  {
    teacherCourses: TeacherCourse[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllTeachersByCourseUseCase {
  constructor(
    private teacherCoursesRepository: TeacherCoursesRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    sessionUser,
  }: FindAllTeachersByCourseUseCaseRequest): Promise<FindAllTeachersByCourseUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherCoursesWithPagination =
      await this.teacherCoursesRepository.findAllByCourseId(
        courseId,
        pagination,
      );

    return right(teacherCoursesWithPagination);
  }
}
