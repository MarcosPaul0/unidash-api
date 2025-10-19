import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';
import { CourseCompletionWorkDataRepository } from '../../repositories/course-completion-work-data-repository';
import { Semester } from '@/domain/entities/course-data';

interface UpdateCourseCompletionWorkData {
  year?: number;
  semester?: Semester;
  enrollments?: number;
  defenses?: number;
  abandonments?: number;
}

interface UpdateCourseCompletionWorkDataUseCaseRequest {
  courseCompletionWorkDataId: string;
  data: UpdateCourseCompletionWorkData;
  sessionUser: SessionUser;
}

type UpdateCourseCompletionWorkDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseCompletionWorkData: CourseCompletionWorkData;
  }
>;

@Injectable()
export class UpdateCourseCompletionWorkDataUseCase {
  constructor(
    private courseCompletionWorkDataRepository: CourseCompletionWorkDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseCompletionWorkDataId,
    data,
    sessionUser,
  }: UpdateCourseCompletionWorkDataUseCaseRequest): Promise<UpdateCourseCompletionWorkDataUseCaseResponse> {
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

    Object.assign(courseCompletionWorkData, data);

    await this.courseCompletionWorkDataRepository.save(
      courseCompletionWorkData,
    );

    return right({
      courseCompletionWorkData,
    });
  }
}
