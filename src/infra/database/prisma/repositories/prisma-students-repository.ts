import { Injectable } from '@nestjs/common';
import { Student as PrismaStudent } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';
import {
  StudentsRepository,
  FindAllStudents,
  FindAllStudentsFilters,
} from '@/domain/application/repositories/students-repository';
import { Pagination } from '@/core/pagination/pagination';
import { Student } from '@/domain/entities/student';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Student | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'student',
      },
      include: {
        student: true,
      },
    });

    if (!user || !user.student) {
      return null;
    }

    return PrismaStudentMapper.toDomain({
      ...user,
      student: user.student,
    });
  }

  async findByMatriculation(matriculation: string): Promise<Student | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        student: {
          matriculation,
        },
        role: 'student',
      },
      include: {
        student: true,
      },
    });

    if (!user || !user.student) {
      return null;
    }

    return PrismaStudentMapper.toDomain({
      ...user,
      student: user.student,
    });
  }

  async findAll(
    pagination?: Pagination,
    filters?: FindAllStudentsFilters,
  ): Promise<FindAllStudents> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const students = await this.prisma.user.findMany({
      where: {
        role: 'student',
        student: {
          courseId: filters?.courseId,
        },
      },
      include: {
        student: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...paginationParams,
    });

    const totalStudents = await this.prisma.user.count({
      where: {
        role: 'student',
        student: {
          courseId: filters?.courseId,
        },
      },
    });

    if (!students) {
      return {
        students: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      students: students.map((user) =>
        PrismaStudentMapper.toDomain({
          ...user,
          student: user.student as PrismaStudent,
        }),
      ),
      totalItems: totalStudents,
      totalPages: pagination
        ? Math.ceil(totalStudents / pagination.itemsPerPage)
        : 1,
    };
  }

  async save(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrismaUpdate(student);

    await Promise.all([
      this.prisma.user.update({
        where: {
          id: student.id.toString(),
        },
        data,
      }),
    ]);
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrismaCreate(student);

    await Promise.all([
      this.prisma.user.create({
        data,
      }),
    ]);
  }

  async delete(student: Student): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: student.id.toString(),
      },
    });
  }
}
