import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { Course } from '@/domain/entities/course';

interface FindCourseByIdUseCaseRequest {
  courseId: string;
  sessionUser: SessionUser;
}

type FindCourseByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    course: Course;
  }
>;

@Injectable()
export class FindCourseByIdUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    sessionUser,
  }: FindCourseByIdUseCaseRequest): Promise<FindCourseByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    return right({
      course,
    });
  }
}
