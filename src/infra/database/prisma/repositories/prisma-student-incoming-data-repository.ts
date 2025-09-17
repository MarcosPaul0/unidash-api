import { Pagination } from '@/core/pagination/pagination';
import { Semester } from '@/domain/entities/course-data';
import { StudentIncomingData } from '@/domain/entities/student-incoming-data';
import { StudentIncomingDataRepository } from '@/domain/application/repositories/student-incoming-data-repository';
import { FindForIndicatorsFilter } from '@/domain/application/repositories/course-coordination-data-repository';
import { PrismaStudentIncomingDataMapper } from '../mappers/prisma-student-incoming-data-mapper';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

export type FindAllStudentIncomingDataFilter = {
  semester?: Semester;
  year?: number;
};

export type FindAllStudentIncomingData = {
  studentIncomingData: StudentIncomingData[];
  totalItems: number;
  totalPages: number;
};

@Injectable()
export class PrismaStudentIncomingDataRepository
  implements StudentIncomingDataRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<StudentIncomingData | null> {
    const studentIncomingData =
      await this.prisma.studentIncomingData.findUnique({
        where: {
          id,
        },
        include: {
          studentAffinityByDisciplineData: true,
          studentAssetData: {
            include: {
              studentAsset: true,
            },
          },
          studentCourseChoiceReasonData: {
            include: {
              studentCourseChoiceReason: true,
            },
          },
          studentHobbyOrHabitData: {
            include: {
              studentHobbyOrHabit: true,
            },
          },
          studentTechnologyData: {
            include: {
              studentTechnology: true,
            },
          },
          studentUniversityChoiceReasonData: {
            include: {
              studentUniversityChoiceReason: true,
            },
          },
        },
      });

    if (!studentIncomingData) {
      return null;
    }

    return PrismaStudentIncomingDataMapper.fullToDomain(studentIncomingData);
  }

  async findByStudentId(
    studentId: string,
  ): Promise<StudentIncomingData | null> {
    const studentIncomingData = await this.prisma.studentIncomingData.findFirst(
      {
        where: {
          student: {
            userId: studentId,
          },
        },
      },
    );

    if (!studentIncomingData) {
      return null;
    }

    return PrismaStudentIncomingDataMapper.toDomain(studentIncomingData);
  }

  async findAll(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllStudentIncomingDataFilter,
  ): Promise<FindAllStudentIncomingData> {
    const paginationParams = pagination
      ? {
          take: pagination.itemsPerPage,
          skip: (pagination.page - 1) * pagination.itemsPerPage,
        }
      : undefined;

    const studentIncomingData = await this.prisma.studentIncomingData.findMany({
      where: {
        student: {
          courseId,
        },
        semester: filters?.semester,
        year: filters?.year,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...paginationParams,
    });

    if (!studentIncomingData) {
      return {
        studentIncomingData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    const totalStudentIncomingData =
      await this.prisma.studentIncomingData.count({
        where: {
          student: {
            courseId,
          },
          semester: filters?.semester,
          year: filters?.year,
        },
      });

    return {
      studentIncomingData: studentIncomingData.map((departureData) =>
        PrismaStudentIncomingDataMapper.toDomain(departureData),
      ),
      totalItems: totalStudentIncomingData,
      totalPages: pagination
        ? Math.ceil(totalStudentIncomingData / pagination.itemsPerPage)
        : 1,
    };
  }

  async findForIndicators(
    courseId: string,
    filters?: FindForIndicatorsFilter,
  ): Promise<StudentIncomingData[]> {
    const studentIncomingData = await this.prisma.studentIncomingData.findMany({
      where: {
        student: {
          courseId,
        },
        semester: filters?.semester,
        year: filters?.year,
      },
      include: {
        studentAffinityByDisciplineData: true,
        studentAssetData: {
          include: {
            studentAsset: true,
          },
        },
        studentCourseChoiceReasonData: {
          include: {
            studentCourseChoiceReason: true,
          },
        },
        studentHobbyOrHabitData: {
          include: {
            studentHobbyOrHabit: true,
          },
        },
        studentTechnologyData: {
          include: {
            studentTechnology: true,
          },
        },
        studentUniversityChoiceReasonData: {
          include: {
            studentUniversityChoiceReason: true,
          },
        },
      },
    });

    return studentIncomingData.map(
      PrismaStudentIncomingDataMapper.fullToDomain,
    );
  }

  async create(
    studentIncomingData: StudentIncomingData,
  ): Promise<StudentIncomingData> {
    const data =
      PrismaStudentIncomingDataMapper.toPrismaCreate(studentIncomingData);

    const student = await this.prisma.student.findUniqueOrThrow({
      where: {
        userId: data.studentId,
      },
    });

    const result = await this.prisma.studentIncomingData.create({
      data: {
        ...data,
        studentId: student.id,
      },
    });

    return PrismaStudentIncomingDataMapper.toDomain(result);
  }

  async delete(studentIncomingData: StudentIncomingData): Promise<void> {
    await this.prisma.studentIncomingData.delete({
      where: {
        id: studentIncomingData.id.toString(),
      },
    });
  }
}
