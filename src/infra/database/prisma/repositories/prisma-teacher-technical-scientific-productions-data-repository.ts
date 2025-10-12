import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  FindAllTeacherTechnicalScientificProductionsData,
  FindAllTeacherTechnicalScientificProductionsDataFilter,
  TeacherTechnicalScientificProductionsDataRepository,
} from '@/domain/application/repositories/teacher-technical-scientific-productions-data-repository';
import { TeacherTechnicalScientificProductionsData } from '@/domain/entities/teacher-technical-scientific-productions-data';
import { PrismaTeacherTechnicalScientificProductionsDataMapper } from '../mappers/prisma-teacher-technical-scientific-productions-data-mapper';

@Injectable()
export class PrismaTeacherTechnicalScientificProductionsDataRepository
  implements TeacherTechnicalScientificProductionsDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(
    id: string,
  ): Promise<TeacherTechnicalScientificProductionsData | null> {
    const courseDeparturesData =
      await this.prisma.teacherTechnicalScientificProductionsData.findUnique({
        where: {
          id,
        },
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaTeacherTechnicalScientificProductionsDataMapper.withTeacherToDomain(
      courseDeparturesData,
    );
  }

  async findByPeriod(
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<TeacherTechnicalScientificProductionsData | null> {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      return null;
    }

    const courseDeparturesData =
      await this.prisma.teacherTechnicalScientificProductionsData.findFirst({
        where: {
          teacherId: teacher.id,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaTeacherTechnicalScientificProductionsDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findAllForCourse(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherTechnicalScientificProductionsDataFilter,
  ): Promise<FindAllTeacherTechnicalScientificProductionsData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const teacherTechnicalScientificProductionsData =
      await this.prisma.teacherTechnicalScientificProductionsData.findMany({
        where: {
          teacher: {
            teacherCourse: {
              some: {
                courseId,
              },
            },
          },
          semester: filters?.semester,
          year: filters?.year,
        },
        orderBy: {
          year: 'desc',
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

    const totalTeacherTechnicalScientificProductionsData =
      await this.prisma.teacherTechnicalScientificProductionsData.count({
        where: {
          teacher: {
            teacherCourse: {
              some: {
                courseId,
              },
            },
          },
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!teacherTechnicalScientificProductionsData) {
      return {
        teacherTechnicalScientificProductionsData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      teacherTechnicalScientificProductionsData:
        teacherTechnicalScientificProductionsData.map((data) =>
          PrismaTeacherTechnicalScientificProductionsDataMapper.withTeacherToDomain(
            data,
          ),
        ),
      totalItems: totalTeacherTechnicalScientificProductionsData,
      totalPages: pagination
        ? Math.ceil(
            totalTeacherTechnicalScientificProductionsData /
              pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findAllForTeacher(
    teacherId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherTechnicalScientificProductionsDataFilter,
  ): Promise<FindAllTeacherTechnicalScientificProductionsData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const teacherTechnicalScientificProductionsData =
      await this.prisma.teacherTechnicalScientificProductionsData.findMany({
        where: {
          teacher: {
            userId: teacherId,
          },
          semester: filters?.semester,
          year: filters?.year,
        },
        orderBy: {
          year: 'desc',
        },
        ...paginationParams,
      });

    if (!teacherTechnicalScientificProductionsData) {
      return {
        teacherTechnicalScientificProductionsData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    const totalTeacherTechnicalScientificProductionsData =
      await this.prisma.teacherTechnicalScientificProductionsData.count({
        where: {
          teacher: {
            userId: teacherId,
          },
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    return {
      teacherTechnicalScientificProductionsData:
        teacherTechnicalScientificProductionsData.map((data) =>
          PrismaTeacherTechnicalScientificProductionsDataMapper.toDomain(data),
        ),
      totalItems: totalTeacherTechnicalScientificProductionsData,
      totalPages: pagination
        ? Math.ceil(
            totalTeacherTechnicalScientificProductionsData /
              pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<TeacherTechnicalScientificProductionsData[]> {
    const teacherTechnicalScientificProductionsData =
      await this.prisma.teacherTechnicalScientificProductionsData.findMany({
        where: {
          teacher: {
            teacherCourse: {
              some: {
                courseId,
              },
            },
          },
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
        orderBy: [
          {
            year: 'desc',
          },
          {
            teacher: { user: { name: 'asc' } },
          },
        ],
      });

    return teacherTechnicalScientificProductionsData.map((data) =>
      PrismaTeacherTechnicalScientificProductionsDataMapper.withTeacherToDomain(
        data,
      ),
    );
  }

  async create(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Promise<void> {
    const data =
      PrismaTeacherTechnicalScientificProductionsDataMapper.toPrismaCreate(
        teacherTechnicalScientificProductionsData,
      );

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherTechnicalScientificProductionsData.teacherId,
      },
    });

    if (!teacher) {
      // TODO atualizar para Logger
      console.log('Teacher not exists');
      return;
    }

    await this.prisma.teacherTechnicalScientificProductionsData.create({
      data: {
        ...data,
        teacherId: teacher.id,
      },
    });
  }

  async save(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Promise<void> {
    const data =
      PrismaTeacherTechnicalScientificProductionsDataMapper.toPrismaUpdate(
        teacherTechnicalScientificProductionsData,
      );

    await this.prisma.teacherTechnicalScientificProductionsData.update({
      where: {
        id: teacherTechnicalScientificProductionsData.id.toString(),
      },
      data,
    });
  }

  async delete(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Promise<void> {
    await this.prisma.teacherTechnicalScientificProductionsData.delete({
      where: {
        id: teacherTechnicalScientificProductionsData.id.toString(),
      },
    });
  }
}
