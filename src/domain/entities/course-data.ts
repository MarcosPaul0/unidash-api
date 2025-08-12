import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export const SEMESTER = {
  first: 'first',
  second: 'second',
} as const;

export type Semester = (typeof SEMESTER)[keyof typeof SEMESTER];

export interface CourseDataProps {
  courseId: string;
  year: number;
  semester: Semester;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class CourseData<Props = unknown> extends Entity<
  Props & CourseDataProps
> {
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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<CourseDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const user = new CourseData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
