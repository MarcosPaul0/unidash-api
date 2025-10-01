import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';

export class CourseCoordinationDataPresenter {
  static toHTTP(courseCoordinationData: CourseCoordinationData) {
    return {
      id: courseCoordinationData.id.toString(),
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
      academicActionPlans: courseCoordinationData.academicActionPlans,
      administrativeActionPlans:
        courseCoordinationData.administrativeActionPlans,
      createdAt: courseCoordinationData.createdAt,
      updatedAt: courseCoordinationData.updatedAt,
    };
  }
}
