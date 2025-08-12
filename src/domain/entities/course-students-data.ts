import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseStudentsDataProps extends CourseDataProps {
  entrants: number;
  actives: number;
  locks: number;
  canceled: number;
}

export class CourseStudentsData extends CourseData<CourseStudentsDataProps> {
  get entrants() {
    return this.props.entrants;
  }

  set entrants(entrants: number) {
    if (!entrants) {
      return;
    }

    this.props.entrants = entrants;
  }

  get actives() {
    return this.props.actives;
  }

  set actives(actives: number) {
    if (!actives) {
      return;
    }

    this.props.actives = actives;
  }

  get locks() {
    return this.props.locks;
  }

  set locks(locks: number) {
    if (!locks) {
      return;
    }

    this.props.locks = locks;
  }

  get canceled() {
    return this.props.canceled;
  }

  set canceled(canceled: number) {
    if (!canceled) {
      return;
    }

    this.props.canceled = canceled;
  }

  static create(
    props: Optional<CourseStudentsDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new CourseStudentsData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseStudentsData;
  }
}
