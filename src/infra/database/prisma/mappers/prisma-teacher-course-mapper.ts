import {
  Teacher as PrismaTeacher,
  Course as PrismaCourse,
  TeacherCourse as PrismaTeacherCourse,
  User as PrismaUser,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TeacherCourse } from '@/domain/entities/teacher-course';
import { Course } from '@/domain/entities/course';
import { Teacher } from '@/domain/entities/teacher';

type PrismaTeacherUser = PrismaTeacher & {
  user: PrismaUser;
};

type PrismaTeacherCourseWithTeacher = PrismaTeacherCourse & {
  teacher: PrismaTeacherUser;
};

type PrismaTeacherCourseWithCourse = PrismaTeacherCourse & {
  course: PrismaCourse;
};

type PrismaTeacherCourseWithTeacherAndCourse = PrismaTeacherCourse & {
  teacher: PrismaTeacherUser;
  course: PrismaCourse;
};

export class PrismaTeacherCourseMapper {
  static toDomain(raw: PrismaTeacherCourse): TeacherCourse {
    return TeacherCourse.create(
      {
        teacherRole: raw.teacherRole,
        teacherId: raw.teacherId,
        courseId: raw.courseId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toDomainWithCourse(raw: PrismaTeacherCourseWithCourse): TeacherCourse {
    return TeacherCourse.create(
      {
        teacherRole: raw.teacherRole,
        teacherId: raw.teacherId,
        courseId: raw.courseId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        course: Course.create(raw.course),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toDomainWithTeacher(
    raw: PrismaTeacherCourseWithTeacher,
  ): TeacherCourse {
    return TeacherCourse.create(
      {
        teacherRole: raw.teacherRole,
        teacherId: raw.teacherId,
        courseId: raw.courseId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        teacher: Teacher.create(
          {
            name: raw.teacher.user.name,
            email: raw.teacher.user.email,
            isActive: raw.teacher.isActive,
            password: raw.teacher.user.password,
            role: raw.teacher.user.role,
            accountActivatedAt: raw.teacher.user.accountActivatedAt,
            createdAt: raw.teacher.user.createdAt,
            updatedAt: raw.teacher.user.updatedAt,
          },
          new UniqueEntityId(raw.teacher.userId),
        ),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toDomainWithTeacherAndCourse(
    raw: PrismaTeacherCourseWithTeacherAndCourse,
  ): TeacherCourse {
    return TeacherCourse.create(
      {
        teacherRole: raw.teacherRole,
        teacherId: raw.teacherId,
        courseId: raw.courseId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        course: Course.create(raw.course, new UniqueEntityId(raw.course.id)),
        teacher: Teacher.create(
          {
            name: raw.teacher.user.name,
            email: raw.teacher.user.email,
            isActive: raw.teacher.isActive,
            password: raw.teacher.user.password,
            role: raw.teacher.user.role,
            accountActivatedAt: raw.teacher.user.accountActivatedAt,
            createdAt: raw.teacher.user.createdAt,
            updatedAt: raw.teacher.user.updatedAt,
          },
          new UniqueEntityId(raw.teacher.user.id),
        ),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    teacherCourse: TeacherCourse,
  ): Prisma.TeacherCourseUncheckedCreateInput {
    return {
      id: teacherCourse.id.toString(),
      teacherRole: teacherCourse.teacherRole,
      courseId: teacherCourse.courseId,
      teacherId: teacherCourse.teacherId,
      createdAt: teacherCourse.createdAt,
      updatedAt: teacherCourse.updatedAt,
    };
  }

  static toPrismaUpdate(
    teacherCourse: TeacherCourse,
  ): Prisma.TeacherCourseUncheckedUpdateInput {
    return {
      id: teacherCourse.id.toString(),
      teacherRole: teacherCourse.teacherRole,
      courseId: teacherCourse.courseId,
      teacherId: teacherCourse.teacherId,
      createdAt: teacherCourse.createdAt,
      updatedAt: teacherCourse.updatedAt,
    };
  }
}
