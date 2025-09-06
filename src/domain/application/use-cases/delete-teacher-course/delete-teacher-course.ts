import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { TeacherCoursesRepository } from '../../repositories/teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';

interface DeleteTeacherCourseUseCaseRequest {
  teacherCourseId: string;
  sessionUser: SessionUser;
}

type DeleteTeacherCourseUseCaseResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>;

@Injectable()
export class DeleteTeacherCourseUseCase {
  constructor(
    private teacherCoursesRepository: TeacherCoursesRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherCourseId,
    sessionUser,
  }: DeleteTeacherCourseUseCaseRequest): Promise<DeleteTeacherCourseUseCaseResponse> {
    const teacherCourse =
      await this.teacherCoursesRepository.findById(teacherCourseId);

    if (!teacherCourse) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        teacherCourse.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.teacherCoursesRepository.delete(teacherCourse);

    return right({});
  }
}
