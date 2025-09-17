import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseExtensionActivitiesData,
  CourseExtensionActivitiesDataProps,
} from '@/domain/entities/course-extension-activities-data';
import { PrismaCourseExtensionActivitiesDataMapper } from '@/infra/database/prisma/mappers/prisma-course-extension-activities-data-mapper';

export function makeCourseExtensionActivitiesData(
  override: Partial<CourseExtensionActivitiesDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseExtensionActivitiesData = CourseExtensionActivitiesData.create(
    {
      year: 2025,
      semester: 'first',
      courseId: 'course-extension-activities-data-1',
      specialProjects: faker.number.int(),
      participationInCompetitions: faker.number.int(),
      entrepreneurshipAndInnovation: faker.number.int(),
      eventOrganization: faker.number.int(),
      externalInternship: faker.number.int(),
      cultureAndExtensionProjects: faker.number.int(),
      semiannualProjects: faker.number.int(),
      workNonGovernmentalOrganization: faker.number.int(),
      juniorCompanies: faker.number.int(),
      provisionOfServicesWithSelfEmployedWorkers: faker.number.int(),
      ...override,
    },
    id,
  );

  return courseExtensionActivitiesData;
}

@Injectable()
export class CourseExtensionActivitiesDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseExtensionActivitiesData(
    data: Partial<CourseExtensionActivitiesDataProps> = {},
  ): Promise<CourseExtensionActivitiesData> {
    const courseExtensionActivitiesData =
      makeCourseExtensionActivitiesData(data);

    await this.prisma.courseExtensionActivitiesData.create({
      data: PrismaCourseExtensionActivitiesDataMapper.toPrismaCreate(
        courseExtensionActivitiesData,
      ),
    });

    return courseExtensionActivitiesData;
  }
}
