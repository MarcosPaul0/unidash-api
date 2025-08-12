import {
  CourseCoordinationData as PrismaCourseCoordinationData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';

export class PrismaCourseCoordinationDataMapper {
  static toDomain(raw: PrismaCourseCoordinationData): CourseCoordinationData {
    return CourseCoordinationData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        servicesRequestsBySystem: raw.servicesRequestsBySystem,
        servicesRequestsByEmail: raw.servicesRequestsByEmail,
        resolutionActions: raw.resolutionActions,
        administrativeDecisionActions: raw.administrativeDecisionActions,
        meetingsByBoardOfDirectors: raw.meetingsByBoardOfDirectors,
        meetingsByUndergraduateChamber: raw.meetingsByUndergraduateChamber,
        meetingsByCourseCouncil: raw.meetingsByCourseCouncil,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseCoordinationData: CourseCoordinationData,
  ): Prisma.CourseCoordinationDataUncheckedCreateInput {
    return {
      courseId: courseCoordinationData.courseId,
      year: courseCoordinationData.year,
      semester: courseCoordinationData.semester,
      servicesRequestsBySystem: courseCoordinationData.servicesRequestsBySystem,
      servicesRequestsByEmail: courseCoordinationData.servicesRequestsByEmail,
      resolutionActions: courseCoordinationData.resolutionActions,
      administrativeDecisionActions:
        courseCoordinationData.administrativeDecisionActions,
      meetingsByBoardOfDirectors:
        courseCoordinationData.meetingsByBoardOfDirectors,
      meetingsByUndergraduateChamber:
        courseCoordinationData.meetingsByUndergraduateChamber,
      meetingsByCourseCouncil: courseCoordinationData.meetingsByCourseCouncil,
      createdAt: courseCoordinationData.createdAt,
      updatedAt: courseCoordinationData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseCoordinationData: CourseCoordinationData,
  ): Prisma.CourseCoordinationDataUncheckedUpdateInput {
    return {
      id: courseCoordinationData.id.toString(),
      year: courseCoordinationData.year,
      semester: courseCoordinationData.semester,
      servicesRequestsBySystem: courseCoordinationData.servicesRequestsBySystem,
      servicesRequestsByEmail: courseCoordinationData.servicesRequestsByEmail,
      resolutionActions: courseCoordinationData.resolutionActions,
      administrativeDecisionActions:
        courseCoordinationData.administrativeDecisionActions,
      meetingsByBoardOfDirectors:
        courseCoordinationData.meetingsByBoardOfDirectors,
      meetingsByUndergraduateChamber:
        courseCoordinationData.meetingsByUndergraduateChamber,
      meetingsByCourseCouncil: courseCoordinationData.meetingsByCourseCouncil,
      createdAt: courseCoordinationData.createdAt,
      updatedAt: courseCoordinationData.updatedAt,
    };
  }
}
