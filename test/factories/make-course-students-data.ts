import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseStudentsData,
  CourseStudentsDataProps,
} from '@/domain/entities/course-students-data';
import { PrismaCourseStudentsDataMapper } from '@/infra/database/prisma/mappers/prisma-course-students-data-mapper';

export function makeCourseStudentsData(
  override: Partial<CourseStudentsDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseStudentsData = CourseStudentsData.create(
    {
      year: 2025,
      semester: 'first',
      courseId: 'course-students-data-1',
      entrants: faker.number.int(),
      actives: faker.number.int(),
      locks: faker.number.int(),
      canceled: faker.number.int(),
      subscribers: faker.number.int(),
      vacancies: faker.number.int(),
      ...override,
    },
    id,
  );

  return courseStudentsData;
}

@Injectable()
export class CourseStudentsDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseStudentsData(
    data: Partial<CourseStudentsDataProps> = {},
  ): Promise<CourseStudentsData> {
    const courseStudentsData = makeCourseStudentsData(data);

    await this.prisma.courseStudentsData.create({
      data: PrismaCourseStudentsDataMapper.toPrismaCreate(courseStudentsData),
    });

    return courseStudentsData;
  }
}
