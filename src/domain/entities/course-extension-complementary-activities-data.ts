import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseExtensionComplementaryActivitiesDataProps
  extends CourseDataProps {
  culturalActivities: number;
  sportsCompetitions: number;
  awardsAtEvents: number;
  studentRepresentation: number;
  participationInCollegiateBodies: number;
}

export class CourseExtensionComplementaryActivitiesData extends CourseData<CourseExtensionComplementaryActivitiesDataProps> {
  get culturalActivities() {
    return this.props.culturalActivities;
  }

  set culturalActivities(culturalActivities: number) {
    if (!culturalActivities) {
      return;
    }

    this.props.culturalActivities = culturalActivities;
  }

  get sportsCompetitions() {
    return this.props.sportsCompetitions;
  }

  set sportsCompetitions(sportsCompetitions: number) {
    if (!sportsCompetitions) {
      return;
    }

    this.props.sportsCompetitions = sportsCompetitions;
  }

  get awardsAtEvents() {
    return this.props.awardsAtEvents;
  }

  set awardsAtEvents(awardsAtEvents: number) {
    if (!awardsAtEvents) {
      return;
    }

    this.props.awardsAtEvents = awardsAtEvents;
  }

  get studentRepresentation() {
    return this.props.studentRepresentation;
  }

  set studentRepresentation(studentRepresentation: number) {
    if (!studentRepresentation) {
      return;
    }

    this.props.studentRepresentation = studentRepresentation;
  }

  get participationInCollegiateBodies() {
    return this.props.participationInCollegiateBodies;
  }

  set participationInCollegiateBodies(participationInCollegiateBodies: number) {
    if (!participationInCollegiateBodies) {
      return;
    }

    this.props.participationInCollegiateBodies =
      participationInCollegiateBodies;
  }

  static create(
    props: Optional<
      CourseExtensionComplementaryActivitiesDataProps,
      'createdAt'
    >,
    id?: UniqueEntityId,
  ) {
    const courseExtensionComplementaryActivitiesData =
      new CourseExtensionComplementaryActivitiesData(
        {
          ...props,
          createdAt: props.createdAt ?? new Date(),
        },
        id,
      );

    return courseExtensionComplementaryActivitiesData;
  }
}
