import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseSearchComplementaryActivitiesDataRepository,
  FindAllCourseSearchComplementaryActivitiesData,
  FindAllCourseSearchComplementaryActivitiesDataFilter,
} from '@/domain/application/repositories/course-search-complementary-activities-data-repository';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';
import { PrismaCourseSearchComplementaryActivitiesDataMapper } from '../mappers/prisma-course-search-complementary-activities-data-mapper';

@Injectable()
export class PrismaCourseSearchComplementaryActivitiesDataRepository
  implements CourseSearchComplementaryActivitiesDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(
    id: string,
  ): Promise<CourseSearchComplementaryActivitiesData | null> {
    const courseDeparturesData =
      await this.prisma.courseSearchComplementaryActivitiesData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseSearchComplementaryActivitiesDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseSearchComplementaryActivitiesData | null> {
    const courseDeparturesData =
      await this.prisma.courseSearchComplementaryActivitiesData.findFirst({
        where: {
          courseId,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseSearchComplementaryActivitiesDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseSearchComplementaryActivitiesDataFilter,
  ): Promise<FindAllCourseSearchComplementaryActivitiesData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseDeparturesData =
      await this.prisma.courseSearchComplementaryActivitiesData.findMany({
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

    const totalCourseSearchComplementaryActivitiesData =
      await this.prisma.courseSearchComplementaryActivitiesData.count({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseDeparturesData) {
      return {
        courseSearchComplementaryActivitiesData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      courseSearchComplementaryActivitiesData: courseDeparturesData.map(
        (departureData) =>
          PrismaCourseSearchComplementaryActivitiesDataMapper.toDomain(
            departureData,
          ),
      ),
      totalItems: totalCourseSearchComplementaryActivitiesData,
      totalPages: pagination
        ? Math.ceil(
            totalCourseSearchComplementaryActivitiesData /
              pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseSearchComplementaryActivitiesData[]> {
    const CourseSearchComplementaryActivitiesData =
      await this.prisma.courseSearchComplementaryActivitiesData.findMany({
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

    return CourseSearchComplementaryActivitiesData.map((departureData) =>
      PrismaCourseSearchComplementaryActivitiesDataMapper.toDomain(
        departureData,
      ),
    );
  }

  async create(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Promise<void> {
    const data =
      PrismaCourseSearchComplementaryActivitiesDataMapper.toPrismaCreate(
        courseSearchComplementaryActivitiesData,
      );

    await this.prisma.courseSearchComplementaryActivitiesData.create({
      data,
    });
  }

  async save(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Promise<void> {
    const data =
      PrismaCourseSearchComplementaryActivitiesDataMapper.toPrismaUpdate(
        courseSearchComplementaryActivitiesData,
      );

    await this.prisma.courseSearchComplementaryActivitiesData.update({
      where: {
        id: courseSearchComplementaryActivitiesData.id.toString(),
      },
      data,
    });
  }

  async delete(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Promise<void> {
    await this.prisma.courseSearchComplementaryActivitiesData.delete({
      where: {
        id: courseSearchComplementaryActivitiesData.id.toString(),
      },
    });
  }
}
