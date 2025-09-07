import {
  Teacher as PrismaTeacher,
  User as PrismaUser,
  TeacherCourse as PrismaTeacherCourse,
  Course as PrismaCourse,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Teacher } from '@/domain/entities/teacher';
import { FindWithCourses } from '@/domain/application/repositories/teacher-repository';
import { PrismaTeacherCourseMapper } from './prisma-teacher-course-mapper';

type PrismaUserTeacher = PrismaUser & {
  teacher: PrismaTeacher;
};

type PrismaTeacherUser = PrismaTeacher & {
  user: PrismaUser;
};

type PrismaTeacherCourseWithTeacher = PrismaTeacherCourse & {
  course: PrismaCourse;
};

type PrismaTeacherWithCourses = PrismaTeacherUser & {
  teacherCourse: PrismaTeacherCourseWithTeacher[];
};

export class PrismaTeacherMapper {
  static toDomain(raw: PrismaUserTeacher): Teacher {
    return Teacher.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
        accountActivatedAt: raw.accountActivatedAt,
        isActive: raw.teacher.isActive,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static withCoursesToDomain(raw: PrismaTeacherWithCourses): FindWithCourses {
    return {
      teacher: Teacher.create(
        {
          name: raw.user.name,
          email: raw.user.email,
          password: raw.user.password,
          role: raw.user.role,
          accountActivatedAt: raw.user.accountActivatedAt,
          isActive: raw.isActive,
          createdAt: raw.user.createdAt,
          updatedAt: raw.user.updatedAt,
        },
        new UniqueEntityId(raw.userId),
      ),
      teacherCourse: raw.teacherCourse.map((currentTeacherCourse) =>
        PrismaTeacherCourseMapper.toDomainWithCourse(currentTeacherCourse),
      ),
    };
  }

  static toPrismaCreate(teacher: Teacher): Prisma.UserUncheckedCreateInput {
    return {
      id: teacher.id.toString(),
      teacher: {
        create: {
          isActive: teacher.isActive,
        },
      },
      name: teacher.name,
      email: teacher.email,
      password: teacher.password,
      role: teacher.role,
      accountActivatedAt: teacher.accountActivatedAt,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }

  static toPrismaUpdate(teacher: Teacher): Prisma.UserUncheckedUpdateInput {
    return {
      id: teacher.id.toString(),
      teacher: {
        update: {
          isActive: teacher.isActive,
        },
      },
      name: teacher.name,
      email: teacher.email,
      password: teacher.password,
      role: teacher.role,
      accountActivatedAt: teacher.accountActivatedAt,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }
}
