import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CourseRegistrationLockDataRepository,
  FindAllCourseRegistrationLockData,
  FindAllCourseRegistrationLockDataFilter,
} from '@/domain/application/repositories/course-registration-lock-data-repository';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { PrismaCourseRegistrationLockDataMapper } from '../mappers/prisma-course-registration-lock-data-mapper';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';

@Injectable()
export class PrismaCourseRegistrationLockDataRepository
  implements CourseRegistrationLockDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CourseRegistrationLockData | null> {
    const courseDeparturesData =
      await this.prisma.courseRegistrationLockData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseRegistrationLockDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseRegistrationLockData | null> {
    const courseDeparturesData =
      await this.prisma.courseRegistrationLockData.findFirst({
        where: {
          courseId,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseRegistrationLockDataMapper.toDomain(
      courseDeparturesData,
    );
  }

  async findAll(
    pagination?: Pagination,
    filters?: FindAllCourseRegistrationLockDataFilter,
  ): Promise<FindAllCourseRegistrationLockData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseDeparturesData =
      await this.prisma.courseRegistrationLockData.findMany({
        where: {
          semester: filters?.semester,
          year: filters?.year,
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...paginationParams,
      });

    const totalCourseRegistrationLockData =
      await this.prisma.courseRegistrationLockData.count({
        where: {
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseDeparturesData) {
      return {
        courseRegistrationLockData: [],
        totalItems: 0,
        totalPages: 1,
      };
    }

    return {
      courseRegistrationLockData: courseDeparturesData.map((departureData) =>
        PrismaCourseRegistrationLockDataMapper.toDomain(departureData),
      ),
      totalItems: totalCourseRegistrationLockData,
      totalPages: pagination
        ? Math.ceil(totalCourseRegistrationLockData / pagination.itemsPerPage)
        : 1,
    };
  }

  async create(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Promise<void> {
    const data = PrismaCourseRegistrationLockDataMapper.toPrismaCreate(
      courseRegistrationLockData,
    );

    await this.prisma.courseRegistrationLockData.create({
      data,
    });
  }

  async save(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Promise<void> {
    const data = PrismaCourseRegistrationLockDataMapper.toPrismaUpdate(
      courseRegistrationLockData,
    );

    await this.prisma.user.update({
      where: {
        id: courseRegistrationLockData.id.toString(),
      },
      data,
    });
  }

  async delete(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Promise<void> {
    await this.prisma.courseRegistrationLockData.delete({
      where: {
        id: courseRegistrationLockData.id.toString(),
      },
    });
  }
}
