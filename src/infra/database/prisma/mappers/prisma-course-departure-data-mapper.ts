import {
  CourseDepartureData as PrismaCourseDepartureData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';

export class PrismaCourseDepartureDataMapper {
  static toDomain(raw: PrismaCourseDepartureData): CourseDepartureData {
    return CourseDepartureData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        completed: raw.completed,
        maximumDuration: raw.maximumDuration,
        dropouts: raw.dropouts,
        transfers: raw.transfers,
        withdrawals: raw.withdrawals,
        removals: raw.removals,
        newExams: raw.newExams,
        deaths: raw.deaths,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseDepartureData: CourseDepartureData,
  ): Prisma.CourseDepartureDataUncheckedCreateInput {
    return {
      courseId: courseDepartureData.courseId,
      year: courseDepartureData.year,
      semester: courseDepartureData.semester,
      completed: courseDepartureData.completed,
      maximumDuration: courseDepartureData.maximumDuration,
      dropouts: courseDepartureData.dropouts,
      transfers: courseDepartureData.transfers,
      withdrawals: courseDepartureData.withdrawals,
      removals: courseDepartureData.removals,
      newExams: courseDepartureData.newExams,
      deaths: courseDepartureData.deaths,
      createdAt: courseDepartureData.createdAt,
      updatedAt: courseDepartureData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseDepartureData: CourseDepartureData,
  ): Prisma.CourseDepartureDataUncheckedUpdateInput {
    return {
      id: courseDepartureData.id.toString(),
      year: courseDepartureData.year,
      semester: courseDepartureData.semester,
      completed: courseDepartureData.completed,
      maximumDuration: courseDepartureData.maximumDuration,
      dropouts: courseDepartureData.dropouts,
      transfers: courseDepartureData.transfers,
      withdrawals: courseDepartureData.withdrawals,
      removals: courseDepartureData.removals,
      newExams: courseDepartureData.newExams,
      deaths: courseDepartureData.deaths,
      createdAt: courseDepartureData.createdAt,
      updatedAt: courseDepartureData.updatedAt,
    };
  }
}
