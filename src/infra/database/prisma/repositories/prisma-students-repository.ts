import { Injectable } from '@nestjs/common';
import { Student as PrismaStudent } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';
import {
  StudentsRepository,
  FindAllStudents,
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

  async findAll({ itemsPerPage, page }: Pagination): Promise<FindAllStudents> {
    const students = await this.prisma.user.findMany({
      where: {
        role: 'student',
      },
      include: {
        student: true,
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalStudents = await this.prisma.user.count({
      where: {
        role: 'student',
      },
    });

    if (!students) {
      return {
        students: [],
        totalItems: 0,
        totalPages: 1,
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
      totalPages: Math.ceil(totalStudents / itemsPerPage),
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
