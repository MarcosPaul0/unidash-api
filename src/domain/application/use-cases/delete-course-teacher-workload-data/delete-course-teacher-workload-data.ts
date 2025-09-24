import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseTeacherWorkloadDataRepository } from '../../repositories/course-teacher-workload-data-repository';

interface DeleteCourseTeacherWorkloadDataUseCaseRequest {
  courseTeacherWorkloadDataId: string;
  sessionUser: SessionUser;
}

type DeleteTeacherWorkloadDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseTeacherWorkloadDataUseCase {
  constructor(
    private teacherWorkloadDataRepository: CourseTeacherWorkloadDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseTeacherWorkloadDataId,
    sessionUser,
  }: DeleteCourseTeacherWorkloadDataUseCaseRequest): Promise<DeleteTeacherWorkloadDataUseCaseResponse> {
    const teacherWorkloadData =
      await this.teacherWorkloadDataRepository.findById(
        courseTeacherWorkloadDataId,
      );

    if (!teacherWorkloadData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        teacherWorkloadData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    if (teacherWorkloadData.teacher?.id.toString() !== sessionUser.id) {
      left(new NotAllowedError());
    }

    await this.teacherWorkloadDataRepository.delete(teacherWorkloadData);

    return right({});
  }
}
