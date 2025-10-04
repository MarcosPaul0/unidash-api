import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  FindAllCourseTeacherWorkloadData,
  FindAllCourseTeacherWorkloadDataFilter,
  CourseTeacherWorkloadDataRepository,
} from '@/domain/application/repositories/course-teacher-workload-data-repository';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';
import { PrismaCourseTeacherWorkloadDataMapper } from '../mappers/prisma-course-teacher-workload-data-mapper';

@Injectable()
export class PrismaCourseTeacherWorkloadDataRepository
  implements CourseTeacherWorkloadDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CourseTeacherWorkloadData | null> {
    const courseTeacherWorkloadData =
      await this.prisma.courseTeacherWorkloadData.findUnique({
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

    if (!courseTeacherWorkloadData) {
      return null;
    }

    return PrismaCourseTeacherWorkloadDataMapper.withTeacherToDomain(
      courseTeacherWorkloadData,
    );
  }

  async findByPeriod(
    courseId: string,
    teacherId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseTeacherWorkloadData | null> {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      return null;
    }

    const courseTeacherWorkloadData =
      await this.prisma.courseTeacherWorkloadData.findFirst({
        where: {
          teacherId: teacher.id,
          year,
          semester,
          courseId,
        },
      });

    if (!courseTeacherWorkloadData) {
      return null;
    }

    return PrismaCourseTeacherWorkloadDataMapper.toDomain(
      courseTeacherWorkloadData,
    );
  }

  async findAllForCourse(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseTeacherWorkloadDataFilter,
  ): Promise<FindAllCourseTeacherWorkloadData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseTeacherWorkloadData =
      await this.prisma.courseTeacherWorkloadData.findMany({
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

    const totalTeacherWorkloadData =
      await this.prisma.courseTeacherWorkloadData.count({
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

    if (!courseTeacherWorkloadData) {
      return {
        courseTeacherWorkloadData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      courseTeacherWorkloadData: courseTeacherWorkloadData.map((data) =>
        PrismaCourseTeacherWorkloadDataMapper.withTeacherToDomain(data),
      ),
      totalItems: totalTeacherWorkloadData,
      totalPages: pagination
        ? Math.ceil(totalTeacherWorkloadData / pagination.itemsPerPage)
        : 1,
    };
  }

  async findAllForTeacher(
    teacherId: string,
    pagination?: Pagination,
    filters?: FindAllCourseTeacherWorkloadDataFilter,
  ): Promise<FindAllCourseTeacherWorkloadData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseTeacherWorkloadData =
      await this.prisma.courseTeacherWorkloadData.findMany({
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

    if (!courseTeacherWorkloadData) {
      return {
        courseTeacherWorkloadData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    const totalCourseTeacherWorkloadData =
      await this.prisma.courseTeacherWorkloadData.count({
        where: {
          teacher: {
            userId: teacherId,
          },
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    return {
      courseTeacherWorkloadData: courseTeacherWorkloadData.map((data) =>
        PrismaCourseTeacherWorkloadDataMapper.toDomain(data),
      ),
      totalItems: totalCourseTeacherWorkloadData,
      totalPages: pagination
        ? Math.ceil(totalCourseTeacherWorkloadData / pagination.itemsPerPage)
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseTeacherWorkloadData[]> {
    const courseTeacherWorkloadData =
      await this.prisma.courseTeacherWorkloadData.findMany({
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

    return courseTeacherWorkloadData.map((data) =>
      PrismaCourseTeacherWorkloadDataMapper.withTeacherToDomain(data),
    );
  }

  async create(
    courseTeacherWorkloadData: CourseTeacherWorkloadData,
  ): Promise<void> {
    const data = PrismaCourseTeacherWorkloadDataMapper.toPrismaCreate(
      courseTeacherWorkloadData,
    );

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: courseTeacherWorkloadData.teacherId,
      },
    });

    if (!teacher) {
      // TODO atualizar para Logger
      console.log('Teacher not exists');
      return;
    }

    await this.prisma.courseTeacherWorkloadData.create({
      data: {
        ...data,
        teacherId: teacher.id,
      },
    });
  }

  async save(
    courseTeacherWorkloadData: CourseTeacherWorkloadData,
  ): Promise<void> {
    const data = PrismaCourseTeacherWorkloadDataMapper.toPrismaUpdate(
      courseTeacherWorkloadData,
    );

    await this.prisma.courseTeacherWorkloadData.update({
      where: {
        id: courseTeacherWorkloadData.id.toString(),
      },
      data,
    });
  }

  async delete(
    courseTeacherWorkloadData: CourseTeacherWorkloadData,
  ): Promise<void> {
    await this.prisma.courseTeacherWorkloadData.delete({
      where: {
        id: courseTeacherWorkloadData.id.toString(),
      },
    });
  }
}
