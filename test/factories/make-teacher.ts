import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Teacher, TeacherProps } from '@/domain/entities/teacher';
import { PrismaTeacherMapper } from '@/infra/database/prisma/mappers/prisma-teacher-mapper';

export function makeTeacher(
  override: Partial<Omit<TeacherProps, 'role'>> = {},
  id?: UniqueEntityId,
) {
  const teacher = Teacher.create(
    {
      name: faker.company.name(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isActive: true,
      role: 'teacher',
      ...override,
    },
    id,
  );

  return teacher;
}

@Injectable()
export class TeacherFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTeacher(data: Partial<TeacherProps> = {}): Promise<Teacher> {
    const teacher = makeTeacher(data);

    await this.prisma.user.create({
      data: PrismaTeacherMapper.toPrismaCreate(teacher),
    });

    return teacher;
  }
}
