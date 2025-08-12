import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CoursesRepository,
  FindWithTeachers,
} from '@/domain/application/repositories/courses-repository';
import { PrismaCourseMapper } from '../mappers/prisma-course-mapper';
import { Course } from '@/domain/entities/course';

@Injectable()
export class PrismaCoursesRepository implements CoursesRepository {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: {
        name,
      },
    });

    if (!course) {
      return null;
    }

    return PrismaCourseMapper.toDomain(course);
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      return null;
    }

    return PrismaCourseMapper.toDomain(course);
  }

  async findByIdWithTeachers(id: string): Promise<FindWithTeachers | null> {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        teacherCourse: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    return PrismaCourseMapper.withTeachersToDomain(course);
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.course.findMany();

    if (courses.length === 0) {
      return [];
    }

    return courses.map((course) => PrismaCourseMapper.toDomain(course));
  }

  async create(course: Course): Promise<void> {
    const data = PrismaCourseMapper.toPrisma(course);

    await this.prisma.course.create({
      data,
    });
  }

  async save(course: Course): Promise<void> {
    const data = PrismaCourseMapper.toPrisma(course);

    await this.prisma.course.update({
      where: {
        id: course.id.toString(),
      },
      data,
    });
  }

  async delete(course: Course): Promise<void> {
    await this.prisma.course.delete({
      where: {
        id: course.id.toString(),
      },
    });
  }
}
