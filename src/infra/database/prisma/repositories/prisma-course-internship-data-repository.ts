import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseInternshipDataRepository,
  FindAllCourseInternshipData,
  FindAllCourseInternshipDataFilter,
} from '@/domain/application/repositories/course-internship-data-repository';
import { CourseInternshipData } from '@/domain/entities/course-internship-data';
import { PrismaCourseInternshipDataMapper } from '../mappers/prisma-course-internship-data-mapper';

@Injectable()
export class PrismaCourseInternshipDataRepository
  implements CourseInternshipDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CourseInternshipData | null> {
    const courseInternshipsData =
      await this.prisma.courseInternshipData.findUnique({
        where: {
          id,
        },
        include: {
          city: true,
        },
      });

    if (!courseInternshipsData) {
      return null;
    }

    return PrismaCourseInternshipDataMapper.toDomain(courseInternshipsData);
  }

  async findByMatriculation(
    matriculation: string,
  ): Promise<CourseInternshipData | null> {
    const courseInternshipsData =
      await this.prisma.courseInternshipData.findUnique({
        where: {
          studentMatriculation: matriculation,
        },
        include: {
          city: true,
        },
      });

    if (!courseInternshipsData) {
      return null;
    }

    return PrismaCourseInternshipDataMapper.toDomain(courseInternshipsData);
  }

  async findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseInternshipDataFilter,
  ): Promise<FindAllCourseInternshipData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseInternshipsData =
      await this.prisma.courseInternshipData.findMany({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
        include: {
          city: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...paginationParams,
      });

    const totalCourseInternshipData =
      await this.prisma.courseInternshipData.count({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseInternshipsData) {
      return {
        courseInternshipData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      courseInternshipData: courseInternshipsData.map((InternshipData) =>
        PrismaCourseInternshipDataMapper.withTeacherToDomain(InternshipData),
      ),
      totalItems: totalCourseInternshipData,
      totalPages: pagination
        ? Math.ceil(totalCourseInternshipData / pagination.itemsPerPage)
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseInternshipData[]> {
    const courseInternshipData =
      await this.prisma.courseInternshipData.findMany({
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
          city: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          year: 'asc',
        },
      });

    return courseInternshipData.map((InternshipData) =>
      PrismaCourseInternshipDataMapper.withTeacherToDomain(InternshipData),
    );
  }

  async create(courseInternshipData: CourseInternshipData): Promise<void> {
    const data =
      PrismaCourseInternshipDataMapper.toPrismaCreate(courseInternshipData);

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: courseInternshipData.advisorId,
      },
    });

    await this.prisma.courseInternshipData.create({
      data: {
        ...data,
        advisorId: teacher!.id,
      },
    });
  }

  async save(courseInternshipData: CourseInternshipData): Promise<void> {
    const data =
      PrismaCourseInternshipDataMapper.toPrismaUpdate(courseInternshipData);

    await this.prisma.courseInternshipData.update({
      where: {
        id: courseInternshipData.id.toString(),
      },
      data,
    });
  }

  async delete(courseInternshipData: CourseInternshipData): Promise<void> {
    await this.prisma.courseInternshipData.delete({
      where: {
        id: courseInternshipData.id.toString(),
      },
    });
  }
}
