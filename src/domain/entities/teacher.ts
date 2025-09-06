import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User, UserProps } from './user';
import { Optional } from '@/core/types/optional';

export interface TeacherProps extends UserProps {
  isActive: boolean;
}

export class Teacher extends User<TeacherProps> {
  get isActive() {
    return this.props.isActive;
  }

  set isActive(isActive: boolean) {
    if (isActive === null || isActive === undefined) {
      return;
    }

    this.props.isActive = isActive;
  }

  static create(
    props: Optional<TeacherProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const teacher = new Teacher(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: 'teacher',
      },
      id,
    );

    return teacher;
  }
}
