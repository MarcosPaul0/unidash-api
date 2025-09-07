import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseCompletionWorkDataProps extends CourseDataProps {
  enrollments: number;
  defenses: number;
  abandonments: number;
}

export class CourseCompletionWorkData extends CourseData<CourseCompletionWorkDataProps> {
  get enrollments() {
    return this.props.enrollments;
  }

  set enrollments(enrollments: number) {
    if (!enrollments) {
      return;
    }

    this.props.enrollments = enrollments;
  }

  get defenses() {
    return this.props.defenses;
  }

  set defenses(defenses: number) {
    if (!defenses) {
      return;
    }

    this.props.defenses = defenses;
  }

  get abandonments() {
    return this.props.abandonments;
  }

  set abandonments(abandonments: number) {
    if (!abandonments) {
      return;
    }

    this.props.abandonments = abandonments;
  }

  static create(
    props: Optional<CourseCompletionWorkDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new CourseCompletionWorkData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseStudentsData;
  }
}
