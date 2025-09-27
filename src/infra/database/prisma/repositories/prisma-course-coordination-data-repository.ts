import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CourseCoordinationDataRepository,
  FindAllCourseCoordinationData,
  FindAllCourseCoordinationDataFilter,
  FindForIndicatorsFilter,
} from '@/domain/application/repositories/course-coordination-data-repository';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';
import { Semester } from '@/domain/entities/course-data';
import { PrismaCourseCoordinationDataMapper } from '../mappers/prisma-course-coordination-data-mapper';
import { Pagination } from '@/core/pagination/pagination';

@Injectable()
export class PrismaCourseCoordinationDataRepository
  implements CourseCoordinationDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CourseCoordinationData | null> {
    const courseDeparturesData =
      await this.prisma.courseCoordinationData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseCoordinationDataMapper.toDomain(courseDeparturesData);
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseCoordinationData | null> {
    const courseDeparturesData =
      await this.prisma.courseCoordinationData.findFirst({
        where: {
          courseId,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseCoordinationDataMapper.toDomain(courseDeparturesData);
  }

  async findAll(
    courseId,
    pagination?: Pagination,
    filters?: FindAllCourseCoordinationDataFilter,
  ): Promise<FindAllCourseCoordinationData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseCoordinationData =
      await this.prisma.courseCoordinationData.findMany({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...paginationParams,
      });

    const totalCourseCoordinationData =
      await this.prisma.courseCoordinationData.count({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseCoordinationData) {
      return {
        courseCoordinationData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      courseCoordinationData: courseCoordinationData.map((departureData) =>
        PrismaCourseCoordinationDataMapper.toDomain(departureData),
      ),
      totalItems: totalCourseCoordinationData,
      totalPages: pagination
        ? Math.ceil(totalCourseCoordinationData / pagination.itemsPerPage)
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseCoordinationData[]> {
    const courseCoordinationData =
      await this.prisma.courseCoordinationData.findMany({
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
        orderBy: {
          year: 'desc',
        },
      });

    return courseCoordinationData.map((departureData) =>
      PrismaCourseCoordinationDataMapper.toDomain(departureData),
    );
  }

  async create(courseCoordinationData: CourseCoordinationData): Promise<void> {
    const data = PrismaCourseCoordinationDataMapper.toPrismaCreate(
      courseCoordinationData,
    );

    await this.prisma.courseCoordinationData.create({
      data,
    });
  }

  async save(courseCoordinationData: CourseCoordinationData): Promise<void> {
    const data = PrismaCourseCoordinationDataMapper.toPrismaUpdate(
      courseCoordinationData,
    );

    await this.prisma.courseCoordinationData.update({
      where: {
        id: courseCoordinationData.id.toString(),
      },
      data,
    });
  }

  async delete(courseCoordinationData: CourseCoordinationData): Promise<void> {
    await this.prisma.courseCoordinationData.delete({
      where: {
        id: courseCoordinationData.id.toString(),
      },
    });
  }
}
