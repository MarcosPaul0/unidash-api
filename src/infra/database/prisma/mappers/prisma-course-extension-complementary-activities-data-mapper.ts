import {
  CourseExtensionComplementaryActivitiesData as PrismaCourseExtensionComplementaryActivitiesData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';

export class PrismaCourseExtensionComplementaryActivitiesDataMapper {
  static toDomain(
    raw: PrismaCourseExtensionComplementaryActivitiesData,
  ): CourseExtensionComplementaryActivitiesData {
    return CourseExtensionComplementaryActivitiesData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        culturalActivities: raw.culturalActivities,
        sportsCompetitions: raw.sportsCompetitions,
        awardsAtEvents: raw.awardsAtEvents,
        studentRepresentation: raw.studentRepresentation,
        participationInCollegiateBodies: raw.participationInCollegiateBodies,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Prisma.CourseExtensionComplementaryActivitiesDataUncheckedCreateInput {
    return {
      courseId: courseExtensionComplementaryActivitiesData.courseId,
      year: courseExtensionComplementaryActivitiesData.year,
      semester: courseExtensionComplementaryActivitiesData.semester,
      culturalActivities:
        courseExtensionComplementaryActivitiesData.culturalActivities,
      sportsCompetitions:
        courseExtensionComplementaryActivitiesData.sportsCompetitions,
      awardsAtEvents: courseExtensionComplementaryActivitiesData.awardsAtEvents,
      studentRepresentation:
        courseExtensionComplementaryActivitiesData.studentRepresentation,
      participationInCollegiateBodies:
        courseExtensionComplementaryActivitiesData.participationInCollegiateBodies,
      createdAt: courseExtensionComplementaryActivitiesData.createdAt,
      updatedAt: courseExtensionComplementaryActivitiesData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData,
  ): Prisma.CourseExtensionComplementaryActivitiesDataUncheckedUpdateInput {
    return {
      id: courseExtensionComplementaryActivitiesData.id.toString(),
      year: courseExtensionComplementaryActivitiesData.year,
      semester: courseExtensionComplementaryActivitiesData.semester,
      culturalActivities:
        courseExtensionComplementaryActivitiesData.culturalActivities,
      sportsCompetitions:
        courseExtensionComplementaryActivitiesData.sportsCompetitions,
      awardsAtEvents: courseExtensionComplementaryActivitiesData.awardsAtEvents,
      studentRepresentation:
        courseExtensionComplementaryActivitiesData.studentRepresentation,
      participationInCollegiateBodies:
        courseExtensionComplementaryActivitiesData.participationInCollegiateBodies,
      createdAt: courseExtensionComplementaryActivitiesData.createdAt,
      updatedAt: courseExtensionComplementaryActivitiesData.updatedAt,
    };
  }
}
