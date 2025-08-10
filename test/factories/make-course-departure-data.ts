import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseDepartureData,
  CourseDepartureDataProps,
} from '@/domain/entities/course-departure-data';
import { PrismaCourseDepartureDataMapper } from '@/infra/database/prisma/mappers/prisma-departure-course-data-mapper';

export function makeCourseDepartureData(
  override: Partial<CourseDepartureDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseDepartureData = CourseDepartureData.create(
    {
      year: 2025,
      semester: 'first',
      courseId: 'course-departure-data-1',
      deaths: faker.number.int(),
      completed: faker.number.int(),
      maximumDuration: faker.number.int(),
      dropouts: faker.number.int(),
      transfers: faker.number.int(),
      withdrawals: faker.number.int(),
      removals: faker.number.int(),
      newExams: faker.number.int(),
      ...override,
    },
    id,
  );

  return courseDepartureData;
}

@Injectable()
export class CourseDepartureDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseDepartureData(
    data: Partial<CourseDepartureDataProps> = {},
  ): Promise<CourseDepartureData> {
    const courseDepartureData = makeCourseDepartureData(data);

    await this.prisma.courseDepartureData.create({
      data: PrismaCourseDepartureDataMapper.toPrismaCreate(courseDepartureData),
    });

    return courseDepartureData;
  }
}
