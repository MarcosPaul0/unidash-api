import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  FindAllByCourseId,
  TeacherCoursesRepository,
} from '@/domain/application/repositories/teacher-courses-repository';
import { TeacherCourse } from '@/domain/entities/teacher-course';
import { PrismaTeacherCourseMapper } from '../mappers/prisma-teacher-course-mapper';
import { Pagination } from '@/core/pagination/pagination';

@Injectable()
export class PrismaTeacherCoursesRepository
  implements TeacherCoursesRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<TeacherCourse | null> {
    const teacherCourse = await this.prisma.teacherCourse.findFirst({
      where: {
        id,
      },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        course: true,
      },
    });

    if (!teacherCourse) {
      return null;
    }

    return PrismaTeacherCourseMapper.toDomainWithTeacherAndCourse(
      teacherCourse,
    );
  }

  async findAllByCourseId(
    courseId: string,
    { itemsPerPage, page }: Pagination,
  ): Promise<FindAllByCourseId> {
    const teacherCourses = await this.prisma.teacherCourse.findMany({
      where: {
        courseId,
      },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalTeachers = await this.prisma.teacherCourse.count({
      where: {
        courseId,
      },
    });

    if (!teacherCourses) {
      return {
        teacherCourses: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      teacherCourses: teacherCourses.map((teacherCourse) =>
        PrismaTeacherCourseMapper.toDomainWithTeacher({
          ...teacherCourse,
          teacher: teacherCourse.teacher,
        }),
      ),
      totalItems: totalTeachers,
      totalPages: Math.ceil(totalTeachers / itemsPerPage),
    };
  }

  async findAllByTeacherId(teacherId: string): Promise<TeacherCourse[]> {
    const teacherCourses = await this.prisma.teacherCourse.findMany({
      where: {
        teacher: {
          userId: teacherId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return teacherCourses.map(PrismaTeacherCourseMapper.toDomain);
  }

  async findByTeacherAndCourseId(
    teacherId: string,
    courseId: string,
  ): Promise<TeacherCourse | null> {
    const teacherCourse = await this.prisma.teacherCourse.findFirst({
      where: {
        teacher: {
          userId: teacherId,
        },
        courseId,
      },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        course: true,
      },
    });

    if (!teacherCourse) {
      return null;
    }

    return PrismaTeacherCourseMapper.toDomainWithTeacherAndCourse(
      teacherCourse,
    );
  }

  async findByUserAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<TeacherCourse | null> {
    const teacherCourse = await this.prisma.teacherCourse.findFirst({
      where: {
        teacher: {
          userId,
        },
        courseId,
      },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        course: true,
      },
    });

    if (!teacherCourse) {
      return null;
    }

    return PrismaTeacherCourseMapper.toDomainWithTeacherAndCourse(
      teacherCourse,
    );
  }

  async save(teacherCourse: TeacherCourse): Promise<void> {
    const data = PrismaTeacherCourseMapper.toPrismaUpdate(teacherCourse);

    await Promise.all([
      this.prisma.teacherCourse.update({
        where: {
          id: teacherCourse.id.toString(),
        },
        data,
      }),
    ]);
  }

  async create(teacherCourse: TeacherCourse): Promise<void> {
    const data = PrismaTeacherCourseMapper.toPrismaCreate(teacherCourse);

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherCourse.teacherId,
      },
    });

    await this.prisma.teacherCourse.create({
      data: {
        courseId: data.courseId,
        teacherId: teacher!.id,
        teacherRole: data.teacherRole,
      },
    });
  }

  async delete(teacherCourse: TeacherCourse): Promise<void> {
    await this.prisma.teacherCourse.delete({
      where: {
        id: teacherCourse.id.toString(),
      },
    });
  }
}
