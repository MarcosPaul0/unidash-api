import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface CourseProps {
  name: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Course extends Entity<CourseProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    if (!name) {
      return;
    }

    this.props.name = name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<CourseProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const course = new Course(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return course;
  }
}
