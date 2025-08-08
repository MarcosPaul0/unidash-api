import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  TeacherCourse,
  TeacherCourseProps,
} from '@/domain/entities/teacher-course';
import { makeCourse } from './make-course';
import { makeTeacher } from './make-teacher';
import { PrismaTeacherCourseMapper } from '@/infra/database/prisma/mappers/prisma-teacher-course-mapper';

export function makeTeacherCourse(
  override: Partial<TeacherCourseProps> = {},
  id?: UniqueEntityId,
) {
  const course = makeCourse(
    {},
    override?.courseId ? new UniqueEntityId(override?.courseId) : undefined,
  );

  const teacher = makeTeacher(
    {},
    override?.teacherId ? new UniqueEntityId(override?.teacherId) : undefined,
  );

  const teacherCourse = TeacherCourse.create(
    {
      teacherRole: 'courseManagerTeacher',
      ...override,
      courseId: override.course?.id.toString() ?? course.id.toString(),
      teacherId: override.teacher?.id.toString() ?? teacher.id.toString(),
      course: override.course ?? course,
      teacher: override.teacher ?? teacher,
    },
    id,
  );

  return teacherCourse;
}

@Injectable()
export class TeacherCourseFactory {
  constructor(private prisma: PrismaService) {}

  async makeTeacherCourse(
    data: Partial<TeacherCourseProps> = {},
  ): Promise<TeacherCourse> {
    const teacherCourse = makeTeacherCourse(data);

    await this.prisma.teacherCourse.create({
      data: PrismaTeacherCourseMapper.toPrismaCreate(teacherCourse),
    });

    return teacherCourse;
  }
}
