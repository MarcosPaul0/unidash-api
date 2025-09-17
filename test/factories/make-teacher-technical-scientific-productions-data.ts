import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  TeacherTechnicalScientificProductionsData,
  TeacherTechnicalScientificProductionsDataProps,
} from '@/domain/entities/teacher-technical-scientific-productions-data';
import { PrismaTeacherTechnicalScientificProductionsDataMapper } from '@/infra/database/prisma/mappers/prisma-teacher-technical-scientific-productions-data-mapper';

export function makeTeacherTechnicalScientificProductionsData(
  override: Partial<TeacherTechnicalScientificProductionsDataProps> = {},
  id?: UniqueEntityId,
) {
  const teacherTechnicalScientificProductionsData =
    TeacherTechnicalScientificProductionsData.create(
      {
        year: 2025,
        semester: 'first',
        courseId: 'course-1',
        periodicals: faker.number.int(),
        congress: faker.number.int(),
        booksChapter: faker.number.int(),
        programs: faker.number.int(),
        abstracts: faker.number.int(),
        teacherId: 'teacher-1',
        ...override,
      },
      id,
    );

  return teacherTechnicalScientificProductionsData;
}

@Injectable()
export class TeacherTechnicalScientificProductionsDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTeacherTechnicalScientificProductionsData(
    data: Partial<TeacherTechnicalScientificProductionsDataProps> = {},
  ): Promise<TeacherTechnicalScientificProductionsData> {
    const TeacherTechnicalScientificProductionsData =
      makeTeacherTechnicalScientificProductionsData(data);

    await this.prisma.teacherTechnicalScientificProductionsData.create({
      data: PrismaTeacherTechnicalScientificProductionsDataMapper.toPrismaCreate(
        TeacherTechnicalScientificProductionsData,
      ),
    });

    return TeacherTechnicalScientificProductionsData;
  }
}
