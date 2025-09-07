import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseCompletionWorkData,
  CourseCompletionWorkDataProps,
} from '@/domain/entities/course-completion-work-data';
import { PrismaCourseCompletionWorkDataMapper } from '@/infra/database/prisma/mappers/prisma-course-completion-work-data-mapper';

export function makeCourseCompletionWorkData(
  override: Partial<CourseCompletionWorkDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseCompletionWorkData = CourseCompletionWorkData.create(
    {
      year: 2025,
      semester: 'first',
      courseId: 'course-1',
      enrollments: faker.number.int(),
      defenses: faker.number.int(),
      abandonments: faker.number.int(),
      ...override,
    },
    id,
  );

  return courseCompletionWorkData;
}

@Injectable()
export class CourseCompletionWorkDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseCompletionWorkData(
    data: Partial<CourseCompletionWorkDataProps> = {},
  ): Promise<CourseCompletionWorkData> {
    const CourseCompletionWorkData = makeCourseCompletionWorkData(data);

    await this.prisma.courseCompletionWorkData.create({
      data: PrismaCourseCompletionWorkDataMapper.toPrismaCreate(
        CourseCompletionWorkData,
      ),
    });

    return CourseCompletionWorkData;
  }
}
