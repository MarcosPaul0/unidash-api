import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseRegistrationLockData,
  CourseRegistrationLockDataProps,
} from '@/domain/entities/course-registration-lock-data';
import { PrismaCourseRegistrationLockDataMapper } from '@/infra/database/prisma/mappers/prisma-course-registration-lock-data-mapper';

export function makeCourseRegistrationLockData(
  override: Partial<CourseRegistrationLockDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseRegistrationLockData = CourseRegistrationLockData.create(
    {
      year: 2025,
      semester: 'first',
      courseId: 'course-registration-lock-data-1',
      difficultyInDiscipline: faker.number.int(),
      workload: faker.number.int(),
      teacherMethodology: faker.number.int(),
      incompatibilityWithWork: faker.number.int(),
      lossOfInterest: faker.number.int(),
      other: faker.number.int(),
      ...override,
    },
    id,
  );

  return courseRegistrationLockData;
}

@Injectable()
export class CourseRegistrationLockDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseRegistrationLockData(
    data: Partial<CourseRegistrationLockDataProps> = {},
  ): Promise<CourseRegistrationLockData> {
    const courseRegistrationLockData = makeCourseRegistrationLockData(data);

    await this.prisma.courseRegistrationLockData.create({
      data: PrismaCourseRegistrationLockDataMapper.toPrismaCreate(
        courseRegistrationLockData,
      ),
    });

    return courseRegistrationLockData;
  }
}
