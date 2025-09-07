import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import {
  CourseCompletionWorkDataRepository,
  FindAllCourseCompletionWorkDataFilter,
} from '../../repositories/course-completion-work-data-repository';
import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';

interface FindAllCourseCompletionWorkDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllCourseCompletionWorkDataFilter;
  sessionUser: SessionUser;
}

type FindAllCourseCompletionWorkDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseCompletionWorkData: CourseCompletionWorkData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseCompletionWorkDataUseCase {
  constructor(
    private courseCompletionWorkDataRepository: CourseCompletionWorkDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllCourseCompletionWorkDataUseCaseRequest): Promise<FindAllCourseCompletionWorkDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseCompletionWorkData =
      await this.courseCompletionWorkDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(courseCompletionWorkData);
  }
}
