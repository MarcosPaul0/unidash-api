import { Either } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherCourse, TeacherRole } from '@/domain/entities/teacher-course';
import { User, UserRole } from '@/domain/entities/user';

export type EnsureUserRoleResponse = Either<NotAllowedError, User>;

export type EnsureTeacherHasCoursePermissionResponse = Either<
  NotAllowedError,
  TeacherCourse
>;

export abstract class Authorization {
  abstract ensureUserRole(
    sessionUser: User,
    allowedRoles: UserRole[],
  ): Promise<EnsureUserRoleResponse>;
  abstract ensureTeacherHasCoursePermission(
    sessionUser: User,
    courseId: string,
    allowedRoles: TeacherRole[],
  ): Promise<EnsureTeacherHasCoursePermissionResponse>;
}
