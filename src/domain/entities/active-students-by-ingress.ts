import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ActiveStudentsByIngressProps {
  ingressYear: number;
  numberOfStudents: number;
}

export class ActiveStudentsByIngress extends Entity<ActiveStudentsByIngressProps> {
  get ingressYear() {
    return this.props.ingressYear;
  }

  set ingressYear(ingressYear: number) {
    if (!ingressYear) {
      return;
    }

    this.props.ingressYear = ingressYear;
  }

  get numberOfStudents() {
    return this.props.numberOfStudents;
  }

  set numberOfStudents(numberOfStudents: number) {
    if (!numberOfStudents) {
      return;
    }

    this.props.numberOfStudents = numberOfStudents;
  }

  static create(props: ActiveStudentsByIngressProps, id?: UniqueEntityId) {
    const teacherCourse = new ActiveStudentsByIngress(props, id);

    return teacherCourse;
  }
}
