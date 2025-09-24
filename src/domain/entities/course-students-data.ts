import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseStudentsDataProps extends CourseDataProps {
  entrants: number;
  actives: number;
  vacancies: number;
  subscribers: number;
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

  get vacancies() {
    return this.props.vacancies;
  }

  set vacancies(vacancies: number) {
    if (!vacancies) {
      return;
    }

    this.props.vacancies = vacancies;
  }

  get subscribers() {
    return this.props.subscribers;
  }

  set subscribers(subscribers: number) {
    if (!subscribers) {
      return;
    }

    this.props.subscribers = subscribers;
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
