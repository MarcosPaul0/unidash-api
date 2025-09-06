import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Teacher as PrismaTeacher } from '@prisma/client';
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
    const where: Prisma.UserWhereInput = {
      role: 'teacher',
      teacher: {
        isActive: filters?.isActive ?? undefined,
      },
    };

    const or: any = [];

    if (filters?.name) {
      or.push({
        name: {
          contains: filters?.name ?? undefined,
          mode: 'insensitive',
        },
      });
    }

    if (filters?.email) {
      or.push({
        email: {
          contains: filters?.email ?? undefined,
          mode: 'insensitive',
        },
      });
    }

    if (or.length > 0) {
      where['OR'] = or;
    }

    const totalTeachers = await this.prisma.user.count({
      where,
    });

    if (totalTeachers === 0) {
      return {
        teachers: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    const teachers = await this.prisma.user.findMany({
      where,
      include: {
        teacher: true,
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

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

  async findAllOutsideOfCourse(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeachersFilter,
  ): Promise<FindAllTeachers> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const teachers = await this.prisma.user.findMany({
      where: {
        role: 'teacher',
        OR: [
          {
            name: {
              contains: filters?.name ?? undefined,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: filters?.email ?? undefined,
              mode: 'insensitive',
            },
          },
        ],
        teacher: {
          isActive: filters?.isActive ?? undefined,
          teacherCourse: {
            none: {
              courseId,
            },
          },
        },
      },
      include: {
        teacher: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...paginationParams,
    });

    const totalTeachers = await this.prisma.user.count({
      where: {
        role: 'teacher',
        OR: [
          {
            name: {
              contains: filters?.name ?? undefined,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: filters?.email ?? undefined,
              mode: 'insensitive',
            },
          },
        ],
        teacher: {
          isActive: filters?.isActive ?? undefined,
          teacherCourse: {
            none: {
              courseId,
            },
          },
        },
      },
    });

    if (!teachers) {
      return {
        teachers: [],
        totalItems: 0,
        totalPages: 0,
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
      totalPages: pagination
        ? Math.ceil(totalTeachers / pagination.itemsPerPage)
        : 1,
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
