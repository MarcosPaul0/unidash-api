import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';
import {
  CourseCompletionWorkDataRepository,
  FindAllCourseCompletionWorkData,
  FindAllCourseCompletionWorkDataFilter,
} from '@/domain/application/repositories/course-completion-work-data-repository';
import { PrismaCourseCompletionWorkDataMapper } from '../mappers/prisma-course-completion-work-data-mapper';

@Injectable()
export class PrismaCourseCompletionWorkDataRepository
  implements CourseCompletionWorkDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CourseCompletionWorkData | null> {
    const courseDeparturesData =
      await this.prisma.courseCompletionWorkData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseCompletionWorkDataMapper.toDomain(courseDeparturesData);
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseCompletionWorkData | null> {
    const courseDeparturesData =
      await this.prisma.courseCompletionWorkData.findFirst({
        where: {
          courseId,
          year,
          semester,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseCompletionWorkDataMapper.toDomain(courseDeparturesData);
  }

  async findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseCompletionWorkDataFilter,
  ): Promise<FindAllCourseCompletionWorkData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseDeparturesData =
      await this.prisma.courseCompletionWorkData.findMany({
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

    const totalCourseCompletionWorkData =
      await this.prisma.courseCompletionWorkData.count({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseDeparturesData) {
      return {
        courseCompletionWorkData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      courseCompletionWorkData: courseDeparturesData.map((departureData) =>
        PrismaCourseCompletionWorkDataMapper.toDomain(departureData),
      ),
      totalItems: totalCourseCompletionWorkData,
      totalPages: pagination
        ? Math.ceil(totalCourseCompletionWorkData / pagination.itemsPerPage)
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseCompletionWorkData[]> {
    const CourseCompletionWorkData =
      await this.prisma.courseCompletionWorkData.findMany({
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

    return CourseCompletionWorkData.map((departureData) =>
      PrismaCourseCompletionWorkDataMapper.toDomain(departureData),
    );
  }

  async create(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Promise<void> {
    const data = PrismaCourseCompletionWorkDataMapper.toPrismaCreate(
      courseCompletionWorkData,
    );

    await this.prisma.courseCompletionWorkData.create({
      data,
    });
  }

  async save(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Promise<void> {
    const data = PrismaCourseCompletionWorkDataMapper.toPrismaUpdate(
      courseCompletionWorkData,
    );

    await this.prisma.courseCompletionWorkData.update({
      where: {
        id: courseCompletionWorkData.id.toString(),
      },
      data,
    });
  }

  async delete(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Promise<void> {
    await this.prisma.courseCompletionWorkData.delete({
      where: {
        id: courseCompletionWorkData.id.toString(),
      },
    });
  }
}
