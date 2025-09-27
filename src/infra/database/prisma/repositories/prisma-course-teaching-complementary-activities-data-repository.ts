import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';
import {
  CourseTeachingComplementaryActivitiesDataRepository,
  FindAllCourseTeachingComplementaryActivitiesData,
  FindAllCourseTeachingComplementaryActivitiesDataFilter,
} from '@/domain/application/repositories/course-teaching-complementary-activities-data-repository';
import { PrismaCourseTeachingComplementaryActivitiesDataMapper } from '../mappers/prisma-course-teaching-complementary-activities-data-mapper';

@Injectable()
export class PrismaCourseTeachingComplementaryActivitiesDataRepository
  implements CourseTeachingComplementaryActivitiesDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(
    id: string,
  ): Promise<CourseTeachingComplementaryActivitiesData | null> {
    const courseDeparturesData =
      await this.prisma.courseTeachingComplementaryActivitiesData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseTeachingComplementaryActivitiesDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseTeachingComplementaryActivitiesData | null> {
    const courseDeparturesData =
      await this.prisma.courseTeachingComplementaryActivitiesData.findFirst({
        where: {
          courseId,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseTeachingComplementaryActivitiesDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseTeachingComplementaryActivitiesDataFilter,
  ): Promise<FindAllCourseTeachingComplementaryActivitiesData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseDeparturesData =
      await this.prisma.courseTeachingComplementaryActivitiesData.findMany({
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

    const totalCourseTeachingComplementaryActivitiesData =
      await this.prisma.courseTeachingComplementaryActivitiesData.count({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseDeparturesData) {
      return {
        courseTeachingComplementaryActivitiesData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      courseTeachingComplementaryActivitiesData: courseDeparturesData.map(
        (departureData) =>
          PrismaCourseTeachingComplementaryActivitiesDataMapper.toDomain(
            departureData,
          ),
      ),
      totalItems: totalCourseTeachingComplementaryActivitiesData,
      totalPages: pagination
        ? Math.ceil(
            totalCourseTeachingComplementaryActivitiesData /
              pagination.itemsPerPage,
          )
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseTeachingComplementaryActivitiesData[]> {
    const CourseTeachingComplementaryActivitiesData =
      await this.prisma.courseTeachingComplementaryActivitiesData.findMany({
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

    return CourseTeachingComplementaryActivitiesData.map((departureData) =>
      PrismaCourseTeachingComplementaryActivitiesDataMapper.toDomain(
        departureData,
      ),
    );
  }

  async create(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Promise<void> {
    const data =
      PrismaCourseTeachingComplementaryActivitiesDataMapper.toPrismaCreate(
        courseTeachingComplementaryActivitiesData,
      );

    await this.prisma.courseTeachingComplementaryActivitiesData.create({
      data,
    });
  }

  async save(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Promise<void> {
    const data =
      PrismaCourseTeachingComplementaryActivitiesDataMapper.toPrismaUpdate(
        courseTeachingComplementaryActivitiesData,
      );

    await this.prisma.courseTeachingComplementaryActivitiesData.update({
      where: {
        id: courseTeachingComplementaryActivitiesData.id.toString(),
      },
      data,
    });
  }

  async delete(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Promise<void> {
    await this.prisma.courseTeachingComplementaryActivitiesData.delete({
      where: {
        id: courseTeachingComplementaryActivitiesData.id.toString(),
      },
    });
  }
}
