import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export const SEMESTER = {
  first: 'first',
  second: 'second',
} as const;

export type Semester = (typeof SEMESTER)[keyof typeof SEMESTER];

export interface CourseDepartureDataProps {
  courseId: string;
  year: number;
  semester: Semester;
  completed: number;
  maximumDuration: number;
  dropouts: number;
  transfers: number;
  withdrawals: number;
  removals: number;
  newExams: number;
  deaths: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class CourseDepartureData extends Entity<CourseDepartureDataProps> {
  get courseId() {
    return this.props.courseId;
  }

  set courseId(courseId: string) {
    if (!courseId) {
      return;
    }

    this.props.courseId = courseId;
  }

  get year() {
    return this.props.year;
  }

  set year(year: number) {
    if (!year) {
      return;
    }

    this.props.year = year;
  }

  get semester() {
    return this.props.semester;
  }

  set semester(semester: Semester) {
    if (!semester) {
      return;
    }

    this.props.semester = semester;
  }

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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
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
