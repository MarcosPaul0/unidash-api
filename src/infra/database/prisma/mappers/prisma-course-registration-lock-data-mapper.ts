import {
  CourseRegistrationLockData as PrismaCourseRegistrationLockData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';

export class PrismaCourseRegistrationLockDataMapper {
  static toDomain(
    raw: PrismaCourseRegistrationLockData,
  ): CourseRegistrationLockData {
    return CourseRegistrationLockData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        difficultyInDiscipline: raw.difficultyInDiscipline,
        workload: raw.workload,
        teacherMethodology: raw.teacherMethodology,
        incompatibilityWithWork: raw.incompatibilityWithWork,
        lossOfInterest: raw.lossOfInterest,
        other: raw.other,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Prisma.CourseRegistrationLockDataUncheckedCreateInput {
    return {
      courseId: courseRegistrationLockData.courseId,
      year: courseRegistrationLockData.year,
      semester: courseRegistrationLockData.semester,
      difficultyInDiscipline: courseRegistrationLockData.difficultyInDiscipline,
      workload: courseRegistrationLockData.workload,
      teacherMethodology: courseRegistrationLockData.teacherMethodology,
      incompatibilityWithWork:
        courseRegistrationLockData.incompatibilityWithWork,
      lossOfInterest: courseRegistrationLockData.lossOfInterest,
      other: courseRegistrationLockData.other,
      createdAt: courseRegistrationLockData.createdAt,
      updatedAt: courseRegistrationLockData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseRegistrationLockData: CourseRegistrationLockData,
  ): Prisma.CourseRegistrationLockDataUncheckedUpdateInput {
    return {
      id: courseRegistrationLockData.id.toString(),
      year: courseRegistrationLockData.year,
      semester: courseRegistrationLockData.semester,
      difficultyInDiscipline: courseRegistrationLockData.difficultyInDiscipline,
      workload: courseRegistrationLockData.workload,
      teacherMethodology: courseRegistrationLockData.teacherMethodology,
      incompatibilityWithWork:
        courseRegistrationLockData.incompatibilityWithWork,
      lossOfInterest: courseRegistrationLockData.lossOfInterest,
      other: courseRegistrationLockData.other,
      createdAt: courseRegistrationLockData.createdAt,
      updatedAt: courseRegistrationLockData.updatedAt,
    };
  }
}
