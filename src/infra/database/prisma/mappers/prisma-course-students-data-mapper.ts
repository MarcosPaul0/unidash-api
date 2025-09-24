import {
  CourseStudentsData as PrismaCourseStudentsData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseStudentsData } from '@/domain/entities/course-students-data';

export class PrismaCourseStudentsDataMapper {
  static toDomain(raw: PrismaCourseStudentsData): CourseStudentsData {
    return CourseStudentsData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        entrants: raw.entrants,
        actives: raw.actives,
        vacancies: raw.vacancies,
        subscribers: raw.subscribers,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseStudentsData: CourseStudentsData,
  ): Prisma.CourseStudentsDataUncheckedCreateInput {
    return {
      courseId: courseStudentsData.courseId,
      year: courseStudentsData.year,
      semester: courseStudentsData.semester,
      entrants: courseStudentsData.entrants,
      actives: courseStudentsData.actives,
      vacancies: courseStudentsData.vacancies,
      subscribers: courseStudentsData.subscribers,
      createdAt: courseStudentsData.createdAt,
      updatedAt: courseStudentsData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseStudentsData: CourseStudentsData,
  ): Prisma.CourseStudentsDataUncheckedUpdateInput {
    return {
      id: courseStudentsData.id.toString(),
      year: courseStudentsData.year,
      semester: courseStudentsData.semester,
      entrants: courseStudentsData.entrants,
      actives: courseStudentsData.actives,
      vacancies: courseStudentsData.vacancies,
      subscribers: courseStudentsData.subscribers,
      createdAt: courseStudentsData.createdAt,
      updatedAt: courseStudentsData.updatedAt,
    };
  }
}
