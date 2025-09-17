import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseExtensionActivitiesDataProps extends CourseDataProps {
  specialProjects: number;
  participationInCompetitions: number;
  entrepreneurshipAndInnovation: number;
  eventOrganization: number;
  externalInternship: number;
  cultureAndExtensionProjects: number;
  semiannualProjects: number;
  workNonGovernmentalOrganization: number;
  juniorCompanies: number;
  provisionOfServicesWithSelfEmployedWorkers: number;
}

export class CourseExtensionActivitiesData extends CourseData<CourseExtensionActivitiesDataProps> {
  get specialProjects() {
    return this.props.specialProjects;
  }

  set specialProjects(specialProjects: number) {
    if (!specialProjects) {
      return;
    }

    this.props.specialProjects = specialProjects;
  }

  get participationInCompetitions() {
    return this.props.participationInCompetitions;
  }

  set participationInCompetitions(participationInCompetitions: number) {
    if (!participationInCompetitions) {
      return;
    }

    this.props.participationInCompetitions = participationInCompetitions;
  }

  get entrepreneurshipAndInnovation() {
    return this.props.entrepreneurshipAndInnovation;
  }

  set entrepreneurshipAndInnovation(entrepreneurshipAndInnovation: number) {
    if (!entrepreneurshipAndInnovation) {
      return;
    }

    this.props.entrepreneurshipAndInnovation = entrepreneurshipAndInnovation;
  }

  get eventOrganization() {
    return this.props.eventOrganization;
  }

  set eventOrganization(eventOrganization: number) {
    if (!eventOrganization) {
      return;
    }

    this.props.eventOrganization = eventOrganization;
  }

  get externalInternship() {
    return this.props.externalInternship;
  }

  set externalInternship(externalInternship: number) {
    if (!externalInternship) {
      return;
    }

    this.props.externalInternship = externalInternship;
  }

  get cultureAndExtensionProjects() {
    return this.props.cultureAndExtensionProjects;
  }

  set cultureAndExtensionProjects(cultureAndExtensionProjects: number) {
    if (!cultureAndExtensionProjects) {
      return;
    }

    this.props.cultureAndExtensionProjects = cultureAndExtensionProjects;
  }

  get semiannualProjects() {
    return this.props.semiannualProjects;
  }

  set semiannualProjects(semiannualProjects: number) {
    if (!semiannualProjects) {
      return;
    }

    this.props.semiannualProjects = semiannualProjects;
  }

  get workNonGovernmentalOrganization() {
    return this.props.workNonGovernmentalOrganization;
  }

  set workNonGovernmentalOrganization(workNonGovernmentalOrganization: number) {
    if (!workNonGovernmentalOrganization) {
      return;
    }

    this.props.workNonGovernmentalOrganization =
      workNonGovernmentalOrganization;
  }

  get juniorCompanies() {
    return this.props.juniorCompanies;
  }

  set juniorCompanies(juniorCompanies: number) {
    if (!juniorCompanies) {
      return;
    }

    this.props.juniorCompanies = juniorCompanies;
  }

  get provisionOfServicesWithSelfEmployedWorkers() {
    return this.props.provisionOfServicesWithSelfEmployedWorkers;
  }

  set provisionOfServicesWithSelfEmployedWorkers(
    provisionOfServicesWithSelfEmployedWorkers: number,
  ) {
    if (!provisionOfServicesWithSelfEmployedWorkers) {
      return;
    }

    this.props.provisionOfServicesWithSelfEmployedWorkers =
      provisionOfServicesWithSelfEmployedWorkers;
  }

  static create(
    props: Optional<CourseExtensionActivitiesDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseExtensionActivitiesData = new CourseExtensionActivitiesData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseExtensionActivitiesData;
  }
}
