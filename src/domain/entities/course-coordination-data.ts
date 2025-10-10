import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseCoordinationDataProps extends CourseDataProps {
  servicesRequestsBySystem: number;
  servicesRequestsByEmail: number;
  resolutionActions: number;
  administrativeDecisionActions: number;
  meetingsByBoardOfDirectors: number;
  meetingsByUndergraduateChamber: number;
  meetingsByCourseCouncil: number;
  meetingsByNde: number;
  academicActionPlans: string | null;
  administrativeActionPlans: string | null;
}

export class CourseCoordinationData extends CourseData<CourseCoordinationDataProps> {
  get servicesRequestsBySystem() {
    return this.props.servicesRequestsBySystem;
  }

  set servicesRequestsBySystem(servicesRequestsBySystem: number) {
    if (!servicesRequestsBySystem) {
      return;
    }

    this.props.servicesRequestsBySystem = servicesRequestsBySystem;
  }

  get servicesRequestsByEmail() {
    return this.props.servicesRequestsByEmail;
  }

  set servicesRequestsByEmail(servicesRequestsByEmail: number) {
    if (!servicesRequestsByEmail) {
      return;
    }

    this.props.servicesRequestsByEmail = servicesRequestsByEmail;
  }

  get resolutionActions() {
    return this.props.resolutionActions;
  }

  set resolutionActions(resolutionActions: number) {
    if (!resolutionActions) {
      return;
    }

    this.props.resolutionActions = resolutionActions;
  }

  get administrativeDecisionActions() {
    return this.props.administrativeDecisionActions;
  }

  set administrativeDecisionActions(administrativeDecisionActions: number) {
    if (!administrativeDecisionActions) {
      return;
    }

    this.props.administrativeDecisionActions = administrativeDecisionActions;
  }

  get meetingsByBoardOfDirectors() {
    return this.props.meetingsByBoardOfDirectors;
  }

  set meetingsByBoardOfDirectors(meetingsByBoardOfDirectors: number) {
    if (!meetingsByBoardOfDirectors) {
      return;
    }

    this.props.meetingsByBoardOfDirectors = meetingsByBoardOfDirectors;
  }

  get meetingsByUndergraduateChamber() {
    return this.props.meetingsByUndergraduateChamber;
  }

  set meetingsByUndergraduateChamber(meetingsByUndergraduateChamber: number) {
    if (!meetingsByUndergraduateChamber) {
      return;
    }

    this.props.meetingsByUndergraduateChamber = meetingsByUndergraduateChamber;
  }

  get meetingsByCourseCouncil() {
    return this.props.meetingsByCourseCouncil;
  }

  set meetingsByCourseCouncil(meetingsByCourseCouncil: number) {
    if (!meetingsByCourseCouncil) {
      return;
    }

    this.props.meetingsByCourseCouncil = meetingsByCourseCouncil;
  }

  get meetingsByNde() {
    return this.props.meetingsByNde;
  }

  set meetingsByNde(meetingsByNde: number) {
    if (!meetingsByNde) {
      return;
    }

    this.props.meetingsByNde = meetingsByNde;
  }

  get academicActionPlans(): string | null {
    return this.props.academicActionPlans;
  }

  set academicActionPlans(academicActionPlans: string | null) {
    if (!academicActionPlans) {
      return;
    }

    this.props.academicActionPlans = academicActionPlans;
  }

  get administrativeActionPlans(): string | null {
    return this.props.administrativeActionPlans;
  }

  set administrativeActionPlans(administrativeActionPlans: string | null) {
    if (!administrativeActionPlans) {
      return;
    }

    this.props.administrativeActionPlans = administrativeActionPlans;
  }

  static create(
    props: Optional<CourseCoordinationDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new CourseCoordinationData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseStudentsData;
  }
}
