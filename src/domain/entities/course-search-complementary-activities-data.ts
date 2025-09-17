import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseSearchComplementaryActivitiesDataProps
  extends CourseDataProps {
  scientificInitiation: number;
  developmentInitiation: number;
  publishedArticles: number;
  fullPublishedArticles: number;
  publishedAbstracts: number;
  presentationOfWork: number;
  participationInEvents: number;
}

export class CourseSearchComplementaryActivitiesData extends CourseData<CourseSearchComplementaryActivitiesDataProps> {
  get scientificInitiation() {
    return this.props.scientificInitiation;
  }

  set scientificInitiation(scientificInitiation: number) {
    if (!scientificInitiation) {
      return;
    }

    this.props.scientificInitiation = scientificInitiation;
  }

  get developmentInitiation() {
    return this.props.developmentInitiation;
  }

  set developmentInitiation(developmentInitiation: number) {
    if (!developmentInitiation) {
      return;
    }

    this.props.developmentInitiation = developmentInitiation;
  }

  get publishedArticles() {
    return this.props.publishedArticles;
  }

  set publishedArticles(publishedArticles: number) {
    if (!publishedArticles) {
      return;
    }

    this.props.publishedArticles = publishedArticles;
  }

  get fullPublishedArticles() {
    return this.props.fullPublishedArticles;
  }

  set fullPublishedArticles(fullPublishedArticles: number) {
    if (!fullPublishedArticles) {
      return;
    }

    this.props.fullPublishedArticles = fullPublishedArticles;
  }

  get publishedAbstracts() {
    return this.props.publishedAbstracts;
  }

  set publishedAbstracts(publishedAbstracts: number) {
    if (!publishedAbstracts) {
      return;
    }

    this.props.publishedAbstracts = publishedAbstracts;
  }

  get presentationOfWork() {
    return this.props.presentationOfWork;
  }

  set presentationOfWork(presentationOfWork: number) {
    if (!presentationOfWork) {
      return;
    }

    this.props.presentationOfWork = presentationOfWork;
  }

  get participationInEvents() {
    return this.props.participationInEvents;
  }

  set participationInEvents(participationInEvents: number) {
    if (!participationInEvents) {
      return;
    }

    this.props.participationInEvents = participationInEvents;
  }

  static create(
    props: Optional<CourseSearchComplementaryActivitiesDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseSearchComplementaryActivitiesData =
      new CourseSearchComplementaryActivitiesData(
        {
          ...props,
          createdAt: props.createdAt ?? new Date(),
        },
        id,
      );

    return courseSearchComplementaryActivitiesData;
  }
}
