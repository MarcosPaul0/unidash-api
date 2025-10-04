import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Semester } from '@/domain/entities/course-data';
import { Pagination } from '@/core/pagination/pagination';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import {
  CourseActiveStudentsDataRepository,
  FindAllCourseActiveStudentsData,
  FindAllCourseActiveStudentsDataFilter,
} from '../../../../domain/application/repositories/course-active-students-data-repository';
import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';
import { PrismaCourseActiveStudentsDataMapper } from '../mappers/prisma-course-active-students-data-mapper';

@Injectable()
export class PrismaCourseActiveStudentsDataRepository
  implements CourseActiveStudentsDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CourseActiveStudentsData | null> {
    const courseActiveStudentsData =
      await this.prisma.courseActiveStudentsData.findUnique({
        where: {
          id,
        },
        include: {
          activeStudentsByIngress: true,
        },
      });

    if (!courseActiveStudentsData) {
      return null;
    }

    return PrismaCourseActiveStudentsDataMapper.toDomain(
      courseActiveStudentsData,
    );
  }

  async findByCourseAndPeriod(
    courseId: string,
    year: number,
    semester: Semester,
  ): Promise<CourseActiveStudentsData | null> {
    const courseActiveStudentsData =
      await this.prisma.courseActiveStudentsData.findFirst({
        where: {
          courseId,
          year,
          semester,
        },
        include: {
          activeStudentsByIngress: true,
        },
      });

    if (!courseActiveStudentsData) {
      return null;
    }

    return PrismaCourseActiveStudentsDataMapper.toDomain(
      courseActiveStudentsData,
    );
  }

  async findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllCourseActiveStudentsDataFilter,
  ): Promise<FindAllCourseActiveStudentsData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const courseActiveStudentsData =
      await this.prisma.courseActiveStudentsData.findMany({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
        include: {
          activeStudentsByIngress: true,
        },
        orderBy: {
          year: 'desc',
        },
        ...paginationParams,
      });

    const totalCourseActiveStudentsData =
      await this.prisma.courseActiveStudentsData.count({
        where: {
          courseId,
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    if (!courseActiveStudentsData) {
      return {
        courseActiveStudentsData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      courseActiveStudentsData: courseActiveStudentsData.map((departureData) =>
        PrismaCourseActiveStudentsDataMapper.toDomain(departureData),
      ),
      totalItems: totalCourseActiveStudentsData,
      totalPages: pagination
        ? Math.ceil(totalCourseActiveStudentsData / pagination.itemsPerPage)
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<CourseActiveStudentsData[]> {
    const CourseActiveStudentsData =
      await this.prisma.courseActiveStudentsData.findMany({
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
          activeStudentsByIngress: true,
        },
        orderBy: {
          year: 'desc',
        },
      });

    return CourseActiveStudentsData.map((departureData) =>
      PrismaCourseActiveStudentsDataMapper.toDomain(departureData),
    );
  }

  async create(
    courseActiveStudentsData: CourseActiveStudentsData,
  ): Promise<void> {
    const data = PrismaCourseActiveStudentsDataMapper.toPrismaCreate(
      courseActiveStudentsData,
    );

    const courseActiveStudentsDataCreated =
      await this.prisma.courseActiveStudentsData.create({
        data,
      });

    await this.prisma.activeStudentsByIngress.createMany({
      data: courseActiveStudentsData.activeStudentsByIngress.map(
        (activeStudents) => ({
          courseActiveStudentsDataId: courseActiveStudentsDataCreated.id,
          ingressYear: activeStudents.ingressYear,
          numberOfStudents: activeStudents.numberOfStudents,
        }),
      ),
    });
  }

  async save(
    courseActiveStudentsData: CourseActiveStudentsData,
  ): Promise<void> {
    const data = PrismaCourseActiveStudentsDataMapper.toPrismaUpdate(
      courseActiveStudentsData,
    );

    var courseActiveStudentsDataId = courseActiveStudentsData.id.toString();

    await this.prisma.courseActiveStudentsData.update({
      where: {
        id: courseActiveStudentsDataId,
      },
      data,
    });

    await this.prisma.activeStudentsByIngress.deleteMany({
      where: {
        courseActiveStudentsDataId,
      },
    });

    await this.prisma.activeStudentsByIngress.createMany({
      data: courseActiveStudentsData.activeStudentsByIngress.map(
        (activeStudents) => ({
          courseActiveStudentsDataId,
          ingressYear: activeStudents.ingressYear,
          numberOfStudents: activeStudents.numberOfStudents,
        }),
      ),
    });
  }

  async delete(
    courseActiveStudentsData: CourseActiveStudentsData,
  ): Promise<void> {
    await this.prisma.courseActiveStudentsData.delete({
      where: {
        id: courseActiveStudentsData.id.toString(),
      },
    });
  }
}
