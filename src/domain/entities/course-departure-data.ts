import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseDepartureDataProps extends CourseDataProps {
  completed: number;
  maximumDuration: number;
  dropouts: number;
  transfers: number;
  withdrawals: number;
  removals: number;
  newExams: number;
  deaths: number;
}

export class CourseDepartureData extends CourseData<CourseDepartureDataProps> {
  get completed() {
    return this.props.completed;
  }

  set completed(completed: number) {
    if (!completed) {
      return;
    }

    this.props.completed = completed;
  }

  get maximumDuration() {
    return this.props.maximumDuration;
  }

  set maximumDuration(maximumDuration: number) {
    if (!maximumDuration) {
      return;
    }

    this.props.maximumDuration = maximumDuration;
  }

  get dropouts() {
    return this.props.dropouts;
  }

  set dropouts(dropouts: number) {
    if (!dropouts) {
      return;
    }

    this.props.dropouts = dropouts;
  }

  get transfers() {
    return this.props.transfers;
  }

  set transfers(transfers: number) {
    if (!transfers) {
      return;
    }

    this.props.transfers = transfers;
  }

  get withdrawals() {
    return this.props.withdrawals;
  }

  set withdrawals(withdrawals: number) {
    if (!withdrawals) {
      return;
    }

    this.props.withdrawals = withdrawals;
  }

  get removals() {
    return this.props.removals;
  }

  set removals(removals: number) {
    if (!removals) {
      return;
    }

    this.props.removals = removals;
  }

  get newExams() {
    return this.props.newExams;
  }

  set newExams(newExams: number) {
    if (!newExams) {
      return;
    }

    this.props.newExams = newExams;
  }

  get deaths() {
    return this.props.deaths;
  }

  set deaths(deaths: number) {
    if (!deaths) {
      return;
    }

    this.props.deaths = deaths;
  }

  static create(
    props: Optional<CourseDepartureDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseDepartureData = new CourseDepartureData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseDepartureData;
  }
}
