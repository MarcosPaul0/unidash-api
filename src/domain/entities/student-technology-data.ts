import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';
import { Technology } from './student-technology';
import { Optional } from '@/core/types/optional';

export interface StudentTechnologyDataProps {
  studentIncomingDataId: string;
  technology: Technology;
  description: string;
}

export class StudentTechnologyData extends Entity<StudentTechnologyDataProps> {
  get studentIncomingDataId() {
    return this.props.studentIncomingDataId;
  }

  set studentIncomingDataId(studentIncomingDataId: string) {
    if (!studentIncomingDataId) {
      return;
    }

    this.props.studentIncomingDataId = studentIncomingDataId;
  }

  get technology() {
    return this.props.technology;
  }

  set technology(technology: Technology) {
    if (!technology) {
      return;
    }

    this.props.technology = technology;
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
    props: Optional<StudentTechnologyDataProps, 'description'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new StudentTechnologyData(
      { ...props, description: props.description ?? '' },
      id,
    );

    return courseStudentsData;
  }
}
