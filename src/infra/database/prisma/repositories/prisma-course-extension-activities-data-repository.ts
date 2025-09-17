import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';
import {
  CourseExtensionActivitiesDataRepository,
  FindAllCourseExtensionActivitiesData,
  FindAllCourseExtensionActivitiesDataFilter,
} from '@/domain/application/repositories/course-extension-activities-data-repository';
import { PrismaCourseExtensionActivitiesDataMapper } from '../mappers/prisma-course-extension-activities-data-mapper';

@Injectable()
export class PrismaCourseExtensionActivitiesDataRepository
  implements CourseExtensionActivitiesDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CourseExtensionActivitiesData | null> {
    const courseDeparturesData =
      await this.prisma.courseExtensionActivitiesData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseExtensionActivitiesDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseExtensionActivitiesData | null> {
    const courseDeparturesData =
      await this.prisma.courseExtensionActivitiesData.findFirst({
        where: {
          courseId,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseExtensionActivitiesDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseExtensionActivitiesDataFilter,
  ): Promise<FindAllCourseExtensionActivitiesData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseDeparturesData =
      await this.prisma.courseExtensionActivitiesData.findMany({
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

    const totalCourseExtensionActivitiesData =
      await this.prisma.courseExtensionActivitiesData.count({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseDeparturesData) {
      return {
        courseExtensionActivitiesData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      courseExtensionActivitiesData: courseDeparturesData.map((departureData) =>
        PrismaCourseExtensionActivitiesDataMapper.toDomain(departureData),
      ),
      totalItems: totalCourseExtensionActivitiesData,
      totalPages: pagination
        ? Math.ceil(
            totalCourseExtensionActivitiesData / pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseExtensionActivitiesData[]> {
    const CourseExtensionActivitiesData =
      await this.prisma.courseExtensionActivitiesData.findMany({
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
          year: 'asc',
        },
      });

    return CourseExtensionActivitiesData.map((departureData) =>
      PrismaCourseExtensionActivitiesDataMapper.toDomain(departureData),
    );
  }

  async create(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Promise<void> {
    const data = PrismaCourseExtensionActivitiesDataMapper.toPrismaCreate(
      courseExtensionActivitiesData,
    );

    await this.prisma.courseExtensionActivitiesData.create({
      data,
    });
  }

  async save(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Promise<void> {
    const data = PrismaCourseExtensionActivitiesDataMapper.toPrismaUpdate(
      courseExtensionActivitiesData,
    );

    await this.prisma.courseExtensionActivitiesData.update({
      where: {
        id: courseExtensionActivitiesData.id.toString(),
      },
      data,
    });
  }

  async delete(
    courseExtensionActivitiesData: CourseExtensionActivitiesData,
  ): Promise<void> {
    await this.prisma.courseExtensionActivitiesData.delete({
      where: {
        id: courseExtensionActivitiesData.id.toString(),
      },
    });
  }
}
