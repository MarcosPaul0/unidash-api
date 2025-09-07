import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';
import { Teacher } from './teacher';

export interface TeacherSupervisedCompletionWorkDataProps
  extends CourseDataProps {
  approved: number;
  failed: number;
  teacherId: string;
  teacher?: Teacher | null;
}

export class TeacherSupervisedCompletionWorkData extends CourseData<TeacherSupervisedCompletionWorkDataProps> {
  get teacherId() {
    return this.props.teacherId;
  }

  set teacherId(teacherId: string) {
    if (!teacherId) {
      return;
    }

    this.props.teacherId = teacherId;
  }

  get approved() {
    return this.props.approved;
  }

  set approved(approved: number) {
    if (!approved) {
      return;
    }

    this.props.approved = approved;
  }

  get failed() {
    return this.props.failed;
  }

  set failed(failed: number) {
    if (!failed) {
      return;
    }

    this.props.failed = failed;
  }

  get teacher(): Teacher | null {
    return this.props.teacher ?? null;
  }

  set teacher(teacher: Teacher) {
    if (!teacher) {
      return;
    }

    this.props.teacher = teacher;
  }

  static create(
    props: Optional<TeacherSupervisedCompletionWorkDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new TeacherSupervisedCompletionWorkData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseStudentsData;
  }
}
