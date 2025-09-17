import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const COURSE_CHOICE_REASON = {
  hobbyRelation: 'hobbyRelation',
  financialReasons: 'financialReasons',
  courseQuality: 'courseQuality',
  sisuPreference: 'sisuPreference',
  notFirstChoice: 'notFirstChoice',
  higherEducationDesire: 'higherEducationDesire',
  professionalUpdate: 'professionalUpdate',
  other: 'other',
} as const;

export type CourseChoiceReason =
  (typeof COURSE_CHOICE_REASON)[keyof typeof COURSE_CHOICE_REASON];

export interface StudentCourseChoiceReasonProps {
  choiceReason: CourseChoiceReason;
  description: string;
}

export class StudentCourseChoiceReason extends Entity<StudentCourseChoiceReasonProps> {
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

  static create(props: StudentCourseChoiceReasonProps, id?: UniqueEntityId) {
    const teacherCourse = new StudentCourseChoiceReason(props, id);

    return teacherCourse;
  }
}
