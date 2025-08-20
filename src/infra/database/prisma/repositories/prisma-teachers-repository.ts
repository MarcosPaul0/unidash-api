import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Teacher as PrismaTeacher } from '@prisma/client';
import { PrismaTeacherMapper } from '../mappers/prisma-teacher-mapper';
import {
  FindAllTeachers,
  FindAllTeachersFilter,
  FindWithCourses,
  TeachersRepository,
} from '@/domain/application/repositories/teacher-repository';
import { Pagination } from '@/core/pagination/pagination';
import { Teacher } from '@/domain/entities/teacher';

@Injectable()
export class PrismaTeachersRepository implements TeachersRepository {
  constructor(private prisma: PrismaService) {}

  async findByIdWithCourses(id: string): Promise<FindWithCourses | null> {
    const teacherWithCourses = await this.prisma.teacher.findUnique({
      where: {
        id,
      },
      include: {
        teacherCourse: {
          include: {
            course: true,
          },
        },
        user: true,
      },
    });

    if (!teacherWithCourses) {
      return null;
    }

    return PrismaTeacherMapper.withCoursesToDomain(teacherWithCourses);
  }

  async findAllWithPagination(
    { itemsPerPage, page }: Pagination,
    filters?: FindAllTeachersFilter,
  ): Promise<FindAllTeachers> {
    const teachers = await this.prisma.user.findMany({
      where: {
        role: 'teacher',
        name: {
          contains: filters?.name ?? undefined,
        },
        teacher: {
          isActive: filters?.isActive ?? undefined,
        },
      },
      include: {
        teacher: true,
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalTeachers = await this.prisma.user.count({
      where: {
        role: 'teacher',
        name: {
          contains: filters?.name ?? undefined,
        },
        teacher: {
          isActive: filters?.isActive ?? undefined,
        },
      },
    });

    if (!teachers) {
      return {
        teachers: [],
        totalItems: 0,
        totalPages: 1,
      };
    }

    return {
      teachers: teachers.map((user) =>
        PrismaTeacherMapper.toDomain({
          ...user,
          teacher: user.teacher as PrismaTeacher,
        }),
      ),
      totalItems: totalTeachers,
      totalPages: Math.ceil(totalTeachers / itemsPerPage),
    };
  }

  async findAll(): Promise<Teacher[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: 'teacher',
      },
      include: {
        teacher: true,
      },
    });

    if (users.length === 0) {
      return [];
    }

    return users.map((user) =>
      PrismaTeacherMapper.toDomain({
        ...user,
        teacher: user.teacher as PrismaTeacher,
      }),
    );
  }

  async findById(id: string): Promise<Teacher | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'teacher',
      },
      include: {
        teacher: true,
      },
    });

    if (!user || !user.teacher) {
      return null;
    }

    return PrismaTeacherMapper.toDomain({
      ...user,
      teacher: user.teacher,
    });
  }

  async save(teacher: Teacher): Promise<void> {
    const data = PrismaTeacherMapper.toPrismaUpdate(teacher);

    await Promise.all([
      this.prisma.user.update({
        where: {
          id: teacher.id.toString(),
        },
        data,
      }),
    ]);
  }

  async create(teacher: Teacher): Promise<void> {
    const data = PrismaTeacherMapper.toPrismaCreate(teacher);

    await Promise.all([
      this.prisma.user.create({
        data,
      }),
    ]);
  }

  async delete(teacher: Teacher): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: teacher.id.toString(),
      },
    });
  }
}
