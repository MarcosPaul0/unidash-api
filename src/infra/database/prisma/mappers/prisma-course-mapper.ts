import {
  Course as PrismaCourse,
  TeacherCourse as PrismaTeacherCourse,
  Teacher as PrismaTeacher,
  User as PrismaUser,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Course } from '@/domain/entities/course';
import { FindWithTeachers } from '@/domain/application/repositories/courses-repository';
import { PrismaTeacherCourseMapper } from './prisma-teacher-course-mapper';

type PrismaTeacherUser = PrismaTeacher & {
  user: PrismaUser;
};

type PrismaTeacherCourseWithTeacher = PrismaTeacherCourse & {
  teacher: PrismaTeacherUser;
};

type PrismaCourseWithTeachers = PrismaCourse & {
  teacherCourse: PrismaTeacherCourseWithTeacher[];
};

export class PrismaCourseMapper {
  static toDomain(raw: PrismaCourse): Course {
    return Course.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static withTeachersToDomain(raw: PrismaCourseWithTeachers): FindWithTeachers {
    return {
      course: Course.create(
        {
          name: raw.name,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        },
        new UniqueEntityId(raw.id),
      ),
      teacherCourse: raw.teacherCourse.map((currentTeacherCourse) =>
        PrismaTeacherCourseMapper.toDomainWithTeacher(currentTeacherCourse),
      ),
    };
  }

  static toPrisma(user: Course): Prisma.CourseUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
