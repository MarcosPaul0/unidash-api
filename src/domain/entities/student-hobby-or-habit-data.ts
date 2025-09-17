import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';
import { HobbyOrHabit } from './student-hobby-or-habit';
import { Optional } from '@/core/types/optional';

export interface StudentHobbyOrHabitDataProps {
  studentIncomingDataId: string;
  hobbyOrHabit: HobbyOrHabit;
  description: string;
}

export class StudentHobbyOrHabitData extends Entity<StudentHobbyOrHabitDataProps> {
  get studentIncomingDataId() {
    return this.props.studentIncomingDataId;
  }

  set studentIncomingDataId(studentIncomingDataId: string) {
    if (!studentIncomingDataId) {
      return;
    }

    this.props.studentIncomingDataId = studentIncomingDataId;
  }

  get hobbyOrHabit() {
    return this.props.hobbyOrHabit;
  }

  set hobbyOrHabit(hobbyOrHabit: HobbyOrHabit) {
    if (!hobbyOrHabit) {
      return;
    }

    this.props.hobbyOrHabit = hobbyOrHabit;
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
    props: Optional<StudentHobbyOrHabitDataProps, 'description'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new StudentHobbyOrHabitData(
      { ...props, description: props.description ?? '' },
      id,
    );

    return courseStudentsData;
  }
}
