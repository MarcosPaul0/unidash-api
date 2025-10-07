import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';

export class CourseCoordinationIndicatorsPresenter {
  static toHTTP(courseCoordinationData: CourseCoordinationData[]) {
    const courseCoordinationMap = new Map();

    courseCoordinationData.forEach((currentData) => {
      const yearData = courseCoordinationMap.get(currentData.year);

      if (yearData) {
        courseCoordinationMap.set(currentData.year, {
          year: yearData.year,
          servicesRequestsBySystem:
            yearData.servicesRequestsBySystem +
            currentData.servicesRequestsBySystem,
          servicesRequestsByEmail:
            yearData.servicesRequestsByEmail +
            currentData.servicesRequestsByEmail,
          resolutionActions:
            yearData.resolutionActions + currentData.resolutionActions,
          administrativeDecisionActions:
            yearData.administrativeDecisionActions +
            currentData.administrativeDecisionActions,
          meetingsByBoardOfDirectors:
            yearData.meetingsByBoardOfDirectors +
            currentData.meetingsByBoardOfDirectors,
          meetingsByUndergraduateChamber:
            yearData.meetingsByUndergraduateChamber +
            currentData.meetingsByUndergraduateChamber,
          meetingsByCourseCouncil:
            yearData.meetingsByCourseCouncil +
            currentData.meetingsByCourseCouncil,
          academicActionPlans:
            yearData.academicActionPlans + currentData.academicActionPlans,
          administrativeActionPlans:
            yearData.administrativeActionPlans +
            currentData.administrativeActionPlans,
          actionPlansDescriptions: {
            ...yearData.actionPlansDescriptions,
            [currentData.semester]: currentData.actionPlansDescription,
          },
        });
      } else {
        courseCoordinationMap.set(currentData.year, {
          year: currentData.year,
          servicesRequestsBySystem: currentData.servicesRequestsBySystem,
          servicesRequestsByEmail: currentData.servicesRequestsByEmail,
          resolutionActions: currentData.resolutionActions,
          administrativeDecisionActions:
            currentData.administrativeDecisionActions,
          meetingsByBoardOfDirectors: currentData.meetingsByBoardOfDirectors,
          meetingsByUndergraduateChamber:
            currentData.meetingsByUndergraduateChamber,
          meetingsByCourseCouncil: currentData.meetingsByCourseCouncil,
          academicActionPlans: currentData.academicActionPlans,
          administrativeActionPlans: currentData.administrativeActionPlans,
          actionPlansDescriptions: {
            [currentData.semester]: currentData.actionPlansDescription,
          },
        });
      }
    });

    const actionPlans = {};

    const result = Array.from(courseCoordinationMap.values()).reduce(
      (accumulator, data) => {
        accumulator.actions.push({
          year: data.year,
          resolutionActions: data.resolutionActions,
          administrativeDecisionActions: data.administrativeDecisionActions,
        });

        accumulator.meetings.push({
          year: data.year,
          meetingsByBoardOfDirectors: data.meetingsByBoardOfDirectors,
          meetingsByUndergraduateChamber: data.meetingsByUndergraduateChamber,
          meetingsByCourseCouncil: data.meetingsByCourseCouncil,
        });

        accumulator.services.push({
          year: data.year,
          servicesRequestsBySystem: data.servicesRequestsBySystem,
          servicesRequestsByEmail: data.servicesRequestsByEmail,
        });

        actionPlans[data.year] = {
          academicActionPlans: data.academicActionPlans,
          administrativeActionPlans: data.administrativeActionPlans,
          actionPlansDescriptions: data.actionPlansDescriptions,
        };

        return accumulator;
      },
      {
        actions: [],
        meetings: [],
        services: [],
      },
    );

    const period = Array.from(courseCoordinationMap.keys());

    return {
      actions: result.actions.reverse(),
      meetings: result.meetings.reverse(),
      services: result.services.reverse(),
      actionPlans,
      period,
    };
  }
}
