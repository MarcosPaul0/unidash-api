import { left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import {
  Authorization,
  EnsureUserRoleResponse,
  EnsureTeacherHasCoursePermissionResponse,
} from '@/domain/application/authorization/authorization';
import { TeacherCoursesRepository } from '@/domain/application/repositories/teacher-courses-repository';
import { TeacherRole } from '@/domain/entities/teacher-course';
import { User, UserRole } from '@/domain/entities/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizationService implements Authorization {
  constructor(
    private readonly teacherCoursesRepository: TeacherCoursesRepository,
  ) {}

  async ensureUserRole(
    sessionUser: User,
    allowedRoles: UserRole[],
  ): Promise<EnsureUserRoleResponse> {
    if (!allowedRoles.includes(sessionUser.role)) {
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
