import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseExtensionComplementaryActivitiesData,
  CourseExtensionComplementaryActivitiesDataProps,
} from '@/domain/entities/course-extension-complementary-activities-data';
import { PrismaCourseExtensionComplementaryActivitiesDataMapper } from '@/infra/database/prisma/mappers/prisma-course-extension-complementary-activities-data-mapper';

export function makeCourseExtensionComplementaryActivitiesData(
  override: Partial<CourseExtensionComplementaryActivitiesDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseExtensionComplementaryActivitiesData =
    CourseExtensionComplementaryActivitiesData.create(
      {
        year: 2025,
        semester: 'first',
        courseId: 'course-extension-complementary-activities-data-1',
        culturalActivities: faker.number.int(),
        sportsCompetitions: faker.number.int(),
        awardsAtEvents: faker.number.int(),
        studentRepresentation: faker.number.int(),
        participationInCollegiateBodies: faker.number.int(),
        ...override,
      },
      id,
    );

  return courseExtensionComplementaryActivitiesData;
}

@Injectable()
export class CourseExtensionComplementaryActivitiesDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseExtensionComplementaryActivitiesData(
    data: Partial<CourseExtensionComplementaryActivitiesDataProps> = {},
  ): Promise<CourseExtensionComplementaryActivitiesData> {
    const CourseExtensionComplementaryActivitiesData =
      makeCourseExtensionComplementaryActivitiesData(data);

    await this.prisma.courseExtensionComplementaryActivitiesData.create({
      data: PrismaCourseExtensionComplementaryActivitiesDataMapper.toPrismaCreate(
        CourseExtensionComplementaryActivitiesData,
      ),
    });

    return CourseExtensionComplementaryActivitiesData;
  }
}
