import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseActiveStudentsDataRepository } from '../../repositories/course-active-students-data-repository';

interface DeleteCourseActiveStudentsDataUseCaseRequest {
  courseActiveStudentsDataId: string;
  sessionUser: SessionUser;
}

type DeleteCourseActiveStudentsDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseActiveStudentsDataUseCase {
  constructor(
    private courseActiveStudentsDataRepository: CourseActiveStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseActiveStudentsDataId,
    sessionUser,
  }: DeleteCourseActiveStudentsDataUseCaseRequest): Promise<DeleteCourseActiveStudentsDataUseCaseResponse> {
    const courseActiveStudentsData =
      await this.courseActiveStudentsDataRepository.findById(
        courseActiveStudentsDataId,
      );

    if (!courseActiveStudentsData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseActiveStudentsData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseActiveStudentsDataRepository.delete(
      courseActiveStudentsData,
    );

    return right({});
  }
}
