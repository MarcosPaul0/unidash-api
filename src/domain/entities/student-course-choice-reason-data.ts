import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';
import { CourseChoiceReason } from './student-course-choice-reason';
import { Optional } from '@/core/types/optional';

export interface StudentCourseChoiceReasonDataProps {
  studentIncomingDataId: string;
  choiceReason: CourseChoiceReason;
  description: string;
}

export class StudentCourseChoiceReasonData extends Entity<StudentCourseChoiceReasonDataProps> {
  get studentIncomingDataId() {
    return this.props.studentIncomingDataId;
  }

  set studentIncomingDataId(studentIncomingDataId: string) {
    if (!studentIncomingDataId) {
      return;
    }

    this.props.studentIncomingDataId = studentIncomingDataId;
  }

  get choiceReason() {
    return this.props.choiceReason;
  }

  set choiceReason(choiceReason: CourseChoiceReason) {
    if (!choiceReason) {
      return;
    }

    this.props.choiceReason = choiceReason;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    if (!description) {
      return;
    }

    this.props.description = description;
  }

  static create(
    props: Optional<StudentCourseChoiceReasonDataProps, 'description'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new StudentCourseChoiceReasonData(
      { ...props, description: props.description ?? '' },
      id,
    );

    return courseStudentsData;
  }
}
