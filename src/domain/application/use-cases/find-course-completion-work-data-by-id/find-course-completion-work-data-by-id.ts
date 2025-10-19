import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';
import { CourseCompletionWorkDataRepository } from '../../repositories/course-completion-work-data-repository';

interface FindCourseCompletionWorkDataByIdUseCaseRequest {
  courseCompletionWorkDataId: string;
  sessionUser: SessionUser;
}

type FindCourseCompletionWorkDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseCompletionWorkData: CourseCompletionWorkData;
  }
>;

@Injectable()
export class FindCourseCompletionWorkDataByIdUseCase {
  constructor(
    private courseCompletionWorkDataRepository: CourseCompletionWorkDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseCompletionWorkDataId,
    sessionUser,
  }: FindCourseCompletionWorkDataByIdUseCaseRequest): Promise<FindCourseCompletionWorkDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseCompletionWorkData =
      await this.courseCompletionWorkDataRepository.findById(
        courseCompletionWorkDataId,
      );

    if (!courseCompletionWorkData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseCompletionWorkData,
    });
  }
}
