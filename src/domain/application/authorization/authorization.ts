import { Either } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherRole } from '@/domain/entities/teacher-course';
import { SessionUser, UserRole } from '@/domain/entities/user';

export type EnsureUserRoleResponse = Either<NotAllowedError, void>;

export type EnsureTeacherHasCoursePermissionResponse = Either<
  NotAllowedError,
  void
>;

export abstract class Authorization {
  abstract ensureUserRole(
    sessionUser: SessionUser,
    allowedRoles: UserRole[],
  ): Promise<EnsureUserRoleResponse>;
  abstract ensureIsAdminOrTeacherWithRole(
    sessionUser: SessionUser,
    courseId: string,
    allowedRoles: TeacherRole[],
  ): Promise<EnsureTeacherHasCoursePermissionResponse>;
}
