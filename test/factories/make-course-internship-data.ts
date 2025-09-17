import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  CourseInternshipData,
  CourseInternshipDataProps,
} from '@/domain/entities/course-internship-data';
import { makeCity } from './make-city';
import { PrismaCourseInternshipDataMapper } from '@/infra/database/prisma/mappers/prisma-course-internship-data-mapper';

export function makeCourseInternshipData(
  override: Partial<CourseInternshipDataProps> = {},
  id?: UniqueEntityId,
) {
  const courseInternshipData = CourseInternshipData.create(
    {
      year: 2025,
      semester: 'first',
      courseId: 'course-Internship-data-1',
      advisorId: 'advisor-1',
      cityId: 'city-1',
      city: makeCity(),
      conclusionTime: 'medium',
      enterpriseCnpj: 'fake-cnpj',
      role: 'fake-role',
      studentMatriculation: 'fake-matriculation',
      ...override,
    },
    id,
  );

  return courseInternshipData;
}

@Injectable()
export class CourseInternshipDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourseInternshipData(
    data: Partial<CourseInternshipDataProps> = {},
  ): Promise<CourseInternshipData> {
    const courseInternshipData = makeCourseInternshipData(data);

    await this.prisma.courseInternshipData.create({
      data: PrismaCourseInternshipDataMapper.toPrismaCreate(
        courseInternshipData,
      ),
    });

    return courseInternshipData;
  }
}
