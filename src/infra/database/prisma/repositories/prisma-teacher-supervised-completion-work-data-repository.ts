import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  FindAllTeacherSupervisedCompletionWorkData,
  FindAllTeacherSupervisedCompletionWorkDataFilter,
  TeacherSupervisedCompletionWorkDataRepository,
} from '@/domain/application/repositories/teacher-supervised-completion-work-data-repository';
import { TeacherSupervisedCompletionWorkData } from '@/domain/entities/teacher-supervised-completion-work-data';
import { PrismaTeacherSupervisedCompletionWorkDataMapper } from '../mappers/prisma-teacher-supervised-completion-work-data-mapper';

@Injectable()
export class PrismaTeacherSupervisedCompletionWorkDataRepository
  implements TeacherSupervisedCompletionWorkDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(
    id: string,
  ): Promise<TeacherSupervisedCompletionWorkData | null> {
    const courseDeparturesData =
      await this.prisma.teacherSupervisedCompletionWorkData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaTeacherSupervisedCompletionWorkDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findByCourseTeacherAndPeriod(
    courseId: string,
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<TeacherSupervisedCompletionWorkData | null> {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      return null;
    }

    const courseDeparturesData =
      await this.prisma.teacherSupervisedCompletionWorkData.findFirst({
        where: {
          courseId,
          teacherId: teacher.id,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaTeacherSupervisedCompletionWorkDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherSupervisedCompletionWorkDataFilter,
  ): Promise<FindAllTeacherSupervisedCompletionWorkData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const teacherSupervisedCompletionWorkData =
      await this.prisma.teacherSupervisedCompletionWorkData.findMany({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
        },
        ...paginationParams,
      });

    const totalTeacherSupervisedCompletionWorkData =
      await this.prisma.teacherSupervisedCompletionWorkData.count({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!teacherSupervisedCompletionWorkData) {
      return {
        teacherSupervisedCompletionWorkData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      teacherSupervisedCompletionWorkData:
        teacherSupervisedCompletionWorkData.map((data) =>
          PrismaTeacherSupervisedCompletionWorkDataMapper.withTeacherToDomain(
            data,
          ),
        ),
      totalItems: totalTeacherSupervisedCompletionWorkData,
      totalPages: pagination
        ? Math.ceil(
            totalTeacherSupervisedCompletionWorkData / pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findAllForTeacher(
    teacherId: string,
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherSupervisedCompletionWorkDataFilter,
  ): Promise<FindAllTeacherSupervisedCompletionWorkData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const teacherSupervisedCompletionWorkData =
      await this.prisma.teacherSupervisedCompletionWorkData.findMany({
        where: {
          teacher: {
            userId: teacherId,
          },
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...paginationParams,
      });

    const totalTeacherSupervisedCompletionWorkData =
      await this.prisma.teacherSupervisedCompletionWorkData.count({
        where: {
          teacher: {
            userId: teacherId,
          },
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!teacherSupervisedCompletionWorkData) {
      return {
        teacherSupervisedCompletionWorkData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      teacherSupervisedCompletionWorkData:
        teacherSupervisedCompletionWorkData.map((data) =>
          PrismaTeacherSupervisedCompletionWorkDataMapper.toDomain(data),
        ),
      totalItems: totalTeacherSupervisedCompletionWorkData,
      totalPages: pagination
        ? Math.ceil(
            totalTeacherSupervisedCompletionWorkData / pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<TeacherSupervisedCompletionWorkData[]> {
    const teacherSupervisedCompletionWorkData =
      await this.prisma.teacherSupervisedCompletionWorkData.findMany({
        where: {
          courseId,
          semester: filters?.semester,
          ...(filters?.year
            ? { year: filters.year }
            : {
                year: {
                  gte: filters?.yearFrom,
                  lte: filters?.yearTo,
                },
              }),
        },
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          year: 'desc',
        },
      });

    return teacherSupervisedCompletionWorkData.map((data) =>
      PrismaTeacherSupervisedCompletionWorkDataMapper.withTeacherToDomain(data),
    );
  }

  async create(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Promise<void> {
    const data = PrismaTeacherSupervisedCompletionWorkDataMapper.toPrismaCreate(
      teacherSupervisedCompletionWorkData,
    );

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherSupervisedCompletionWorkData.teacherId,
      },
    });

    if (!teacher) {
      // TODO atualizar para Logger
      console.log('Teacher not exists');
      return;
    }

    await this.prisma.teacherSupervisedCompletionWorkData.create({
      data: {
        ...data,
        teacherId: teacher.id,
      },
    });
  }

  async save(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Promise<void> {
    const data = PrismaTeacherSupervisedCompletionWorkDataMapper.toPrismaUpdate(
      teacherSupervisedCompletionWorkData,
    );

    await this.prisma.teacherSupervisedCompletionWorkData.update({
      where: {
        id: teacherSupervisedCompletionWorkData.id.toString(),
      },
      data,
    });
  }

  async delete(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Promise<void> {
    await this.prisma.teacherSupervisedCompletionWorkData.delete({
      where: {
        id: teacherSupervisedCompletionWorkData.id.toString(),
      },
    });
  }
}
