import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CourseStudentsDataRepository,
  FindAllCourseStudentsData,
  FindAllCourseStudentsDataFilter,
} from '@/domain/application/repositories/course-students-data-repository';
import { CourseStudentsData } from '@/domain/entities/course-students-data';
import { PrismaCourseStudentsDataMapper } from '../mappers/prisma-course-students-data-mapper';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';

@Injectable()
export class PrismaCourseStudentsDataRepository
  implements CourseStudentsDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CourseStudentsData | null> {
    const courseDeparturesData =
      await this.prisma.courseStudentsData.findUnique({
        where: {
          id,
        },
      });

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseStudentsDataMapper.toDomain(courseDeparturesData);
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseStudentsData | null> {
    const courseDeparturesData = await this.prisma.courseStudentsData.findFirst(
      {
        where: {
          courseId,
          year,
          semester,
        },
      },
    );

    if (!courseDeparturesData) {
      return null;
    }

    return PrismaCourseStudentsDataMapper.toDomain(courseDeparturesData);
  }

  async findAll(
    pagination?: Pagination,
    filters?: FindAllCourseStudentsDataFilter,
  ): Promise<FindAllCourseStudentsData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseDeparturesData = await this.prisma.courseStudentsData.findMany({
      where: {
        semester: filters?.semester,
        year: filters?.year,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...paginationParams,
    });

    const totalCourseStudentsData = await this.prisma.courseStudentsData.count({
      where: {
        semester: filters?.semester,
        year: filters?.year,
      },
    });

    if (!courseDeparturesData) {
      return {
        courseStudentsData: [],
        totalItems: 0,
        totalPages: 1,
      };
    }

    return {
      courseStudentsData: courseDeparturesData.map((departureData) =>
        PrismaCourseStudentsDataMapper.toDomain(departureData),
      ),
      totalItems: totalCourseStudentsData,
      totalPages: pagination
        ? Math.ceil(totalCourseStudentsData / pagination.itemsPerPage)
        : 1,
    };
  }

  async create(courseStudentsData: CourseStudentsData): Promise<void> {
    const data =
      PrismaCourseStudentsDataMapper.toPrismaCreate(courseStudentsData);

    await this.prisma.courseStudentsData.create({
      data,
    });
  }

  async save(courseStudentsData: CourseStudentsData): Promise<void> {
    const data =
      PrismaCourseStudentsDataMapper.toPrismaUpdate(courseStudentsData);

    await this.prisma.user.update({
      where: {
        id: courseStudentsData.id.toString(),
      },
      data,
    });
  }

  async delete(courseStudentsData: CourseStudentsData): Promise<void> {
    await this.prisma.courseStudentsData.delete({
      where: {
        id: courseStudentsData.id.toString(),
      },
    });
  }
}
