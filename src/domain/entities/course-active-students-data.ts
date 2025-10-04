import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';
import { ActiveStudentsByIngress } from './active-students-by-ingress';

export interface CourseActiveStudentsDataProps extends CourseDataProps {
  activeStudentsByIngress: ActiveStudentsByIngress[];
}

export class CourseActiveStudentsData extends CourseData<CourseActiveStudentsDataProps> {
  get activeStudentsByIngress() {
    return this.props.activeStudentsByIngress;
  }

  set activeStudentsByIngress(
    activeStudentsByIngress: ActiveStudentsByIngress[],
  ) {
    if (!activeStudentsByIngress) {
      return;
    }

    this.props.activeStudentsByIngress = activeStudentsByIngress;
  }

  static create(
    props: Optional<CourseActiveStudentsDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseActiveStudentsData = new CourseActiveStudentsData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseActiveStudentsData;
  }
}
