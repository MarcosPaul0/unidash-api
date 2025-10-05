import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const UNIVERSITY_CHOICE_REASON = {
  reputation: 'reputation',
  closePeople: 'closePeople',
  publicEducation: 'publicEducation',
  professionalReasons: 'professionalReasons',
  financialReasons: 'financialReasons',
  notFirstChoice: 'notFirstChoice',
  closeOriginCity: 'closeOriginCity',
  other: 'other',
} as const;

export type UniversityChoiceReason =
  (typeof UNIVERSITY_CHOICE_REASON)[keyof typeof UNIVERSITY_CHOICE_REASON];

export interface StudentUniversityChoiceReasonProps {
  choiceReason: UniversityChoiceReason;
  description: string;
}

export class StudentUniversityChoiceReason extends Entity<StudentUniversityChoiceReasonProps> {
  get universityReason() {
    return this.props.choiceReason;
  }

  set universityReason(universityReason: UniversityChoiceReason) {
    if (!universityReason) {
      return;
    }

    this.props.choiceReason = universityReason;
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
    props: StudentUniversityChoiceReasonProps,
    id?: UniqueEntityId,
  ) {
    const teacherCourse = new StudentUniversityChoiceReason(props, id);

    return teacherCourse;
  }
}
