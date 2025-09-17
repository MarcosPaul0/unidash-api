import {
  CourseTeachingComplementaryActivitiesData as PrismaCourseTeachingComplementaryActivitiesData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';

export class PrismaCourseTeachingComplementaryActivitiesDataMapper {
  static toDomain(
    raw: PrismaCourseTeachingComplementaryActivitiesData,
  ): CourseTeachingComplementaryActivitiesData {
    return CourseTeachingComplementaryActivitiesData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        subjectMonitoring: raw.subjectMonitoring,
        sponsorshipOfNewStudents: raw.sponsorshipOfNewStudents,
        providingTraining: raw.providingTraining,
        coursesInTheArea: raw.coursesInTheArea,
        coursesOutsideTheArea: raw.coursesOutsideTheArea,
        electivesDisciplines: raw.electivesDisciplines,
        complementaryCoursesInTheArea: raw.complementaryCoursesInTheArea,
        preparationForTest: raw.preparationForTest,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Prisma.CourseTeachingComplementaryActivitiesDataUncheckedCreateInput {
    return {
      courseId: courseTeachingComplementaryActivitiesData.courseId,
      year: courseTeachingComplementaryActivitiesData.year,
      semester: courseTeachingComplementaryActivitiesData.semester,
      subjectMonitoring:
        courseTeachingComplementaryActivitiesData.subjectMonitoring,
      sponsorshipOfNewStudents:
        courseTeachingComplementaryActivitiesData.sponsorshipOfNewStudents,
      providingTraining:
        courseTeachingComplementaryActivitiesData.providingTraining,
      coursesInTheArea:
        courseTeachingComplementaryActivitiesData.coursesInTheArea,
      coursesOutsideTheArea:
        courseTeachingComplementaryActivitiesData.coursesOutsideTheArea,
      electivesDisciplines:
        courseTeachingComplementaryActivitiesData.electivesDisciplines,
      complementaryCoursesInTheArea:
        courseTeachingComplementaryActivitiesData.complementaryCoursesInTheArea,
      preparationForTest:
        courseTeachingComplementaryActivitiesData.preparationForTest,
      createdAt: courseTeachingComplementaryActivitiesData.createdAt,
      updatedAt: courseTeachingComplementaryActivitiesData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData,
  ): Prisma.CourseTeachingComplementaryActivitiesDataUncheckedUpdateInput {
    return {
      id: courseTeachingComplementaryActivitiesData.id.toString(),
      year: courseTeachingComplementaryActivitiesData.year,
      semester: courseTeachingComplementaryActivitiesData.semester,
      subjectMonitoring:
        courseTeachingComplementaryActivitiesData.subjectMonitoring,
      sponsorshipOfNewStudents:
        courseTeachingComplementaryActivitiesData.sponsorshipOfNewStudents,
      providingTraining:
        courseTeachingComplementaryActivitiesData.providingTraining,
      coursesInTheArea:
        courseTeachingComplementaryActivitiesData.coursesInTheArea,
      coursesOutsideTheArea:
        courseTeachingComplementaryActivitiesData.coursesOutsideTheArea,
      electivesDisciplines:
        courseTeachingComplementaryActivitiesData.electivesDisciplines,
      complementaryCoursesInTheArea:
        courseTeachingComplementaryActivitiesData.complementaryCoursesInTheArea,
      preparationForTest:
        courseTeachingComplementaryActivitiesData.preparationForTest,
      createdAt: courseTeachingComplementaryActivitiesData.createdAt,
      updatedAt: courseTeachingComplementaryActivitiesData.updatedAt,
    };
  }
}
