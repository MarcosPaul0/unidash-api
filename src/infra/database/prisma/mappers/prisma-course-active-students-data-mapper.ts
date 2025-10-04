import {
  CourseActiveStudentsData as PrismaCourseActiveStudentsData,
  ActiveStudentsByIngress as PrismaActiveStudentsByIngress,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';
import { ActiveStudentsByIngress } from '@/domain/entities/active-students-by-ingress';

type PrismaCourseActiveStudentsDataWithStudentsByIngress =
  PrismaCourseActiveStudentsData & {
    activeStudentsByIngress: PrismaActiveStudentsByIngress[];
  };

export class PrismaCourseActiveStudentsDataMapper {
  static toDomain(
    raw: PrismaCourseActiveStudentsDataWithStudentsByIngress,
  ): CourseActiveStudentsData {
    return CourseActiveStudentsData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        activeStudentsByIngress: raw.activeStudentsByIngress.map(
          (activeStudents) =>
            ActiveStudentsByIngress.create(
              {
                ingressYear: activeStudents.ingressYear,
                numberOfStudents: activeStudents.numberOfStudents,
              },
              new UniqueEntityId(activeStudents.id),
            ),
        ),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseActiveStudentsData: CourseActiveStudentsData,
  ): Prisma.CourseActiveStudentsDataUncheckedCreateInput {
    return {
      courseId: courseActiveStudentsData.courseId,
      year: courseActiveStudentsData.year,
      semester: courseActiveStudentsData.semester,
      createdAt: courseActiveStudentsData.createdAt,
      updatedAt: courseActiveStudentsData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseActiveStudentsData: CourseActiveStudentsData,
  ): Prisma.CourseActiveStudentsDataUncheckedUpdateInput {
    return {
      id: courseActiveStudentsData.id.toString(),
      year: courseActiveStudentsData.year,
      semester: courseActiveStudentsData.semester,
      createdAt: courseActiveStudentsData.createdAt,
      updatedAt: courseActiveStudentsData.updatedAt,
    };
  }
}
