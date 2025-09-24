import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseTeacherWorkloadData,
  CourseTeacherWorkloadDataProps,
} from '@/domain/entities/course-teacher-workload-data';
import { PrismaCourseTeacherWorkloadDataMapper } from '@/infra/database/prisma/mappers/prisma-course-teacher-workload-data-mapper';

export function makeCourseTeacherWorkloadData(
  override: Partial<CourseTeacherWorkloadDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseTeacherWorkloadData = CourseTeacherWorkloadData.create(
    {
      year: 2025,
      semester: 'first',
      workloadInMinutes: faker.number.int(),
      teacherId: 'teacher-1',
      courseId: 'course-1',
      ...override,
    },
    id,
  );

  return courseTeacherWorkloadData;
}

@Injectable()
export class CourseTeacherWorkloadDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTeacherWorkloadData(
    data: Partial<CourseTeacherWorkloadDataProps> = {},
  ): Promise<CourseTeacherWorkloadData> {
    const courseTeacherWorkloadData = makeCourseTeacherWorkloadData(data);

    await this.prisma.courseTeacherWorkloadData.create({
      data: PrismaCourseTeacherWorkloadDataMapper.toPrismaCreate(
        courseTeacherWorkloadData,
      ),
    });

    return courseTeacherWorkloadData;
  }
}
