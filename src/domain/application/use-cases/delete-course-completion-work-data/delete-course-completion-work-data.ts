import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseCompletionWorkDataRepository } from '../../repositories/course-completion-work-data-repository';

interface DeleteCourseCompletionWorkDataUseCaseRequest {
  courseCompletionWorkDataId: string;
  sessionUser: SessionUser;
}

type DeleteCourseCompletionWorkDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseCompletionWorkDataUseCase {
  constructor(
    private courseCompletionWorkDataRepository: CourseCompletionWorkDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseCompletionWorkDataId,
    sessionUser,
  }: DeleteCourseCompletionWorkDataUseCaseRequest): Promise<DeleteCourseCompletionWorkDataUseCaseResponse> {
    const courseCompletionWorkData =
      await this.courseCompletionWorkDataRepository.findById(
        courseCompletionWorkDataId,
      );

    if (!courseCompletionWorkData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseCompletionWorkData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseCompletionWorkDataRepository.delete(
      courseCompletionWorkData,
    );

    return right({});
  }
}
