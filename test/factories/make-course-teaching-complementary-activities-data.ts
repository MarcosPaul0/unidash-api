import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseTeachingComplementaryActivitiesData,
  CourseTeachingComplementaryActivitiesDataProps,
} from '@/domain/entities/course-teaching-complementary-activities-data';
import { PrismaCourseTeachingComplementaryActivitiesDataMapper } from '@/infra/database/prisma/mappers/prisma-course-teaching-complementary-activities-data-mapper';

export function makeCourseTeachingComplementaryActivitiesData(
  override: Partial<CourseTeachingComplementaryActivitiesDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseTeachingComplementaryActivitiesData =
    CourseTeachingComplementaryActivitiesData.create(
      {
        year: 2025,
        semester: 'first',
        courseId: 'course-teaching-complementary-activities-data-1',
        subjectMonitoring: faker.number.int(),
        sponsorshipOfNewStudents: faker.number.int(),
        providingTraining: faker.number.int(),
        coursesInTheArea: faker.number.int(),
        coursesOutsideTheArea: faker.number.int(),
        electivesDisciplines: faker.number.int(),
        complementaryCoursesInTheArea: faker.number.int(),
        preparationForTest: faker.number.int(),
        ...override,
      },
      id,
    );

  return courseTeachingComplementaryActivitiesData;
}

@Injectable()
export class CourseTeachingComplementaryActivitiesDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseTeachingComplementaryActivitiesData(
    data: Partial<CourseTeachingComplementaryActivitiesDataProps> = {},
  ): Promise<CourseTeachingComplementaryActivitiesData> {
    const courseTeachingComplementaryActivitiesData =
      makeCourseTeachingComplementaryActivitiesData(data);

    await this.prisma.courseTeachingComplementaryActivitiesData.create({
      data: PrismaCourseTeachingComplementaryActivitiesDataMapper.toPrismaCreate(
        courseTeachingComplementaryActivitiesData,
      ),
    });

    return courseTeachingComplementaryActivitiesData;
  }
}
