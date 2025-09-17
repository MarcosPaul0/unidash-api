import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';
import { UniversityChoiceReason } from './student-university-choice-reason';
import { Optional } from '@/core/types/optional';

export interface StudentUniversityChoiceReasonDataProps {
  studentIncomingDataId: string;
  choiceReason: UniversityChoiceReason;
  description: string;
}

export class StudentUniversityChoiceReasonData extends Entity<StudentUniversityChoiceReasonDataProps> {
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

  set choiceReason(choiceReason: UniversityChoiceReason) {
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
    props: Optional<StudentUniversityChoiceReasonDataProps, 'description'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new StudentUniversityChoiceReasonData(
      { ...props, description: props.description ?? '' },
      id,
    );

    return courseStudentsData;
  }
}
