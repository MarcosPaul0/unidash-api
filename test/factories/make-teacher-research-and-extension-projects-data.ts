import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  TeacherResearchAndExtensionProjectsData,
  TeacherResearchAndExtensionProjectsDataProps,
} from '@/domain/entities/teacher-research-and-extension-projects-data';
import { PrismaTeacherResearchAndExtensionProjectsDataMapper } from '@/infra/database/prisma/mappers/prisma-teacher-research-and-extension-projects-data-mapper';

export function makeTeacherResearchAndExtensionProjectsData(
  override: Partial<TeacherResearchAndExtensionProjectsDataProps> = {},
  id?: UniqueEntityId,
) {
  const teacherResearchAndExtensionProjectsData =
    TeacherResearchAndExtensionProjectsData.create(
      {
        year: 2025,
        semester: 'first',
        extensionProjects: faker.number.int(),
        researchProjects: faker.number.int(),
        teacherId: 'teacher-1',
        ...override,
      },
      id,
    );

  return teacherResearchAndExtensionProjectsData;
}

@Injectable()
export class TeacherResearchAndExtensionProjectsDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTeacherResearchAndExtensionProjectsData(
    data: Partial<TeacherResearchAndExtensionProjectsDataProps> = {},
  ): Promise<TeacherResearchAndExtensionProjectsData> {
    const TeacherResearchAndExtensionProjectsData =
      makeTeacherResearchAndExtensionProjectsData(data);

    await this.prisma.teacherResearchAndExtensionProjectsData.create({
      data: PrismaTeacherResearchAndExtensionProjectsDataMapper.toPrismaCreate(
        TeacherResearchAndExtensionProjectsData,
      ),
    });

    return TeacherResearchAndExtensionProjectsData;
  }
}
