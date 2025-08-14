import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { User } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseStudentsDataRepository } from '../../repositories/course-students-data-repository';

interface DeleteCourseStudentsDataUseCaseRequest {
  courseStudentsDataId: string;
  sessionUser: User;
}

type DeleteCourseStudentsDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseStudentsDataUseCase {
  constructor(
    private courseStudentsDataRepository: CourseStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseStudentsDataId,
    sessionUser,
  }: DeleteCourseStudentsDataUseCaseRequest): Promise<DeleteCourseStudentsDataUseCaseResponse> {
    const courseStudentsData =
      await this.courseStudentsDataRepository.findById(courseStudentsDataId);

    if (!courseStudentsData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseStudentsData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseStudentsDataRepository.delete(courseStudentsData);

    return right({});
  }
}
