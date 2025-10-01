import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseCoordinationData,
  CourseCoordinationDataProps,
} from '@/domain/entities/course-coordination-data';
import { PrismaCourseCoordinationDataMapper } from '@/infra/database/prisma/mappers/prisma-course-coordination-data-mapper';

export function makeCourseCoordinationData(
  override: Partial<CourseCoordinationDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseCoordinationData = CourseCoordinationData.create(
    {
      year: 2025,
      semester: 'first',
      courseId: 'course-coordination-data-1',
      servicesRequestsBySystem: faker.number.int(),
      servicesRequestsByEmail: faker.number.int(),
      resolutionActions: faker.number.int(),
      administrativeDecisionActions: faker.number.int(),
      meetingsByBoardOfDirectors: faker.number.int(),
      meetingsByUndergraduateChamber: faker.number.int(),
      meetingsByCourseCouncil: faker.number.int(),
      academicActionPlans: faker.number.int(),
      administrativeActionPlans: faker.number.int(),
      ...override,
    },
    id,
  );

  return courseCoordinationData;
}

@Injectable()
export class CourseCoordinationDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseCoordinationData(
    data: Partial<CourseCoordinationDataProps> = {},
  ): Promise<CourseCoordinationData> {
    const courseCoordinationData = makeCourseCoordinationData(data);

    await this.prisma.courseCoordinationData.create({
      data: PrismaCourseCoordinationDataMapper.toPrismaCreate(
        courseCoordinationData,
      ),
    });

    return courseCoordinationData;
  }
}
