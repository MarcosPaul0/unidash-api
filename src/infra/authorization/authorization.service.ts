import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherCoursesRepository } from '@/domain/application/repositories/teacher-courses-repository';
import { TeacherCourse, TeacherRole } from '@/domain/entities/teacher-course';
import { User } from '@/domain/entities/user';
import { Injectable } from '@nestjs/common';

type EnsureAdminResponse = Either<NotAllowedError, User>;

type EnsureTeacherHasCoursePermissionResponse = Either<
  NotAllowedError,
  TeacherCourse
>;

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly teacherCoursesRepository: TeacherCoursesRepository,
  ) {}

  async ensureAdmin(sessionUser: User): Promise<EnsureAdminResponse> {
    if (sessionUser.role !== 'admin') {
      return left(new NotAllowedError());
    }

    return right(sessionUser);
  }

  async ensureTeacherHasCoursePermission(
    sessionUser: User,
    courseId: string,
    allowedRoles: TeacherRole[],
  ): Promise<EnsureTeacherHasCoursePermissionResponse> {
    if (sessionUser.role != 'teacher') {
      return left(new NotAllowedError());
    }

    const userId = sessionUser.id.toString();

    const teacherCourse =
      await this.teacherCoursesRepository.findByUserAndCourseId(
        userId,
        courseId,
      );

    if (!teacherCourse) {
      return left(new NotAllowedError());
    }

    const hasCoursePermission = allowedRoles.includes(
      teacherCourse.teacherRole,
    );

    if (!hasCoursePermission) {
      return left(new NotAllowedError());
    }

    return right(teacherCourse);
  }
}
