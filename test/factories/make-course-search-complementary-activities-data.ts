import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseSearchComplementaryActivitiesData,
  CourseSearchComplementaryActivitiesDataProps,
} from '@/domain/entities/course-search-complementary-activities-data';
import { PrismaCourseSearchComplementaryActivitiesDataMapper } from '@/infra/database/prisma/mappers/prisma-course-search-complementary-activities-data-mapper';

export function makeCourseSearchComplementaryActivitiesData(
  override: Partial<CourseSearchComplementaryActivitiesDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseSearchComplementaryActivitiesData =
    CourseSearchComplementaryActivitiesData.create(
      {
        year: 2025,
        semester: 'first',
        courseId: 'course-search-complementary-activities-data-1',
        scientificInitiation: faker.number.int(),
        developmentInitiation: faker.number.int(),
        publishedArticles: faker.number.int(),
        fullPublishedArticles: faker.number.int(),
        publishedAbstracts: faker.number.int(),
        presentationOfWork: faker.number.int(),
        participationInEvents: faker.number.int(),
        ...override,
      },
      id,
    );

  return courseSearchComplementaryActivitiesData;
}

@Injectable()
export class CourseSearchComplementaryActivitiesDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseSearchComplementaryActivitiesData(
    data: Partial<CourseSearchComplementaryActivitiesDataProps> = {},
  ): Promise<CourseSearchComplementaryActivitiesData> {
    const courseSearchComplementaryActivitiesData =
      makeCourseSearchComplementaryActivitiesData(data);

    await this.prisma.courseSearchComplementaryActivitiesData.create({
      data: PrismaCourseSearchComplementaryActivitiesDataMapper.toPrismaCreate(
        courseSearchComplementaryActivitiesData,
      ),
    });

    return courseSearchComplementaryActivitiesData;
  }
}
