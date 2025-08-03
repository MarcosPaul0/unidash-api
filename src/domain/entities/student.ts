import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User, UserProps } from './user';
import { Optional } from '@/core/types/optional';

export const STUDENT_TYPE = {
  incomingStudent: 'incomingStudent',
  outgoingStudent: 'outgoingStudent',
} as const;

export type StudentType = (typeof STUDENT_TYPE)[keyof typeof STUDENT_TYPE];

export interface StudentProps extends UserProps {
  matriculation: string;
  type: StudentType;
  courseId: string;
}

export class Student extends User<StudentProps> {
  get matriculation() {
    return this.props.matriculation;
  }

  set matriculation(matriculation: string) {
    if (!matriculation) {
      return;
    }

    this.props.matriculation = matriculation;
  }

  get type() {
    return this.props.type;
  }

  set type(type: StudentType) {
    if (type) {
      return;
    }

    this.props.type = type;
  }

  get courseId() {
    return this.props.courseId;
  }

  set courseId(courseId: string) {
    if (courseId) {
      return;
    }

    this.props.courseId = courseId;
  }

  static create(
    props: Optional<StudentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const student = new Student(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: 'student',
      },
      id,
    );

    return student;
  }
}
