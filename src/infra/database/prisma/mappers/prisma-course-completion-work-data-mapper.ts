import {
  CourseCompletionWorkData as PrismaCourseCompletionWorkData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';

export class PrismaCourseCompletionWorkDataMapper {
  static toDomain(
    raw: PrismaCourseCompletionWorkData,
  ): CourseCompletionWorkData {
    return CourseCompletionWorkData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        abandonments: raw.abandonments,
        enrollments: raw.enrollments,
        defenses: raw.defenses,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Prisma.CourseCompletionWorkDataUncheckedCreateInput {
    return {
      courseId: courseCompletionWorkData.courseId,
      year: courseCompletionWorkData.year,
      semester: courseCompletionWorkData.semester,
      abandonments: courseCompletionWorkData.abandonments,
      enrollments: courseCompletionWorkData.enrollments,
      defenses: courseCompletionWorkData.defenses,
      createdAt: courseCompletionWorkData.createdAt,
      updatedAt: courseCompletionWorkData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseCompletionWorkData: CourseCompletionWorkData,
  ): Prisma.CourseCompletionWorkDataUncheckedUpdateInput {
    return {
      id: courseCompletionWorkData.id.toString(),
      year: courseCompletionWorkData.year,
      semester: courseCompletionWorkData.semester,
      abandonments: courseCompletionWorkData.abandonments,
      enrollments: courseCompletionWorkData.enrollments,
      defenses: courseCompletionWorkData.defenses,
      createdAt: courseCompletionWorkData.createdAt,
      updatedAt: courseCompletionWorkData.updatedAt,
    };
  }
}
