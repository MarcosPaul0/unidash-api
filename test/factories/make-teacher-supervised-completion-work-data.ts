import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  TeacherSupervisedCompletionWorkData,
  TeacherSupervisedCompletionWorkDataProps,
} from '@/domain/entities/teacher-supervised-completion-work-data';
import { PrismaTeacherSupervisedCompletionWorkDataMapper } from '@/infra/database/prisma/mappers/prisma-teacher-supervised-completion-work-data-mapper';

export function makeTeacherSupervisedCompletionWorkData(
  override: Partial<TeacherSupervisedCompletionWorkDataProps> = {},
  id?: UniqueEntityId,
) {
  const teacherSupervisedCompletionWorkData =
    TeacherSupervisedCompletionWorkData.create(
      {
        year: 2025,
        semester: 'first',
        courseId: 'course-1',
        approved: faker.number.int(),
        failed: faker.number.int(),
        teacherId: 'teacher-1',
        ...override,
      },
      id,
    );

  return teacherSupervisedCompletionWorkData;
}

@Injectable()
export class TeacherSupervisedCompletionWorkDataFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTeacherSupervisedCompletionWorkData(
    data: Partial<TeacherSupervisedCompletionWorkDataProps> = {},
  ): Promise<TeacherSupervisedCompletionWorkData> {
    const TeacherSupervisedCompletionWorkData =
      makeTeacherSupervisedCompletionWorkData(data);

    await this.prisma.teacherSupervisedCompletionWorkData.create({
      data: PrismaTeacherSupervisedCompletionWorkDataMapper.toPrismaCreate(
        TeacherSupervisedCompletionWorkData,
      ),
    });

    return TeacherSupervisedCompletionWorkData;
  }
}
