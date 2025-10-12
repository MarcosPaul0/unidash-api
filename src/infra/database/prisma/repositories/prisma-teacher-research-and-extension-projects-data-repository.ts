import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  FindAllTeacherResearchAndExtensionProjectsData,
  FindAllTeacherResearchAndExtensionProjectsDataFilter,
  TeacherResearchAndExtensionProjectsDataRepository,
} from '@/domain/application/repositories/teacher-research-and-extension-projects-data-repository';
import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';
import { PrismaTeacherResearchAndExtensionProjectsDataMapper } from '../mappers/prisma-teacher-research-and-extension-projects-data-mapper';

@Injectable()
export class PrismaTeacherResearchAndExtensionProjectsDataRepository
  implements TeacherResearchAndExtensionProjectsDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(
    id: string,
  ): Promise<TeacherResearchAndExtensionProjectsData | null> {
    const courseDeparturesData =
      await this.prisma.teacherResearchAndExtensionProjectsData.findUnique({
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

    return PrismaTeacherResearchAndExtensionProjectsDataMapper.withTeacherToDomain(
      courseDeparturesData,
    );
  }

  async findByPeriod(
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<TeacherResearchAndExtensionProjectsData | null> {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      return null;
    }

    const courseDeparturesData =
      await this.prisma.teacherResearchAndExtensionProjectsData.findFirst({
        where: {
          teacherId: teacher.id,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaTeacherResearchAndExtensionProjectsDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findAllForCourse(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherResearchAndExtensionProjectsDataFilter,
  ): Promise<FindAllTeacherResearchAndExtensionProjectsData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const teacherResearchAndExtensionProjectsData =
      await this.prisma.teacherResearchAndExtensionProjectsData.findMany({
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

    const totalTeacherResearchAndExtensionProjectsData =
      await this.prisma.teacherResearchAndExtensionProjectsData.count({
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

    if (!teacherResearchAndExtensionProjectsData) {
      return {
        teacherResearchAndExtensionProjectsData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      teacherResearchAndExtensionProjectsData:
        teacherResearchAndExtensionProjectsData.map((data) =>
          PrismaTeacherResearchAndExtensionProjectsDataMapper.withTeacherToDomain(
            data,
          ),
        ),
      totalItems: totalTeacherResearchAndExtensionProjectsData,
      totalPages: pagination
        ? Math.ceil(
            totalTeacherResearchAndExtensionProjectsData /
              pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findAllForTeacher(
    teacherId: string,
    pagination?: Pagination,
    filters?: FindAllTeacherResearchAndExtensionProjectsDataFilter,
  ): Promise<FindAllTeacherResearchAndExtensionProjectsData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const teacherResearchAndExtensionProjectsData =
      await this.prisma.teacherResearchAndExtensionProjectsData.findMany({
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

    const totalTeacherResearchAndExtensionProjectsData =
      await this.prisma.teacherResearchAndExtensionProjectsData.count({
        where: {
          teacher: {
            userId: teacherId,
          },
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!teacherResearchAndExtensionProjectsData) {
      return {
        teacherResearchAndExtensionProjectsData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      teacherResearchAndExtensionProjectsData:
        teacherResearchAndExtensionProjectsData.map((data) =>
          PrismaTeacherResearchAndExtensionProjectsDataMapper.toDomain(data),
        ),
      totalItems: totalTeacherResearchAndExtensionProjectsData,
      totalPages: pagination
        ? Math.ceil(
            totalTeacherResearchAndExtensionProjectsData /
              pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<TeacherResearchAndExtensionProjectsData[]> {
    const teacherResearchAndExtensionProjectsData =
      await this.prisma.teacherResearchAndExtensionProjectsData.findMany({
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

    return teacherResearchAndExtensionProjectsData.map((data) =>
      PrismaTeacherResearchAndExtensionProjectsDataMapper.withTeacherToDomain(
        data,
      ),
    );
  }

  async create(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Promise<void> {
    const data =
      PrismaTeacherResearchAndExtensionProjectsDataMapper.toPrismaCreate(
        teacherResearchAndExtensionProjectsData,
      );

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherResearchAndExtensionProjectsData.teacherId,
      },
    });

    if (!teacher) {
      // TODO atualizar para Logger
      console.log('Teacher not exists');
      return;
    }

    await this.prisma.teacherResearchAndExtensionProjectsData.create({
      data: {
        ...data,
        teacherId: teacher.id,
      },
    });
  }

  async save(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Promise<void> {
    const data =
      PrismaTeacherResearchAndExtensionProjectsDataMapper.toPrismaUpdate(
        teacherResearchAndExtensionProjectsData,
      );

    await this.prisma.teacherResearchAndExtensionProjectsData.update({
      where: {
        id: teacherResearchAndExtensionProjectsData.id.toString(),
      },
      data,
    });
  }

  async delete(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Promise<void> {
    await this.prisma.teacherResearchAndExtensionProjectsData.delete({
      where: {
        id: teacherResearchAndExtensionProjectsData.id.toString(),
      },
    });
  }
}
