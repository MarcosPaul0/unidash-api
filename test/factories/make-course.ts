import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Course, CourseProps } from '@/domain/entities/course';
import { PrismaCourseMapper } from '@/infra/database/prisma/mappers/prisma-course-mapper';

export function makeCourse(
  override: Partial<CourseProps> = {},
  id?: UniqueEntityId,
) {
  const course = Course.create(
    {
      name: faker.person.fullName(),
      ...override,
    },
    id,
  );

  return course;
}

@Injectable()
export class CourseFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourse(data: Partial<CourseProps> = {}): Promise<Course> {
    const course = makeCourse(data);

    await this.prisma.course.create({
      data: PrismaCourseMapper.toPrisma(course),
    });

    return course;
  }
}
