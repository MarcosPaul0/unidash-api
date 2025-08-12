import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CourseDepartureDataRepository,
  FindAllCourseDepartureData,
  FindAllCourseDepartureDataFilter,
} from '@/domain/application/repositories/course-departure-data-repository';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { PrismaCourseDepartureDataMapper } from '../mappers/prisma-course-departure-data-mapper';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';

@Injectable()
export class PrismaCourseDepartureDataRepository
  implements CourseDepartureDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CourseDepartureData | null> {
    const courseDeparturesData =
      await this.prisma.courseDepartureData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseDepartureDataMapper.toDomain(courseDeparturesData);
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseDepartureData | null> {
    const courseDeparturesData =
      await this.prisma.courseDepartureData.findFirst({
        where: {
          courseId,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseDepartureDataMapper.toDomain(courseDeparturesData);
  }

  async findAll(
    pagination?: Pagination,
    filters?: FindAllCourseDepartureDataFilter,
  ): Promise<FindAllCourseDepartureData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseDeparturesData = await this.prisma.courseDepartureData.findMany(
      {
        where: {
          semester: filters?.semester,
          year: filters?.year,
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...paginationParams,
      },
    );

    const totalCourseDepartureData =
      await this.prisma.courseDepartureData.count({
        where: {
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseDeparturesData) {
      return {
        courseDepartureData: [],
        totalItems: 0,
        totalPages: 1,
      };
    }

    return {
      courseDepartureData: courseDeparturesData.map((departureData) =>
        PrismaCourseDepartureDataMapper.toDomain(departureData),
      ),
      totalItems: totalCourseDepartureData,
      totalPages: pagination
        ? Math.ceil(totalCourseDepartureData / pagination.itemsPerPage)
        : 1,
    };
  }

  async create(courseDepartureData: CourseDepartureData): Promise<void> {
    const data =
      PrismaCourseDepartureDataMapper.toPrismaCreate(courseDepartureData);

    await this.prisma.courseDepartureData.create({
      data,
    });
  }

  async save(courseDepartureData: CourseDepartureData): Promise<void> {
    const data =
      PrismaCourseDepartureDataMapper.toPrismaUpdate(courseDepartureData);

    await this.prisma.courseDepartureData.update({
      where: {
        id: courseDepartureData.id.toString(),
      },
      data,
    });
  }

  async delete(courseDepartureData: CourseDepartureData): Promise<void> {
    await this.prisma.courseDepartureData.delete({
      where: {
        id: courseDepartureData.id.toString(),
      },
    });
  }
}
