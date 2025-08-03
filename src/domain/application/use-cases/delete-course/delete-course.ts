import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { User } from '@/domain/entities/user';
import { CoursesRepository } from '../../repositories/courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteCourseUseCaseRequest {
  courseId: string;
  sessionUser: User;
}

type DeleteCourseUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    sessionUser,
  }: DeleteCourseUseCaseRequest): Promise<DeleteCourseUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureAdmin(sessionUser);

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    await this.coursesRepository.delete(course);

    return right({});
  }
}
