import {
  Student as PrismaStudent,
  User as PrismaUser,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Student } from '@/domain/entities/student';

type PrismaStudentUser = PrismaUser & {
  student: PrismaStudent;
};

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudentUser): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
        accountActivatedAt: raw.accountActivatedAt,
        matriculation: raw.student.matriculation,
        courseId: raw.student.courseId,
        type: raw.student.type,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      student: {
        create: {
          matriculation: student.matriculation,
          courseId: student.courseId,
          type: student.type,
        },
      },
      name: student.name,
      email: student.email,
      password: student.password,
      role: student.role,
      accountActivatedAt: student.accountActivatedAt,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }

  static toPrismaUpdate(student: Student): Prisma.UserUncheckedUpdateInput {
    return {
      id: student.id.toString(),
      student: {
        update: {
          matriculation: student.matriculation,
          courseId: student.courseId,
          type: student.type,
        },
      },
      name: student.name,
      email: student.email,
      password: student.password,
      role: student.role,
      accountActivatedAt: student.accountActivatedAt,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }
}
