import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';
import {
  CourseExtensionComplementaryActivitiesDataRepository,
  FindAllCourseExtensionComplementaryActivitiesData,
  FindAllCourseExtensionComplementaryActivitiesDataFilter,
} from '@/domain/application/repositories/course-extension-complementary-activities-data-repository';
import { PrismaCourseExtensionComplementaryActivitiesDataMapper } from '../mappers/prisma-course-extension-complementary-activities-data-mapper';

@Injectable()
export class PrismaCourseExtensionComplementaryActivitiesDataRepository
  implements CourseExtensionComplementaryActivitiesDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(
    id: string,
  ): Promise<CourseExtensionComplementaryActivitiesData | null> {
    const courseDeparturesData =
      await this.prisma.courseExtensionComplementaryActivitiesData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseExtensionComplementaryActivitiesDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseExtensionComplementaryActivitiesData | null> {
    const courseDeparturesData =
      await this.prisma.courseExtensionComplementaryActivitiesData.findFirst({
        where: {
          courseId,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseExtensionComplementaryActivitiesDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseExtensionComplementaryActivitiesDataFilter,
  ): Promise<FindAllCourseExtensionComplementaryActivitiesData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseDeparturesData =
      await this.prisma.courseExtensionComplementaryActivitiesData.findMany({
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

    const totalCourseExtensionComplementaryActivitiesData =
      await this.prisma.courseExtensionComplementaryActivitiesData.count({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseDeparturesData) {
      return {
        courseExtensionComplementaryActivitiesData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      courseExtensionComplementaryActivitiesData: courseDeparturesData.map(
        (departureData) =>
          PrismaCourseExtensionComplementaryActivitiesDataMapper.toDomain(
            departureData,
          ),
      ),
      totalItems: totalCourseExtensionComplementaryActivitiesData,
      totalPages: pagination
        ? Math.ceil(
            totalCourseExtensionComplementaryActivitiesData /
              pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseExtensionComplementaryActivitiesData[]> {
    const CourseExtensionComplementaryActivitiesData =
      await this.prisma.courseExtensionComplementaryActivitiesData.findMany({
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

    return CourseExtensionComplementaryActivitiesData.map((departureData) =>
      PrismaCourseExtensionComplementaryActivitiesDataMapper.toDomain(
        departureData,
      ),
    );
  }

  async create(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Promise<void> {
    const data =
      PrismaCourseExtensionComplementaryActivitiesDataMapper.toPrismaCreate(
        courseExtensionComplementaryActivitiesData,
      );

    await this.prisma.courseExtensionComplementaryActivitiesData.create({
      data,
    });
  }

  async save(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Promise<void> {
    const data =
      PrismaCourseExtensionComplementaryActivitiesDataMapper.toPrismaUpdate(
        courseExtensionComplementaryActivitiesData,
      );

    await this.prisma.courseExtensionComplementaryActivitiesData.update({
      where: {
        id: courseExtensionComplementaryActivitiesData.id.toString(),
      },
      data,
    });
  }

  async delete(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Promise<void> {
    await this.prisma.courseExtensionComplementaryActivitiesData.delete({
      where: {
        id: courseExtensionComplementaryActivitiesData.id.toString(),
      },
    });
  }
}
